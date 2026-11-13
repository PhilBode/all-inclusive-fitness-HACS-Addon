import { LitElement, css, html } from "lit";

import { translate, type StringKey } from "./strings";
import type { AiFitnessCardConfig, HomeAssistant } from "./types";

type BooleanKey =
  | "show_today_forecast"
  | "show_week"
  | "show_courses"
  | "show_week_courses"
  | "show_hours"
  | "compact";

class AiFitnessCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    config: { attribute: false },
  };

  declare hass?: HomeAssistant;
  declare config?: AiFitnessCardConfig;

  static styles = css`
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    ha-formfield {
      display: block;
    }
    ha-entity-picker,
    ha-textfield {
      display: block;
    }
  `;

  setConfig(config: AiFitnessCardConfig) {
    this.config = config;
  }

  render() {
    if (!this.hass || !this.config) {
      return html``;
    }

    return html`<div class="form">
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.entity ?? ""}
        .includeDomains=${["sensor"]}
        .label=${this._t("editorEntity")}
        @value-changed=${this._entityChanged}
      ></ha-entity-picker>

      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.course_entity ?? ""}
        .includeDomains=${["sensor"]}
        .label=${this._t("editorCourseEntity")}
        @value-changed=${this._courseChanged}
      ></ha-entity-picker>

      <ha-textfield
        .value=${this.config.title ?? ""}
        .label=${this._t("editorTitle")}
        @input=${this._titleChanged}
      ></ha-textfield>

      ${this._toggle("show_today_forecast", "editorToday")}
      ${this._toggle("show_week", "editorWeek")}
      ${this._toggle("show_courses", "editorCourses")}
      ${this._toggle("show_week_courses", "editorWeekCourses")}
      ${this._toggle("show_hours", "editorHours")}
      ${this._toggle("compact", "editorCompact")}
    </div>`;
  }

  private _toggle(key: BooleanKey, label: StringKey) {
    const checked =
      key === "compact"
        ? this.config?.compact === true
        : this.config?.[key] !== false;

    return html`<ha-formfield .label=${this._t(label)}>
      <ha-switch
        .checked=${checked}
        @change=${(event: Event) => this._setBoolean(key, event)}
      ></ha-switch>
    </ha-formfield>`;
  }

  private _entityChanged(event: CustomEvent<{ value: string }>) {
    this._update({ entity: event.detail.value });
  }

  private _courseChanged(event: CustomEvent<{ value: string }>) {
    this._update({ course_entity: event.detail.value || undefined });
  }

  private _titleChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this._update({ title: value || undefined });
  }

  private _setBoolean(key: BooleanKey, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this._update({ [key]: checked });
  }

  private _update(patch: Partial<AiFitnessCardConfig>) {
    if (!this.config) {
      return;
    }
    this.config = { ...this.config, ...patch };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _t(key: StringKey): string {
    return translate(this.hass?.language ?? "en", key);
  }
}

if (!customElements.get("ai-fitness-card-editor")) {
  customElements.define("ai-fitness-card-editor", AiFitnessCardEditor);
}
