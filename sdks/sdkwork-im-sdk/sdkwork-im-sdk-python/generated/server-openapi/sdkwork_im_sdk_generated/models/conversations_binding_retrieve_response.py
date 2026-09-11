from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .conversation_binding_view import ConversationBindingView


@dataclass
class ConversationsBindingRetrieveResponse:
    code: int
    data: Any
    trace_id: str
