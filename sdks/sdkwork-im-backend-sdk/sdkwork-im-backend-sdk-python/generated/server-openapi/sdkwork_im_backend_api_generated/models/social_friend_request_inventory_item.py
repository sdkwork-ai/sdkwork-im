from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SocialFriendRequestInventoryItem:
    """Friend request inventory entry mirroring the social service FriendRequestHttpView DTO."""
    tenant_id: str
    friend_request_id: str
    requester_user_id: str
    target_user_id: str
    status: str
    created_at: str
    updated_at: str
    request_message: Optional[str] = None
    expired_at: Optional[str] = None
    requester_display_name: Optional[str] = None
    requester_avatar_url: Optional[str] = None
