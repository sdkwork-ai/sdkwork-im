from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class RetentionPurgeResponse:
    generated_at: str
    batch_size: str
    commit_journal_deleted: Optional[str] = None
    conversation_messages_deleted: Optional[str] = None
    message_media_refs_deleted: Optional[str] = None
    outbox_events_deleted: Optional[str] = None
    inbox_events_deleted: Optional[str] = None
    realtime_device_events_deleted: Optional[str] = None
    rtc_sessions_deleted: Optional[str] = None
    invitations_deleted: Optional[str] = None
    audit_records_deleted: Optional[str] = None
