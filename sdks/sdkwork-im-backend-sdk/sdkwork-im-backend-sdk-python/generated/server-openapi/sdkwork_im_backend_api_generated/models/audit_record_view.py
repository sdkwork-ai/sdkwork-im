from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AuditRecordView:
    tenant_id: str
    record_id: str
    audit_seq: str
    aggregate_type: str
    aggregate_id: str
    action: str
    actor_id: str
    actor_kind: str
    recorded_at: str
    chain_hash: str
    actor_session_id: Optional[str] = None
    payload: Optional[str] = None
    chain_prev_hash: Optional[str] = None
