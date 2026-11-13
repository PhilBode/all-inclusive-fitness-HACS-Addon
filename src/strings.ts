export const STRINGS = {
  de: {
    open: "Geöffnet",
    closed: "Geschlossen",
    today: "Heute",
    week: "Woche",
    coursesToday: "Kurse heute",
    coursesWeek: "Kurse diese Woche",
    closedToday: "Heute geschlossen",
    noData: "Keine Daten",
    estimate: "geschätzt",
    full: "voll",
    running: "läuft",
  },
  en: {
    open: "Open",
    closed: "Closed",
    today: "Today",
    week: "Week",
    coursesToday: "Courses today",
    coursesWeek: "Courses this week",
    closedToday: "Closed today",
    noData: "No data",
    estimate: "estimated",
    full: "full",
    running: "running",
  },
} as const;

export type StringKey = keyof typeof STRINGS.en;

export function translate(language: string, key: StringKey): string {
  return language === "de" ? STRINGS.de[key] : STRINGS.en[key];
}
