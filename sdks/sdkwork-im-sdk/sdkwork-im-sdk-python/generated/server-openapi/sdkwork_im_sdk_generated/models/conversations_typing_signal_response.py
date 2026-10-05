from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .signal_typing_result import SignalTypingResult


@dataclass
class ConversationsTypingSignalResponse:
    code: int
    data: Any
    trace_id: str
