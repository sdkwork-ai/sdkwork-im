from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .social_direct_chat_view import SocialDirectChatView


@dataclass
class SocialDirectChatsListResponse:
    code: int
    data: Any
    trace_id: str
