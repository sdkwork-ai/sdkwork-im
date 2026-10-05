from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .audit_record_list_response import AuditRecordListResponse


@dataclass
class AuditRecordsListResponse:
    code: int
    data: Any
    trace_id: str
