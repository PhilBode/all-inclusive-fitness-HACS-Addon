from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date, datetime, time, tzinfo
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from .const import WEEKDAYS

BRACKETED_ZONE = re.compile(r"\[[^\]]+\]$")
CANCELLED_STATUSES = frozenset({"CANCELLED", "CANCELED"})
MIDNIGHT = time(0, 0)


def parse_zone(zone_id: str | None, fallback: tzinfo) -> tzinfo:
    if zone_id:
        try:
            return ZoneInfo(zone_id)
        except ZoneInfoNotFoundError:
            pass
    return fallback


def parse_api_datetime(value: str, fallback_tz: tzinfo) -> datetime:
    without_zone_name = BRACKETED_ZONE.sub("", str(value).strip())
    parsed = datetime.fromisoformat(without_zone_name)
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=fallback_tz)
    return parsed


def parse_api_time(value: str) -> time:
    return time.fromisoformat(str(value))


def short_time(value: str) -> str:
    return str(value)[:5]


@dataclass(frozen=True, slots=True)
class Address:
    street: str | None = None
    house_number: str | None = None
    zip_code: str | None = None
    city: str | None = None
    country: str | None = None
    latitude: float | None = None
    longitude: float | None = None

    def as_dict(self) -> dict[str, object]:
        return {
            "street": self.street,
            "house_number": self.house_number,
            "zip": self.zip_code,
            "city": self.city,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }


@dataclass(frozen=True, slots=True)
class OpeningRange:
    start: time
    end: time
    end_is_midnight: bool = False

    @property
    def crosses_midnight(self) -> bool:
        return not self.end_is_midnight and self.end <= self.start

    def as_dict(self) -> dict[str, str]:
        end = "24:00" if self.end_is_midnight else self.end.strftime("%H:%M")
        return {"start": self.start.strftime("%H:%M"), "end": end}


@dataclass(frozen=True, slots=True)
class Studio:
    id: str
    name: str
    zone: tzinfo
    address: Address
    opening_hours: dict[int, tuple[OpeningRange, ...]]

    def is_open_at(self, moment: datetime) -> bool:
        local_moment = moment.astimezone(self.zone)
        local_time = local_moment.time()
        weekday = local_moment.weekday()
        yesterday = (weekday - 1) % 7

        for opening in self.opening_hours.get(weekday, ()):
            if opening.end_is_midnight or opening.crosses_midnight:
                if local_time >= opening.start:
                    return True
            elif opening.start <= local_time < opening.end:
                return True

        for opening in self.opening_hours.get(yesterday, ()):
            if opening.crosses_midnight and local_time < opening.end:
                return True

        return False

    def opening_hours_dict(self) -> dict[str, list[dict[str, str]]]:
        return {
            WEEKDAYS[weekday]: [
                opening.as_dict() for opening in self.opening_hours.get(weekday, ())
            ]
            for weekday in range(7)
        }


@dataclass(frozen=True, slots=True)
class UtilizationSlot:
    start: time
    end: time
    percentage: int
    level: str | None
    is_current: bool


@dataclass(frozen=True, slots=True)
class ForecastSlot:
    start: str
    end: str
    percentage: int
    level: str | None
    is_estimate: bool = False

    def as_dict(self) -> dict[str, object]:
        return {
            "start": self.start,
            "end": self.end,
            "percentage": self.percentage,
            "level": self.level,
            "is_estimate": self.is_estimate,
        }


@dataclass(frozen=True, slots=True)
class CourseOccurrence:
    course_id: int
    name: str
    status: str
    booked: int
    capacity: int
    start: datetime
    end: datetime
    room: str | None

    @property
    def is_full(self) -> bool:
        return self.capacity > 0 and self.booked >= self.capacity

    def is_in_progress(self, moment: datetime) -> bool:
        return self.start <= moment < self.end


@dataclass(frozen=True, slots=True)
class Utilization:
    slots: tuple[UtilizationSlot, ...]

    @property
    def current(self) -> UtilizationSlot | None:
        return next((slot for slot in self.slots if slot.is_current), None)


@dataclass(frozen=True, slots=True)
class FitnessData:
    studio: Studio
    is_open: bool
    utilization_public: bool | None
    occupancy: int | None
    occupancy_level: str | None
    forecast_today: tuple[ForecastSlot, ...]
    forecast_week: dict[str, tuple[ForecastSlot, ...]]
    courses: tuple[CourseOccurrence, ...]
    next_course: CourseOccurrence | None
    now: datetime


def parse_address(payload: dict[str, object] | None) -> Address:
    data = payload or {}
    return Address(
        street=_text(data.get("street")),
        house_number=_text(data.get("houseNumber")),
        zip_code=_text(data.get("zip")),
        city=_text(data.get("city")),
        country=_text(data.get("country")),
        latitude=_number(data.get("latitude")),
        longitude=_number(data.get("longitude")),
    )


def parse_studio(payload: dict[str, object], fallback_tz: tzinfo) -> Studio:
    address = payload.get("address")
    return Studio(
        id=str(payload.get("id") or ""),
        name=str(payload.get("name") or ""),
        zone=parse_zone(_text(payload.get("zoneId")), fallback_tz),
        address=parse_address(address if isinstance(address, dict) else None),
        opening_hours=_parse_opening_hours(payload.get("openingHours")),
    )


def _parse_opening_hours(raw_hours: object) -> dict[int, tuple[OpeningRange, ...]]:
    by_weekday: dict[int, list[OpeningRange]] = {day: [] for day in range(7)}

    if not isinstance(raw_hours, list):
        return {day: () for day in range(7)}

    for entry in raw_hours:
        if not isinstance(entry, dict):
            continue

        weekdays = _expand_weekdays(entry)
        times = _parse_opening_times(entry)
        if weekdays is None or times is None:
            continue

        start, end = times
        if start == MIDNIGHT and end == MIDNIGHT:
            continue

        opening = OpeningRange(
            start=start,
            end=end,
            end_is_midnight=end == MIDNIGHT,
        )
        for weekday in weekdays:
            by_weekday[weekday].append(opening)

    return {day: tuple(ranges) for day, ranges in by_weekday.items()}


def _expand_weekdays(entry: dict[str, object]) -> list[int] | None:
    first_name = str(entry.get("dayOfWeekFrom") or "").upper()
    last_name = str(entry.get("dayOfWeekTo") or first_name).upper()
    first = _weekday_index(first_name)
    last = _weekday_index(last_name)
    if first is None or last is None:
        return None
    if first == last:
        return [first]

    weekdays: list[int] = []
    current = first
    while True:
        weekdays.append(current)
        if current == last:
            return weekdays
        current = (current + 1) % 7


def _weekday_index(name: str) -> int | None:
    try:
        return WEEKDAYS.index(name.lower())
    except ValueError:
        return None


def _parse_opening_times(entry: dict[str, object]) -> tuple[time, time] | None:
    try:
        return (
            parse_api_time(str(entry.get("timeFrom") or "")),
            parse_api_time(str(entry.get("timeTo") or "")),
        )
    except ValueError:
        return None


def parse_utilization(payload: dict[str, object]) -> Utilization:
    slots: list[UtilizationSlot] = []
    for item in payload.get("items") or []:
        if not isinstance(item, dict):
            continue

        try:
            start = parse_api_time(str(item.get("startTime") or ""))
            end = parse_api_time(str(item.get("endTime") or ""))
            percentage = int(item.get("percentage") or 0)
        except (TypeError, ValueError):
            continue

        level = item.get("level")
        slots.append(
            UtilizationSlot(
                start=start,
                end=end,
                percentage=percentage,
                level=str(level).lower() if level else None,
                is_current=bool(item.get("isCurrent")),
            )
        )

    return Utilization(slots=tuple(slots))


def build_today_forecast(
    utilization: Utilization | None, now: datetime
) -> tuple[ForecastSlot, ...]:
    if utilization is None:
        return ()

    forecast: list[ForecastSlot] = []
    for slot in utilization.slots:
        slot_start = datetime.combine(now.date(), slot.start, tzinfo=now.tzinfo)
        forecast.append(
            ForecastSlot(
                start=slot.start.strftime("%H:%M"),
                end=slot.end.strftime("%H:%M"),
                percentage=slot.percentage,
                level=slot.level,
                is_estimate=slot_start > now,
            )
        )
    return tuple(forecast)


def parse_week(payload: dict[str, object]) -> dict[str, tuple[ForecastSlot, ...]]:
    raw_days = payload.get("days")
    if not isinstance(raw_days, dict):
        return {}

    forecast: dict[str, tuple[ForecastSlot, ...]] = {}
    for day_name, raw_slots in raw_days.items():
        if not isinstance(raw_slots, list):
            continue

        slots: list[ForecastSlot] = []
        for item in raw_slots:
            if not isinstance(item, dict):
                continue
            try:
                percentage = int(item.get("percentage") or 0)
            except (TypeError, ValueError):
                continue
            slots.append(
                ForecastSlot(
                    start=short_time(str(item.get("startTime") or "")),
                    end=short_time(str(item.get("endTime") or "")),
                    percentage=percentage,
                    level=None,
                )
            )
        forecast[str(day_name).upper()] = tuple(slots)

    return forecast


def parse_courses(payload: object, fallback_tz: tzinfo) -> tuple[CourseOccurrence, ...]:
    if not isinstance(payload, list):
        return ()

    occurrences: list[CourseOccurrence] = []
    for item in payload:
        if not isinstance(item, dict):
            continue
        occurrences.extend(_parse_course(item, fallback_tz))

    occurrences.sort(key=lambda occurrence: occurrence.start)
    return tuple(occurrences)


def _parse_course(
    item: dict[str, object], fallback_tz: tzinfo
) -> list[CourseOccurrence]:
    status = str(item.get("appointmentStatus") or "")
    if status.upper() in CANCELLED_STATUSES:
        return []

    course_id = _integer(item.get("id"))
    name = str(item.get("name") or "Course")
    booked = _integer(item.get("bookedParticipants"))
    capacity = _integer(item.get("maxParticipants"))

    occurrences: list[CourseOccurrence] = []
    raw_slots = item.get("slots")
    if not isinstance(raw_slots, list):
        return []

    for slot in raw_slots:
        if not isinstance(slot, dict):
            continue

        try:
            start = parse_api_datetime(
                str(slot.get("startDateTime") or ""), fallback_tz
            )
            end = parse_api_datetime(str(slot.get("endDateTime") or ""), fallback_tz)
        except ValueError:
            continue
        if end <= start:
            continue

        occurrences.append(
            CourseOccurrence(
                course_id=course_id,
                name=name,
                status=status,
                booked=booked,
                capacity=capacity,
                start=start,
                end=end,
                room=_first_location_name(slot.get("locations")),
            )
        )

    return occurrences


def _first_location_name(locations: object) -> str | None:
    if not isinstance(locations, list) or not locations:
        return None
    first = locations[0]
    if not isinstance(first, dict):
        return None
    return _text(first.get("name"))


def pick_next_course(
    courses: tuple[CourseOccurrence, ...], now: datetime
) -> CourseOccurrence | None:
    return next((course for course in courses if course.end > now), None)


def courses_for_day(
    courses: tuple[CourseOccurrence, ...], day: date, now: datetime
) -> tuple[CourseOccurrence, ...]:
    return tuple(
        course for course in courses if course.end > now and course.start.date() == day
    )


def courses_for_week(
    courses: tuple[CourseOccurrence, ...], now: datetime
) -> tuple[CourseOccurrence, ...]:
    return tuple(course for course in courses if course.end > now)


def _text(value: object) -> str | None:
    return None if value is None else str(value)


def _integer(value: object) -> int:
    try:
        return int(value or 0)
    except (TypeError, ValueError):
        return 0


def _number(value: object) -> float | None:
    return float(value) if isinstance(value, (int, float)) else None
