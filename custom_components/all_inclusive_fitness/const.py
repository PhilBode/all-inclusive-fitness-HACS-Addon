from __future__ import annotations

from datetime import timedelta

DOMAIN = "all_inclusive_fitness"

DEFAULT_BASE_URL = "https://dein.ai-fitness.de"
SUPPORTED_TENANT = "bestfit"

USER_AGENT = "Mozilla/5.0 (compatible; all_inclusive_fitness/0.1)"

CONF_BASE_URL = "base_url"
CONF_TENANT = "tenant"
CONF_STUDIO_ID = "studio_id"
CONF_STUDIO_NAME = "studio_name"
CONF_SCAN_INTERVAL = "scan_interval"

DEFAULT_SCAN_INTERVAL = 300
MIN_SCAN_INTERVAL = 300
MAX_SCAN_INTERVAL = 3600

REQUEST_TIMEOUT = 30
WAF_BACKOFF = timedelta(hours=1)
STUDIO_TTL = timedelta(hours=6)
WEEK_TTL = timedelta(hours=6)
COURSES_TTL = timedelta(minutes=15)
REVEAL_TTL = timedelta(hours=24)
UTILIZATION_TTL = timedelta(0)

RATE_LIMIT_FALLBACK = (300, 600, 1200, 2400, 3600)

CARD_STATIC_PATH = "/all_inclusive_fitness"
CARD_PATH = f"{CARD_STATIC_PATH}/ai-fitness-card.js"
CARD_URL = f"{CARD_PATH}?v=0.1.2"

WHITELABEL_PATH = "/whitelabelconfigs/web"
TENANT_PATH = "/nox/public/v1/tenant"
STUDIO_PATH = "/nox/public/v1/studios/{studio_id}"
UTILIZATION_PATH = "/nox/public/v1/studios/{studio_id}/utilization"
WEEK_PATH = "/nox/public/v1/studios/{studio_id}/utilization/v2/historic/week"
REVEAL_PATH = "/nox/public/v1/studios/{studio_id}/utilization/reveal"
COURSES_PATH = "/nox/public/v1/bookableitems/course/upcoming"

WEEKDAYS = (
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
)

ADMIN_STUDIO_RE = r"\b(verwaltung|test(ing)?|sandbox|zentrale)\b"
