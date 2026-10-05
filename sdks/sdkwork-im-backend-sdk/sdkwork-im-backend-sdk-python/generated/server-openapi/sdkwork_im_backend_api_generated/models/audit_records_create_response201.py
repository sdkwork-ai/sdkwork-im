from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .audit_record_view import AuditRecordView


@dataclass
class AuditRecordsCreateResponse201:
    code: int
    data: Any
    trace_id: str
