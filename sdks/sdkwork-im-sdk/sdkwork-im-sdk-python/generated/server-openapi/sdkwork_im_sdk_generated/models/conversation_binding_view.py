from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ConversationBindingView:
    conversation_id: str
    business_type: str
    business_id: str
