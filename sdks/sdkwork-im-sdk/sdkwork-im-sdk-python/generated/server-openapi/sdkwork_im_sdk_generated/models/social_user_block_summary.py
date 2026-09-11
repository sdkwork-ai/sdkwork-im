from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SocialUserBlockSummary:
    block_id: str
    blocker_user_id: str
    blocked_user_id: str
    scope: str
    created_at: str
