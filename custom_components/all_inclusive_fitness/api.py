from __future__ import annotations

import json
from collections.abc import Mapping
from datetime import UTC, datetime
from email.utils import parsedate_to_datetime
from typing import Any

import aiohttp

from .const import (
    COURSES_PATH,
    REQUEST_TIMEOUT,
    REVEAL_PATH,
    STUDIO_PATH,
    TENANT_PATH,
    USER_AGENT,
    UTILIZATION_PATH,
    WEEK_PATH,
    WHITELABEL_PATH,
)


class ApiError(Exception):
    pass


class ApiUnauthorized(ApiError):
    pass


class ApiForbidden(ApiError):
    pass


class ApiNotFound(ApiError):
    pass


class ApiRateLimited(ApiError):
    def __init__(self, message: str, retry_after: int | None = None) -> None:
        super().__init__(message)
        self.retry_after = retry_after


class AiFitnessApi:
    def __init__(
        self,
        session: aiohttp.ClientSession,
        base_url: str,
        tenant: str | None = None,
    ) -> None:
        self._session = session
        self.base_url = base_url.rstrip("/")
        self.tenant = tenant

    async def get_whitelabel_config(self) -> dict[str, Any]:
        payload = await self._request(WHITELABEL_PATH, with_tenant=False)
        return payload if isinstance(payload, dict) else {}

    async def get_studios(self) -> list[dict[str, Any]]:
        payload = await self._request(TENANT_PATH)
        studios = payload.get("studios") if isinstance(payload, dict) else None
        if not isinstance(studios, list):
            return []
        return [studio for studio in studios if isinstance(studio, dict)]

    async def get_studio(self, studio_id: str) -> dict[str, Any]:
        payload = await self._request(STUDIO_PATH.format(studio_id=studio_id))
        return payload if isinstance(payload, dict) else {}

    async def get_utilization(self, studio_id: str) -> dict[str, Any]:
        payload = await self._request(UTILIZATION_PATH.format(studio_id=studio_id))
        return payload if isinstance(payload, dict) else {}

    async def get_week(self, studio_id: str) -> dict[str, Any]:
        payload = await self._request(WEEK_PATH.format(studio_id=studio_id))
        return payload if isinstance(payload, dict) else {}

    async def get_reveal(self, studio_id: str) -> bool | None:
        payload = await self._request(REVEAL_PATH.format(studio_id=studio_id))
        if isinstance(payload, dict) and isinstance(payload.get("value"), bool):
            return payload["value"]
        return None

    async def get_courses(self, studio_id: str) -> list[dict[str, Any]]:
        payload = await self._request(
            COURSES_PATH,
            params={"organizationUnitId": studio_id},
        )
        if not isinstance(payload, list):
            return []
        return [course for course in payload if isinstance(course, dict)]

    async def _request(
        self,
        path: str,
        *,
        with_tenant: bool = True,
        params: dict[str, str] | None = None,
    ) -> Any:
        headers = {
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
            "Accept-Language": "de-DE",
        }
        if with_tenant:
            if not self.tenant:
                raise ApiError("Tenant is missing")
            headers["X-Tenant"] = self.tenant

        try:
            async with self._session.get(
                f"{self.base_url}{path}",
                headers=headers,
                params=params,
                timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT),
            ) as response:
                text = await response.text()
                if response.status == 200:
                    if not text:
                        return None
                    try:
                        return json.loads(text)
                    except json.JSONDecodeError as err:
                        raise ApiError("Invalid JSON response") from err
                self._raise_api_error(response.status, response.headers, text)
        except TimeoutError as err:
            raise ApiError("Request timed out") from err
        except aiohttp.ClientError as err:
            raise ApiError(f"Connection error: {err}") from err

    def _raise_api_error(
        self, status: int, headers: Mapping[str, str], text: str
    ) -> None:
        message = text[:200]
        try:
            payload = json.loads(text)
            if isinstance(payload, dict):
                message = str(payload.get("errorMessage") or message)
        except json.JSONDecodeError:
            pass

        if status == 401:
            raise ApiUnauthorized(message)
        if status == 403:
            raise ApiForbidden(message)
        if status == 404:
            raise ApiNotFound(message)
        if status == 429:
            raise ApiRateLimited(
                message,
                retry_after=_parse_retry_after(headers.get("Retry-After")),
            )
        raise ApiError(message)


def _parse_retry_after(value: str | None) -> int | None:
    if not value:
        return None
    value = value.strip()
    if value.isdigit():
        return int(value)
    try:
        parsed = parsedate_to_datetime(value)
    except (TypeError, ValueError):
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=UTC)
    return max(0, int((parsed - datetime.now(UTC)).total_seconds()))
