from __future__ import annotations

import logging
from datetime import datetime

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import PERCENTAGE
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .coordinator import PublicCoordinator
from .data import CourseOccurrence, courses_for_day, courses_for_week
from .entity import AiFitnessEntity

_LOGGER = logging.getLogger(__name__)

VALID_LEVELS = ("low", "medium", "high")


def _occurrence_dict(course: CourseOccurrence, now: datetime) -> dict[str, object]:
    return {
        "course_id": course.course_id,
        "name": course.name,
        "start": course.start.isoformat(),
        "end": course.end.isoformat(),
        "room": course.room,
        "booked": course.booked,
        "capacity": course.capacity,
        "is_full": course.is_full,
        "status": course.status,
        "in_progress": course.is_in_progress(now),
    }


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: PublicCoordinator = entry.runtime_data
    async_add_entities(
        [
            OccupancySensor(coordinator, entry),
            OccupancyLevelSensor(coordinator, entry),
            NextCourseSensor(coordinator, entry),
        ]
    )


class OccupancySensor(AiFitnessEntity, SensorEntity):
    _attr_translation_key = "occupancy"
    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_icon = "mdi:account-group"
    _unrecorded_attributes = frozenset(
        {"forecast_today", "forecast_week", "opening_hours", "address"}
    )

    def __init__(self, coordinator: PublicCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "occupancy")

    @property
    def native_value(self) -> int | None:
        return self.coordinator.data.occupancy if self.coordinator.data else None

    @property
    def extra_state_attributes(self) -> dict[str, object]:
        data = self.coordinator.data
        if data is None:
            return {}
        address = data.studio.address.as_dict()
        return {
            "is_open": data.is_open,
            "occupancy_level": data.occupancy_level,
            "studio_name": data.studio.name,
            "utilization_public": data.utilization_public,
            "forecast_today": [slot.as_dict() for slot in data.forecast_today],
            "forecast_week": {
                day: [slot.as_dict() for slot in slots]
                for day, slots in data.forecast_week.items()
            },
            "opening_hours": data.studio.opening_hours_dict(),
            "address": address,
            "latitude": address["latitude"],
            "longitude": address["longitude"],
            "studio_id": data.studio.id,
        }


class OccupancyLevelSensor(AiFitnessEntity, SensorEntity):
    _attr_translation_key = "occupancy_level"
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = VALID_LEVELS
    _attr_icon = "mdi:speedometer"

    def __init__(self, coordinator: PublicCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "occupancy_level")
        self._warned_levels: set[str] = set()

    @property
    def native_value(self) -> str | None:
        value = self.coordinator.data.occupancy_level if self.coordinator.data else None
        if value is None:
            return None
        if value not in VALID_LEVELS:
            if value not in self._warned_levels:
                self._warned_levels.add(value)
                _LOGGER.warning("Unknown occupancy level from API: %s", value)
            return None
        return value


class NextCourseSensor(AiFitnessEntity, SensorEntity):
    _attr_translation_key = "next_course"
    _attr_icon = "mdi:calendar-clock"
    _unrecorded_attributes = frozenset({"today", "week"})

    def __init__(self, coordinator: PublicCoordinator, entry: ConfigEntry) -> None:
        super().__init__(coordinator, entry, "next_course")

    @property
    def native_value(self) -> str | None:
        data = self.coordinator.data
        if data is None or data.next_course is None:
            return None
        return data.next_course.name

    @property
    def extra_state_attributes(self) -> dict[str, object]:
        data = self.coordinator.data
        if data is None:
            return {}
        now = data.now
        attributes: dict[str, object] = {
            "today": [
                _occurrence_dict(course, now)
                for course in courses_for_day(data.courses, now.date(), now)
            ],
            "week": [
                _occurrence_dict(course, now)
                for course in courses_for_week(data.courses, now)
            ],
        }
        if data.next_course is not None:
            attributes.update(_occurrence_dict(data.next_course, now))
        return attributes
