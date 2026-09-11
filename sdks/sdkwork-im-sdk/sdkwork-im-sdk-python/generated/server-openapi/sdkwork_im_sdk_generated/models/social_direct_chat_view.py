from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SocialDirectChatView:
    direct_chat_id: str
    left_actor_id: str
    right_actor_id: str
    status: str
    created_at: str
    updated_at: str
    conversation_id: Optional[str] = None
