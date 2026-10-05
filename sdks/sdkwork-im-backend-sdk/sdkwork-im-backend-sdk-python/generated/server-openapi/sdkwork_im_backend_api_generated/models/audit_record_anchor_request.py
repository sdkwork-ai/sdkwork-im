from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AuditRecordAnchorRequest:
    record_id: str
    aggregate_type: str
    aggregate_id: str
    action: str
    payload: Optional[str] = None
