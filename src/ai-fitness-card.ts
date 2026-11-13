import { LitElement, html, nothing } from "lit";

import "./editor";
import { dateKey, localeFor, todayHours } from "./format";
import { translate } from "./strings";
import type {
  AiFitnessCardConfig,
  CourseAttributes,
  HomeAssistant,
  OccupancyAttributes,
  ViewContext,
} from "./types";
import {
  renderCourses,
  renderDayBars,
  renderHeader,
  renderOccupancy,
  renderSection,
  renderWeek,
} from "./views";

const CARD_CSS = new URL("ai-fitness-card.css?v=0.1.0", import.meta.url).href;

class AiFitnessCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  declare hass?: HomeAssistant;
  declare config?: AiFitnessCardConfig;

  static getStubConfig(hass: HomeAssistant) {
    const entity = Object.keys(hass.states).find(
      (id) =>
        id.startsWith("sensor.") &&
        Boolean(hass.states[id].attributes.forecast_week),
    );
    return { entity: entity ?? "" };
  }

  setConfig(config: AiFitnessCardConfig) {
    if (!config?.entity) {
      throw new Error("Please define an occupancy entity.");
    }
    this.config = {
      show_today_forecast: true,
      show_week: true,
      show_courses: true,
      show_week_courses: true,
      show_hours: true,
      compact: false,
      ...config,
    };
  }

  getCardSize() {
    return this.config?.compact ? 4 : 8;
  }

  static getConfigElement() {
    return document.createElement("ai-fitness-card-editor");
  }

  render() {
    const hass = this.hass;
    const config = this.config;
    if (!hass || !config) {
      return nothing;
    }

    const stateObj = hass.states[config.entity];
    if (!stateObj) {
      return html`${this._styleLink()}<ha-card>
          <div class="error">Entity not found: ${config.entity}</div>
        </ha-card>`;
    }

    const attrs = stateObj.attributes as OccupancyAttributes;
    const unavailable =
      stateObj.state === "unavailable" || stateObj.state === "unknown";
    const occupancy = unavailable ? null : Number(stateObj.state);
    const level = (attrs.occupancy_level ?? "").toLowerCase();
    const open = attrs.is_open === true;
    const title = config.title ?? attrs.studio_name ?? "";
    const showHours = config.show_hours !== false;

    const ctx: ViewContext = {
      language: hass.language,
      locale: localeFor(hass.language),
      timeZone: hass.config?.time_zone,
    };
    const hours = showHours
      ? todayHours(attrs.opening_hours, ctx.language, ctx.timeZone)
      : "";

    const courseObj = config.course_entity
      ? hass.states[config.course_entity]
      : undefined;
    const courseAttrs = (courseObj?.attributes ?? {}) as CourseAttributes;
    const todayCourses = courseAttrs.today ?? [];
    const todayKey = dateKey(new Date(), ctx.timeZone);
    const weekCourses = (courseAttrs.week ?? []).filter(
      (course) => dateKey(new Date(course.start), ctx.timeZone) !== todayKey,
    );

    return html`${this._styleLink()}<ha-card>
        ${renderHeader(title, open, hours, ctx)}
        ${renderOccupancy(occupancy, level, unavailable, ctx)}
        ${
          config.show_today_forecast !== false &&
          !config.compact &&
          attrs.forecast_today?.length
            ? renderSection(
                translate(ctx.language, "today"),
                renderDayBars(attrs.forecast_today, ctx),
              )
            : nothing
        }
        ${
          config.show_courses !== false && todayCourses.length
            ? renderCourses(
                translate(ctx.language, "coursesToday"),
                todayCourses,
                8,
                false,
                ctx,
              )
            : nothing
        }
        ${
          config.show_week !== false && attrs.forecast_week
            ? renderWeek(attrs.forecast_week, ctx)
            : nothing
        }
        ${
          config.show_courses !== false &&
          config.show_week_courses !== false &&
          weekCourses.length &&
          !config.compact
            ? renderCourses(
                translate(ctx.language, "coursesWeek"),
                weekCourses,
                12,
                true,
                ctx,
              )
            : nothing
        }
      </ha-card>`;
  }

  private _styleLink() {
    return html`<link rel="stylesheet" href=${CARD_CSS} />`;
  }
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }
}

if (!customElements.get("ai-fitness-card")) {
  customElements.define("ai-fitness-card", AiFitnessCard);
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ai-fitness-card",
  name: "AI Fitness Card",
  description:
    "Live occupancy, opening hours and courses for all inclusive Fitness.",
});

export {};
