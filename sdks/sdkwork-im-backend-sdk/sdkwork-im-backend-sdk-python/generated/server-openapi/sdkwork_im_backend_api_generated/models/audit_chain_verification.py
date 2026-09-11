from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AuditChainVerification:
    tenant_id: str
    verified_at: str
    total: str
    chain_head_hash: Optional[str]
    chain_valid: bool
