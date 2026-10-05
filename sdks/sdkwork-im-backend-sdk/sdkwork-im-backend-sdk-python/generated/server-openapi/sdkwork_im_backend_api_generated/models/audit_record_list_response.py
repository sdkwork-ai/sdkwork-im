from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .audit_record_view import AuditRecordView
    from .page_info import PageInfo


@dataclass
class AuditRecordListResponse:
    items: List[AuditRecordView]
    page_info: PageInfo
