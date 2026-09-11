from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .social_user_settings_view import SocialUserSettingsView


@dataclass
class SocialUsersSettingsUpdateResponse:
    code: int
    data: Any
    trace_id: str
