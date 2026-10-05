from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SpaceInviteView:
    invitation_id: str
    inviter_user_id: str
    target_type: str
    target_id: str
    role: str
    status: str
    created_at: str
    invitee_user_id: Optional[str] = None
