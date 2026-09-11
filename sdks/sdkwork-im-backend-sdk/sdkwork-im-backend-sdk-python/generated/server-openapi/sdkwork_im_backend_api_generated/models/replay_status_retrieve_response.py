from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .journal_replay_status_view import JournalReplayStatusView


@dataclass
class ReplayStatusRetrieveResponse:
    code: int
    data: Any
    trace_id: str
