from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .audit_chain_verification import AuditChainVerification


@dataclass
class VerifyRetrieveResponse:
    code: int
    data: Any
    trace_id: str
