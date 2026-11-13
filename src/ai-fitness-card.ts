import { LitElement, html, nothing } from "lit";

import "./editor";
import { dateKey, localeFor, todayHours } from "./format";
import { translate } from "./strings";
import type {
  AiFitnessCardConfig,
  Course,
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
  renderStatus,
  renderWeek,
} from "./views";

const CARD_CSS = new URL("ai-fitness-card.css", import.meta.url).href;

class AiFitnessCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
    _detailOpen: { state: true },
  };

  declare hass?: HomeAssistant;
  declare config?: AiFitnessCardConfig;
  private _detailOpen = false;

  static getStubConfig() {
    return {};
  }

  setConfig(config: AiFitnessCardConfig) {
    this.config = {
      show_today_forecast: true,
      show_week: true,
      show_courses: true,
      show_week_courses: true,
      show_hours: true,
      ...config,
    };
  }

  getCardSize() {
    return 8;
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

    const entity = this._findOccupancyEntity();
    const stateObj = entity ? hass.states[entity] : undefined;
    if (!stateObj) {
      return html`${this._styleLink()}<ha-card>
          <div class="error">${translate(hass.language, "noSensor")}</div>
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
    const fullHours = todayHours(
      attrs.opening_hours,
      ctx.language,
      ctx.timeZone,
    );
    const hours = showHours ? fullHours : "";

    const courseEntity = this._findCourseEntity();
    const courseObj = courseEntity ? hass.states[courseEntity] : undefined;
    const courseAttrs = (courseObj?.attributes ?? {}) as CourseAttributes;
    const todayCourses = courseAttrs.today ?? [];
    const todayKey = dateKey(new Date(), ctx.timeZone);
    const weekCourses = (courseAttrs.week ?? []).filter(
      (course) => dateKey(new Date(course.start), ctx.timeZone) !== todayKey,
    );

    return html`${this._styleLink()}
      <ha-card
        role="button"
        tabindex="0"
        @click=${this._openDetail}
        @keydown=${this._handleCardKey}
      >
        ${renderHeader(title, open, hours, ctx)}
        ${renderOccupancy(occupancy, level, unavailable, ctx)}
        ${
          config.show_today_forecast !== false && attrs.forecast_today?.length
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
          config.show_week_courses !== false && weekCourses.length
            ? renderCourses(
                translate(ctx.language, "coursesWeek"),
                weekCourses,
                12,
                true,
                ctx,
              )
            : nothing
        }
      </ha-card>
      ${this._renderDetail(
        title,
        open,
        fullHours,
        occupancy,
        level,
        unavailable,
        attrs,
        todayCourses,
        weekCourses,
        ctx,
      )}`;
  }

  private _renderDetail(
    title: string,
    open: boolean,
    hours: string,
    occupancy: number | null,
    level: string,
    unavailable: boolean,
    attrs: OccupancyAttributes,
    todayCourses: Course[],
    weekCourses: Course[],
    ctx: ViewContext,
  ) {
    return html`<ha-dialog
      .open=${this._detailOpen}
      .headerTitle=${title}
      .headerSubtitle=${hours}
      width="large"
      flexcontent
      @closed=${this._dialogClosed}
    >
      <div class="detail-grid">
        <div class="detail-left">
          ${renderStatus(open, ctx)}
          ${renderOccupancy(occupancy, level, unavailable, ctx)}
          ${
            attrs.forecast_today?.length
              ? renderSection(
                  translate(ctx.language, "today"),
                  renderDayBars(attrs.forecast_today, ctx),
                )
              : nothing
          }
          ${
            attrs.forecast_week ? renderWeek(attrs.forecast_week, ctx) : nothing
          }
        </div>
        <div class="detail-right">
          ${
            todayCourses.length
              ? renderCourses(
                  translate(ctx.language, "coursesToday"),
                  todayCourses,
                  50,
                  false,
                  ctx,
                )
              : nothing
          }
          ${
            weekCourses.length
              ? renderCourses(
                  translate(ctx.language, "coursesWeek"),
                  weekCourses,
                  50,
                  true,
                  ctx,
                )
              : nothing
          }
          ${
            !todayCourses.length && !weekCourses.length
              ? html`<div class="empty">
                  ${translate(ctx.language, "noCourses")}
                </div>`
              : nothing
          }
        </div>
      </div>
    </ha-dialog>`;
  }

  private _openDetail() {
    this._detailOpen = true;
  }

  private _dialogClosed() {
    this._detailOpen = false;
  }

  private _handleCardKey(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._detailOpen = true;
    }
  }

  private _findOccupancyEntity(): string | undefined {
    return Object.keys(this.hass?.states ?? {}).find(
      (id) =>
        id.startsWith("sensor.") &&
        Boolean(this.hass?.states[id].attributes.forecast_week),
    );
  }

  private _findCourseEntity(): string | undefined {
    return Object.keys(this.hass?.states ?? {}).find(
      (id) =>
        id.startsWith("sensor.") &&
        (Array.isArray(this.hass?.states[id].attributes.today) ||
          Array.isArray(this.hass?.states[id].attributes.week)),
    );
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
