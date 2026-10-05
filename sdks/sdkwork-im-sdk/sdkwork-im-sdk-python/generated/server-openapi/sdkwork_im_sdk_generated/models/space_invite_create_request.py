from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SpaceInviteCreateRequest:
    """Invitation to join the space. At least one of inviteeUserId, inviteeEmail, or inviteePhone is required."""
    target_type: str
    target_id: str
    invitee_user_id: Optional[str] = None
    invitee_email: Optional[str] = None
    invitee_phone: Optional[str] = None
    role: Optional[str] = None
    message: Optional[str] = None
    expires_at: Optional[str] = None
