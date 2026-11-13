import { LitElement, css, html } from "lit";

import { translate, type StringKey } from "./strings";
import type { AiFitnessCardConfig, HomeAssistant } from "./types";

type BooleanKey =
  | "show_today_forecast"
  | "show_week"
  | "show_courses"
  | "show_week_courses"
  | "show_hours";

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
    ha-textfield {
      display: block;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 40px;
    }
    .row-label {
      flex: 1;
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
    </div>`;
  }

  private _toggle(key: BooleanKey, label: StringKey) {
    const checked = this.config?.[key] !== false;

    return html`<div class="row">
      <span class="row-label">${this._t(label)}</span>
      <ha-switch
        .checked=${checked}
        @change=${(event: Event) => this._setBoolean(key, event)}
      ></ha-switch>
    </div>`;
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
