from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .shared_channel_link_sync_response import SharedChannelLinkSyncResponse


@dataclass
class ConversationsSharedChannelLinksSyncResponse:
    code: int
    data: Any
    trace_id: str
