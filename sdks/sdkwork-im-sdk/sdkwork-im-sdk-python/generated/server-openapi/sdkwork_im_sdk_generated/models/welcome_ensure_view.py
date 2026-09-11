from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class WelcomeEnsureView:
    status: str
    conversation_id: str
    message_id: str
    message_seq: str
