from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class JournalReplayStatusView:
    status: str
    mode: str
    database_configured: bool
    journal_ready: bool
    generated_at: str
    total_commits: Optional[str] = None
    head_commit_offset: Optional[str] = None
    latest_occurred_at: Optional[str] = None
    detail: Optional[str] = None
