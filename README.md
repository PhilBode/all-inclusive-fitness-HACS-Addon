# All Inclusive Fitness for Home Assistant

Unofficial Home Assistant integration and Lovelace card for **all inclusive Fitness** (ai-fitness.de).

It shows live gym occupancy, opening hours and the course schedule. **No account, login or check-in data is used.** Only public endpoints are queried.

## Features

- Studio selection by name/city or portal URL.
- Occupancy in percent with level (`low`, `medium`, `high`).
- Binary sensor for open/closed, calculated from the studio's opening hours.
- Next course with room, capacity and booking status.
- Attributes: today's forecast, weekly forecast, opening hours, address and coordinates.
- Courses for today and the next seven days.
- One device per studio; multiple studios can be added in parallel.
- Lovelace card with occupancy, opening hours, today's courses and weekly forecast.

## Entities

| Entity                            | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| `sensor.<studio>_occupancy`       | Current utilization in percent                  |
| `sensor.<studio>_occupancy_level` | `low`, `medium` or `high`                       |
| `binary_sensor.<studio>_open`     | Studio is open                                  |
| `sensor.<studio>_next_course`     | Next course, with `today` and `week` attributes |

Large attributes (`forecast_today`, `forecast_week`, `today`, `week`, `opening_hours`) are excluded from the recorder.

## Installation

### HACS

1. Add `https://github.com/PhilBode/all-inclusive-fitness-HACS-Addon` as a custom integration repository in HACS.
2. Install **All Inclusive Fitness**.
3. Restart Home Assistant.
4. Go to **Settings → Devices & Services → Add Integration** and search for **All Inclusive Fitness**.

### Manual

Copy `custom_components/all_inclusive_fitness` into your Home Assistant `config/custom_components` directory and restart Home Assistant.

## Setup

1. Open **Settings → Devices & Services → Add Integration**.
2. Search for **All Inclusive Fitness**.
3. Type part of the studio name or city.
4. Matching studios appear in a dropdown. Select yours.
5. Done. No credentials are required.

The restart after installation is only needed because Home Assistant loads custom integrations at startup. Adding another studio later does not need a restart.

## Lovelace card

The integration registers the card resource automatically when it is set up. In normal storage mode you do not need to add a resource manually.

After setup:

1. Open a dashboard.
2. **Edit dashboard → Add card**.
3. Search for **AI Fitness Card**.
4. Pick the occupancy sensor.

YAML is optional:

```yaml
type: custom:ai-fitness-card
entity: sensor.bielefeld_city_occupancy
course_entity: sensor.bielefeld_city_next_course
title: Bielefeld City
show_today_forecast: true
show_week: true
show_courses: true
show_week_courses: true
show_hours: true
compact: false
```

All display options are also available in the visual card editor.

`course_entity` is optional. Without it the card shows occupancy and opening hours only.

If your Home Assistant uses YAML-managed Lovelace resources, the integration cannot add the resource automatically. Add it manually:

1. **Settings → Dashboards → Resources → Add resource**.
2. URL: `/all_inclusive_fitness/ai-fitness-card.js?v=0.1.0`
3. Type: **JavaScript module**.

## Preview the card

Build the bundle and serve the repository locally:

```bash
npm run build
npm run preview
```

Open <http://localhost:8080/preview/>. The preview uses mock data and does not need Home Assistant.

## Card development

The card is split into a small TypeScript source tree:

- `src/ai-fitness-card.ts` — card element and data wiring
- `src/views.ts` — Lit templates
- `src/styles.css` — card CSS, built to `www/ai-fitness-card.css`
- `src/format.ts` and `src/strings.ts` — helpers and translations

The browser loads the compiled bundle at `custom_components/all_inclusive_fitness/www/ai-fitness-card.js` and the compiled CSS at `custom_components/all_inclusive_fitness/www/ai-fitness-card.css`.

```bash
npm install
npm run check
npm run build
```

Commit both the TypeScript source and the built JavaScript file.

## Options

The update interval can be changed between 300 and 3600 seconds. Default: 300 seconds.

When the studio is closed, the integration skips the utilization request and sets occupancy to `unknown` instead of keeping a stale value.

## Data source

All data comes from the public Magicline/MySports API used by the ai-fitness website:

- `/whitelabelconfigs/web`
- `/nox/public/v1/tenant`
- `/nox/public/v1/studios/{id}`
- `/nox/public/v1/studios/{id}/utilization`
- `/nox/public/v1/studios/{id}/utilization/v2/historic/week`
- `/nox/public/v1/bookableitems/course/upcoming`

The API is unofficial and has no SLA. Endpoints can change or disappear without notice. This integration is not affiliated with all inclusive Fitness or Magicline.

## License

MIT. Free to use, copy, modify and share.
