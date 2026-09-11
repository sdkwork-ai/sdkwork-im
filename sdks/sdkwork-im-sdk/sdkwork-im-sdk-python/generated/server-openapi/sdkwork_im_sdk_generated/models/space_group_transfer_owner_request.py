from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SpaceGroupTransferOwnerRequest:
    new_owner_user_id: str
