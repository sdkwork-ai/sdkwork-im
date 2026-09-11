from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class UpdateSocialUserProfileRequest:
    im_nickname: Optional[str] = None
    im_avatar_url: Optional[str] = None
    im_status_message: Optional[str] = None
