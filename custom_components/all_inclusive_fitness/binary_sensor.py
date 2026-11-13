from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .coordinator import PublicCoordinator
from .entity import AiFitnessEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: PublicCoordinator = entry.runtime_data
    async_add_entities([IsOpenBinarySensor(coordinator, entry)])


class IsOpenBinarySensor(AiFitnessEntity, BinarySensorEntity):
    _attr_translation_key = "is_open"
    _attr_device_class = BinarySensorDeviceClass.OPENING

    def __init__(self, coordinator: PublicCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "is_open")

    @property
    def is_on(self) -> bool | None:
        return self.coordinator.data.is_open if self.coordinator.data else None

    @property
    def icon(self) -> str:
        if self.is_on is None:
            return "mdi:door"
        return "mdi:door-open" if self.is_on else "mdi:door-closed"
