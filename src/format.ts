import { translate } from "./strings";
import type { OpeningRange } from "./types";

export function clamp(value: number): number {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export function localeFor(language: string): string {
  return language === "de" ? "de-DE" : "en-GB";
}

export function formatTime(
  value: string,
  locale: string,
  timeZone?: string,
): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
}

export function formatDate(
  value: string,
  locale: string,
  timeZone?: string,
): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(locale, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone,
  });
}

export function weekdayName(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone,
  }).format(date);
}

export function dateKey(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(date);
}

export function todayHours(
  hours: Record<string, OpeningRange[]> | undefined,
  language: string,
  timeZone?: string,
): string {
  if (!hours) {
    return translate(language, "noData");
  }

  const key = weekdayName(new Date(), timeZone).toLowerCase();
  const ranges = hours[key] ?? [];
  return ranges.length
    ? ranges.map((range) => `${range.start}–${range.end}`).join(", ")
    : translate(language, "closedToday");
}
