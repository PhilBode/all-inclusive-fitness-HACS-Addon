from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import CONF_BASE_URL, CONF_STUDIO_ID, CONF_STUDIO_NAME, CONF_TENANT, DOMAIN
from .coordinator import PublicCoordinator


class AiFitnessEntity(CoordinatorEntity[PublicCoordinator]):
    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: PublicCoordinator,
        entry: ConfigEntry,
        key: str,
    ) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        studio_id = entry.data[CONF_STUDIO_ID]
        tenant = entry.data[CONF_TENANT]
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{tenant}_{studio_id}")},
            name=entry.data.get(CONF_STUDIO_NAME) or f"Studio {studio_id}",
            manufacturer="all inclusive Fitness",
            model="Studio",
            entry_type=DeviceEntryType.SERVICE,
            configuration_url=entry.data.get(CONF_BASE_URL),
        )
