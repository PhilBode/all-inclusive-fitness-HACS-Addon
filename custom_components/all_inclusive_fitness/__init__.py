from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.lovelace.const import LOVELACE_DATA
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .api import AiFitnessApi
from .const import (
    CARD_PATH,
    CARD_STATIC_PATH,
    CARD_URL,
    CONF_BASE_URL,
    CONF_SCAN_INTERVAL,
    CONF_TENANT,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
)
from .coordinator import PublicCoordinator

LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.BINARY_SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    session = async_get_clientsession(hass)
    api = AiFitnessApi(
        session,
        entry.data[CONF_BASE_URL],
        entry.data[CONF_TENANT],
    )
    scan_interval = entry.options.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
    coordinator = PublicCoordinator(hass, entry, api, scan_interval)
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator
    await _async_register_card(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def _async_update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_card(hass: HomeAssistant) -> None:
    if hass.data.get(DOMAIN):
        return

    card_path = Path(__file__).parent / "www"
    if not card_path.is_dir():
        return

    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                CARD_STATIC_PATH,
                str(card_path),
                cache_headers=True,
            )
        ]
    )
    try:
        await _async_register_resource(hass)
    except Exception:
        LOGGER.exception("Could not register the card resource")
    hass.data[DOMAIN] = True


async def _async_register_resource(hass: HomeAssistant) -> None:
    lovelace = hass.data.get(LOVELACE_DATA)
    if lovelace is None:
        return

    resources = lovelace.resources
    if not hasattr(resources, "async_create_item"):
        return

    if not getattr(resources, "loaded", False):
        await resources.async_load()
        resources.loaded = True

    for item in resources.async_items():
        if str(item.get("url", "")).split("?", 1)[0] == CARD_PATH:
            if item.get("url") != CARD_URL and item.get("id"):
                await resources.async_update_item(item["id"], {"url": CARD_URL})
            return

    await resources.async_create_item({"res_type": "module", "url": CARD_URL})
