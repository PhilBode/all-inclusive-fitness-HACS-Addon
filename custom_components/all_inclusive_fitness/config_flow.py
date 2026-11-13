from __future__ import annotations

import re
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import SelectSelector, SelectSelectorConfig

from .api import AiFitnessApi, ApiError, ApiNotFound
from .const import (
    ADMIN_STUDIO_RE,
    CONF_BASE_URL,
    CONF_SCAN_INTERVAL,
    CONF_STUDIO_ID,
    CONF_STUDIO_NAME,
    CONF_TENANT,
    DEFAULT_BASE_URL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    MAX_SCAN_INTERVAL,
    MIN_SCAN_INTERVAL,
    SUPPORTED_TENANT,
)

SEARCH_SCHEMA = vol.Schema({vol.Required("query", default=""): str})


class AllInclusiveFitnessConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    def __init__(self) -> None:
        self._base_url = DEFAULT_BASE_URL
        self._tenant = SUPPORTED_TENANT
        self._studios: dict[str, str] = {}

    async def async_step_user(self, user_input: dict[str, Any] | None = None):
        if user_input is None:
            return self._show_search_form()

        studios, error = await self._find_studios(str(user_input.get("query") or ""))
        if error:
            return self._show_search_form(error)
        if not studios:
            return self._show_search_form("no_studios_found")

        self._studios = studios
        return await self.async_step_select()

    async def async_step_select(self, user_input: dict[str, Any] | None = None):
        if not self._studios:
            return self.async_abort(reason="no_studios_found")
        if user_input is None:
            return self._show_select_form()

        studio_id = str(user_input["studio"])
        name = self._studios.get(studio_id)
        if name is None:
            return self._show_select_form("studio_not_found")

        try:
            studio = await self._api(self._base_url, self._tenant).get_studio(studio_id)
        except ApiNotFound:
            return self._show_select_form("studio_not_found")
        except ApiError:
            return self._show_select_form("cannot_connect")

        return await self._create_entry(studio_id, str(studio.get("name") or name))

    async def _find_studios(self, query: str) -> tuple[dict[str, str], str | None]:
        query = query.strip().lower()
        api = self._api(DEFAULT_BASE_URL, None)
        try:
            config = await api.get_whitelabel_config()
        except ApiError:
            return {}, "cannot_connect"

        tenant = config.get("tenantName")
        if tenant != SUPPORTED_TENANT:
            return {}, "unsupported_tenant"

        self._tenant = tenant
        self._base_url = DEFAULT_BASE_URL
        api.tenant = tenant

        try:
            all_studios = await api.get_studios()
        except ApiError:
            return {}, "cannot_connect"

        matches = [
            studio
            for studio in all_studios
            if not re.search(
                ADMIN_STUDIO_RE, str(studio.get("name") or ""), re.IGNORECASE
            )
            and _matches(studio, query)
        ]
        return {
            str(studio.get("id")): str(studio.get("name") or "")
            for studio in matches
            if studio.get("id") is not None
        }, None

    def _api(self, base_url: str, tenant: str | None) -> AiFitnessApi:
        return AiFitnessApi(async_get_clientsession(self.hass), base_url, tenant)

    def _show_search_form(self, error: str | None = None):
        return self.async_show_form(
            step_id="user",
            data_schema=SEARCH_SCHEMA,
            errors={"base": error} if error else {},
        )

    def _show_select_form(self, error: str | None = None):
        return self.async_show_form(
            step_id="select",
            data_schema=self._select_schema(),
            errors={"base": error} if error else {},
        )

    def _select_schema(self) -> vol.Schema:
        options = [
            {"value": studio_id, "label": name}
            for studio_id, name in sorted(
                self._studios.items(), key=lambda item: item[1].lower()
            )
        ]
        return vol.Schema(
            {
                vol.Required("studio"): SelectSelector(
                    SelectSelectorConfig(options=options)
                )
            }
        )

    async def _create_entry(self, studio_id: str, name: str):
        await self.async_set_unique_id(f"{self._tenant}_{studio_id}")
        self._abort_if_unique_id_configured()
        return self.async_create_entry(
            title=name,
            data={
                CONF_BASE_URL: self._base_url.rstrip("/"),
                CONF_TENANT: self._tenant,
                CONF_STUDIO_ID: studio_id,
                CONF_STUDIO_NAME: name,
            },
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        return AllInclusiveFitnessOptionsFlow()


class AllInclusiveFitnessOptionsFlow(config_entries.OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None):
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        current = self.config_entry.options.get(
            CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL
        )
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_SCAN_INTERVAL, default=current): vol.All(
                        vol.Coerce(int),
                        vol.Range(min=MIN_SCAN_INTERVAL, max=MAX_SCAN_INTERVAL),
                    )
                }
            ),
        )


def _matches(studio: dict[str, Any], query: str) -> bool:
    if not query:
        return True
    name = str(studio.get("name") or "").lower()
    address = studio.get("address")
    city = str(address.get("city") or "").lower() if isinstance(address, dict) else ""
    return query in name or query in city
