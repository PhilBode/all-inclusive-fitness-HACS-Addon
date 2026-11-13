from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_BASE_URL, CONF_STUDIO_ID, CONF_TENANT
from .coordinator import PublicCoordinator


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, object]:
    coordinator: PublicCoordinator = entry.runtime_data
    studio = coordinator.studio
    return {
        "entry": {
            "base_url": entry.data.get(CONF_BASE_URL),
            "tenant": entry.data.get(CONF_TENANT),
            "studio_id": entry.data.get(CONF_STUDIO_ID),
        },
        "last_update_success": coordinator.last_update_success,
        "studio": {
            "id": studio.id if studio else None,
            "name": studio.name if studio else None,
            "timezone": str(studio.zone) if studio else None,
        },
    }
