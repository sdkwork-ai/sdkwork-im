from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .welcome_ensure_view import WelcomeEnsureView


@dataclass
class ChatMeWelcomeEnsureResponse:
    code: int
    data: Any
    trace_id: str
