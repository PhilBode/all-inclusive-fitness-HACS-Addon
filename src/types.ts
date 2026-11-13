export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  config?: { time_zone?: string };
}

export interface AiFitnessCardConfig {
  type?: string;
  entity: string;
  course_entity?: string;
  title?: string;
  show_today_forecast?: boolean;
  show_week?: boolean;
  show_courses?: boolean;
  show_week_courses?: boolean;
  show_hours?: boolean;
  compact?: boolean;
}

export interface OpeningRange {
  start: string;
  end: string;
}

export interface ForecastSlot {
  start: string;
  end: string;
  percentage: number;
  level?: string | null;
  is_estimate?: boolean;
}

export interface Course {
  name?: string;
  start: string;
  end: string;
  booked?: number;
  capacity?: number;
  is_full?: boolean;
  in_progress?: boolean;
}

export interface OccupancyAttributes {
  is_open?: boolean;
  occupancy_level?: string;
  studio_name?: string;
  forecast_today?: ForecastSlot[];
  forecast_week?: Record<string, ForecastSlot[]>;
  opening_hours?: Record<string, OpeningRange[]>;
}

export interface CourseAttributes {
  today?: Course[];
  week?: Course[];
}

export interface ViewContext {
  language: string;
  locale: string;
  timeZone?: string;
}
