export const STRINGS = {
  de: {
    open: "Geöffnet",
    closed: "Geschlossen",
    today: "Heute",
    week: "Woche",
    coursesToday: "Kurse & Events heute",
    coursesWeek: "Kurse & Events diese Woche",
    closedToday: "Heute geschlossen",
    noData: "Keine Daten",
    noSensor:
      "Kein Auslastungs-Sensor gefunden. Richte zuerst die Integration ein.",
    estimate: "geschätzt",
    full: "voll",
    running: "läuft",
    editorTitle: "Titel (optional)",
    editorToday: "Heutige Auslastung anzeigen",
    editorWeek: "Wochenprognose anzeigen",
    editorCourses: "Kurse & Events heute anzeigen",
    editorWeekCourses: "Kommende Kurse & Events anzeigen",
    editorHours: "Öffnungszeiten anzeigen",
    editorCompact: "Kompaktmodus",
  },
  en: {
    open: "Open",
    closed: "Closed",
    today: "Today",
    week: "Week",
    coursesToday: "Courses & events today",
    coursesWeek: "Courses & events this week",
    closedToday: "Closed today",
    noData: "No data",
    noSensor: "No occupancy sensor found. Set up the integration first.",
    estimate: "estimated",
    full: "full",
    running: "running",
    editorTitle: "Title (optional)",
    editorToday: "Show today's utilization",
    editorWeek: "Show weekly forecast",
    editorCourses: "Show courses & events today",
    editorWeekCourses: "Show upcoming courses & events",
    editorHours: "Show opening hours",
    editorCompact: "Compact mode",
  },
} as const;

export type StringKey = keyof typeof STRINGS.en;

export function translate(language: string, key: StringKey): string {
  return language === "de" ? STRINGS.de[key] : STRINGS.en[key];
}
