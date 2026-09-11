from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SharedChannelLinkSyncRequest:
    conversation_id: str
    shared_channel_policy_id: str
    external_connection_id: str
    local_actor_id: str
    local_actor_kind: str
    external_member_id: str
    request_key: Optional[str] = None
