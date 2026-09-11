from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .message_search_hit import MessageSearchHit
    from .page_info import PageInfo


@dataclass
class MessageSearchResponse:
    code: int
    data: Any
    trace_id: str
