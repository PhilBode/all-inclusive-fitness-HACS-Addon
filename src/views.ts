import { html, nothing, type TemplateResult } from "lit";

import { clamp, formatDate, formatTime, weekdayName } from "./format";
import { translate } from "./strings";
import type { Course, ForecastSlot, ViewContext } from "./types";

export function renderHeader(
  title: string,
  open: boolean,
  hours: string,
  ctx: ViewContext,
): TemplateResult {
  return html`<div class="header">
    <div>
      <div class="title">${title}</div>
      ${hours ? html`<div class="subtitle">${hours}</div>` : nothing}
    </div>
    <div class="badge ${open ? "open" : "closed"}">
      ${open ? translate(ctx.language, "open") : translate(ctx.language, "closed")}
    </div>
  </div>`;
}

export function renderStatus(open: boolean, ctx: ViewContext): TemplateResult {
  return html`<div class="status">
    <span class="badge ${open ? "open" : "closed"}">
      ${open ? translate(ctx.language, "open") : translate(ctx.language, "closed")}
    </span>
  </div>`;
}

export function renderOccupancy(
  value: number | null,
  level: string,
  unavailable: boolean,
  ctx: ViewContext,
): TemplateResult {
  const label = level
    ? level.toUpperCase()
    : unavailable
      ? translate(ctx.language, "noData")
      : "";
  const percentage =
    value === null || Number.isNaN(value) ? "–" : `${Math.round(value)} %`;

  return html`<div class="occupancy ${level}">
    <div class="value">${percentage}</div>
    <div class="level">${label}</div>
    <div class="bar">
      <span style="width:${clamp(value ?? 0)}%"></span>
    </div>
  </div>`;
}

export function renderSection(
  title: string,
  content: TemplateResult,
): TemplateResult {
  return html`<div class="section">
    <div class="section-title">${title}</div>
    ${content}
  </div>`;
}

export function renderCourses(
  title: string,
  courses: Course[],
  limit: number,
  withDate: boolean,
  ctx: ViewContext,
): TemplateResult {
  return renderSection(
    title,
    html`<div class="courses">
      ${courses
        .slice(0, limit)
        .map((course) => renderCourse(course, withDate, ctx))}
    </div>`,
  );
}

function renderCourse(
  course: Course,
  withDate: boolean,
  ctx: ViewContext,
): TemplateResult {
  const time = formatTime(course.start, ctx.locale, ctx.timeZone);
  const date = withDate
    ? `${formatDate(course.start, ctx.locale, ctx.timeZone)} · `
    : "";
  const capacity =
    course.capacity && course.capacity > 0
      ? html`${personIcon()}${course.booked ?? 0}/${course.capacity}`
      : nothing;

  return html`<div class="course">
    <div class="course-time">${date}${time}</div>
    <div class="course-name">
      ${course.name ?? ""}
      ${
        course.in_progress
          ? html`<span class="tag running"
              >${translate(ctx.language, "running")}</span
            >`
          : nothing
      }
      ${
        course.is_full
          ? html`<span class="tag">${translate(ctx.language, "full")}</span>`
          : nothing
      }
    </div>
    <div class="course-capacity">${capacity}</div>
  </div>`;
}

function personIcon(): TemplateResult {
  return html`<svg class="person" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z"
    ></path>
  </svg>`;
}

export function renderDayBars(
  slots: ForecastSlot[],
  ctx: ViewContext,
): TemplateResult {
  return html`<div class="daybars">
    ${slots.map((slot) => {
      const percentage = clamp(slot.percentage);
      const label = `${slot.start}–${slot.end} · ${slot.percentage}%${
        slot.is_estimate ? ` (${translate(ctx.language, "estimate")})` : ""
      }`;

      return html`<div
        class="daybar ${slot.is_estimate ? "estimate" : ""}"
        title=${label}
      >
        <span style="height:${Math.max(4, percentage)}%"></span>
        <small>${slot.start.slice(0, 2)}</small>
      </div>`;
    })}
  </div>`;
}

export function renderWeek(
  forecast: Record<string, ForecastSlot[]>,
  ctx: ViewContext,
): TemplateResult | typeof nothing {
  const rows: TemplateResult[] = [];
  const now = new Date();

  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(now.getTime() + offset * 86_400_000);
    const slots = forecast[weekdayName(day, ctx.timeZone).toUpperCase()] ?? [];
    if (!slots.length) {
      continue;
    }

    const average = Math.round(
      slots.reduce((sum, slot) => sum + (Number(slot.percentage) || 0), 0) /
        slots.length,
    );
    const label = day.toLocaleDateString(ctx.locale, {
      weekday: "short",
      timeZone: ctx.timeZone,
    });

    rows.push(
      html`<div class="weekrow">
        <div class="weekday">${label}</div>
        <div class="weekbar">
          <span style="width:${clamp(average)}%"></span>
        </div>
        <div class="weekpct">${average}%</div>
      </div>`,
    );
  }

  return rows.length
    ? renderSection(translate(ctx.language, "week"), html`<div>${rows}</div>`)
    : nothing;
}
