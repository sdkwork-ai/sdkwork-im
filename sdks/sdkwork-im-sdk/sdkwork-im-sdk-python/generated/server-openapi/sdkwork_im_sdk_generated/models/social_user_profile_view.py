from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SocialUserProfileView:
    user_id: str
    im_online_status: str
    im_nickname: Optional[str] = None
    im_avatar_url: Optional[str] = None
    im_status_message: Optional[str] = None
    last_active_at: Optional[str] = None
