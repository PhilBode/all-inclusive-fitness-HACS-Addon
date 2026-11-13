from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from datetime import datetime, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import AiFitnessApi, ApiError, ApiForbidden, ApiRateLimited, ApiUnauthorized
from .const import (
    CONF_STUDIO_ID,
    COURSES_TTL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    RATE_LIMIT_FALLBACK,
    REVEAL_TTL,
    STUDIO_TTL,
    UTILIZATION_TTL,
    WAF_BACKOFF,
    WEEK_TTL,
)
from .data import (
    CourseOccurrence,
    FitnessData,
    ForecastSlot,
    Studio,
    Utilization,
    build_today_forecast,
    parse_courses,
    parse_studio,
    parse_utilization,
    parse_week,
    pick_next_course,
)

LOGGER = logging.getLogger(__name__)

NOT_FETCHED = object()


class PublicCoordinator(DataUpdateCoordinator[FitnessData]):
    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        api: AiFitnessApi,
        scan_interval: int = DEFAULT_SCAN_INTERVAL,
    ) -> None:
        super().__init__(
            hass,
            LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=scan_interval),
            config_entry=entry,
        )
        self.entry = entry
        self.api = api
        self.studio_id = str(entry.data[CONF_STUDIO_ID])

        self._studio: Studio | None = None
        self._utilization_public: bool | None = None
        self._utilization: Utilization | None = None
        self._forecast_week: dict[str, tuple[ForecastSlot, ...]] = {}
        self._courses: tuple[CourseOccurrence, ...] = ()

        self._last_fetch: dict[str, datetime] = {}
        self._next_attempt: dict[str, datetime] = {}
        self._rate_limit_strikes: dict[str, int] = {}
        self._blocked_until: datetime | None = None

    @property
    def studio(self) -> Studio | None:
        return self._studio

    async def _async_update_data(self) -> FitnessData:
        now = dt_util.utcnow()

        if self._is_blocked(now):
            raise UpdateFailed("API backoff is active")

        try:
            await self._refresh_studio(now)
            studio = self._studio
            if studio is None:
                raise UpdateFailed("Studio details are not available")

            local_now = dt_util.now(studio.zone)
            is_open = studio.is_open_at(local_now)

            await self._refresh_utilization_visibility(now)
            await self._refresh_utilization(now, is_open)
            await self._refresh_week(now)
            await self._refresh_courses(now)
        except ApiForbidden as err:
            self._blocked_until = now + WAF_BACKOFF
            self._create_issue(err)
            raise UpdateFailed(f"API blocked the request: {err}") from err
        except ApiUnauthorized as err:
            self._create_issue(err)
            raise UpdateFailed(f"API rejected the request: {err}") from err
        except ApiError as err:
            raise UpdateFailed(str(err)) from err

        self._blocked_until = None
        self._clear_issue()
        return self._build_data(studio, is_open, local_now)

    async def _refresh_studio(self, now: datetime) -> None:
        payload = await self._fetch_if_due("studio", STUDIO_TTL, self._load_studio, now)
        if payload is NOT_FETCHED:
            return

        fallback_timezone = dt_util.get_time_zone(self.hass.config.time_zone)
        self._studio = parse_studio(payload, fallback_timezone or dt_util.UTC)

    async def _refresh_utilization_visibility(self, now: datetime) -> None:
        value = await self._fetch_if_due(
            "visibility", REVEAL_TTL, self._load_utilization_visibility, now
        )
        if value is not NOT_FETCHED:
            self._utilization_public = value

    async def _refresh_utilization(self, now: datetime, is_open: bool) -> None:
        if not is_open or self._utilization_public is False:
            self._utilization = None
            return

        payload = await self._fetch_if_due(
            "utilization", UTILIZATION_TTL, self._load_utilization, now
        )
        if payload is not NOT_FETCHED:
            self._utilization = parse_utilization(payload)

    async def _refresh_week(self, now: datetime) -> None:
        payload = await self._fetch_if_due("week", WEEK_TTL, self._load_week, now)
        if payload is not NOT_FETCHED:
            self._forecast_week = parse_week(payload)

    async def _refresh_courses(self, now: datetime) -> None:
        payload = await self._fetch_if_due(
            "courses", COURSES_TTL, self._load_courses, now
        )
        if payload is not NOT_FETCHED:
            self._courses = parse_courses(payload, self._studio.zone)

    async def _load_studio(self) -> dict[str, Any]:
        return await self.api.get_studio(self.studio_id)

    async def _load_utilization_visibility(self) -> bool | None:
        return await self.api.get_reveal(self.studio_id)

    async def _load_utilization(self) -> dict[str, Any]:
        return await self.api.get_utilization(self.studio_id)

    async def _load_week(self) -> dict[str, Any]:
        return await self.api.get_week(self.studio_id)

    async def _load_courses(self) -> list[dict[str, Any]]:
        return await self.api.get_courses(self.studio_id)

    async def _fetch_if_due(
        self,
        key: str,
        ttl: timedelta,
        loader: Callable[[], Awaitable[Any]],
        now: datetime,
    ) -> Any:
        last = self._last_fetch.get(key)
        if last is not None and now - last < ttl:
            return NOT_FETCHED

        next_attempt = self._next_attempt.get(key)
        if next_attempt is not None and now < next_attempt:
            return NOT_FETCHED

        try:
            value = await loader()
        except ApiRateLimited as err:
            self._remember_rate_limit(key, now, err)
            return NOT_FETCHED

        self._rate_limit_strikes.pop(key, None)
        self._last_fetch[key] = now
        return value

    def _remember_rate_limit(
        self, key: str, now: datetime, error: ApiRateLimited
    ) -> None:
        strikes = self._rate_limit_strikes.get(key, 0)
        delay = error.retry_after
        if delay is None:
            delay = RATE_LIMIT_FALLBACK[min(strikes, len(RATE_LIMIT_FALLBACK) - 1)]

        self._rate_limit_strikes[key] = strikes + 1
        self._next_attempt[key] = now + timedelta(seconds=max(1, int(delay)))
        LOGGER.warning(
            "Rate limited while fetching %s; retrying in %s seconds", key, delay
        )

    def _build_data(self, studio: Studio, is_open: bool, now: datetime) -> FitnessData:
        current = self._utilization.current if self._utilization else None
        return FitnessData(
            studio=studio,
            is_open=is_open,
            utilization_public=self._utilization_public,
            occupancy=current.percentage if current else None,
            occupancy_level=current.level if current else None,
            forecast_today=build_today_forecast(self._utilization, now),
            forecast_week=self._forecast_week,
            courses=self._courses,
            next_course=pick_next_course(self._courses, now),
            now=now,
        )

    def _is_blocked(self, now: datetime) -> bool:
        return self._blocked_until is not None and now < self._blocked_until

    def _create_issue(self, error: ApiError) -> None:
        ir.async_create_issue(
            self.hass,
            DOMAIN,
            f"{self.entry.entry_id}_api",
            is_fixable=False,
            is_persistent=True,
            severity=ir.IssueSeverity.WARNING,
            translation_key="api_error",
            translation_placeholders={"error": str(error)},
        )

    def _clear_issue(self) -> None:
        ir.async_delete_issue(self.hass, DOMAIN, f"{self.entry.entry_id}_api")
