using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.BackendApi.Generated.Models
{
    public class RetentionPurgeResponse
    {
        public string GeneratedAt { get; set; }
        public string BatchSize { get; set; }
        public string? CommitJournalDeleted { get; set; }
        public string? ConversationMessagesDeleted { get; set; }
        public string? MessageMediaRefsDeleted { get; set; }
        public string? OutboxEventsDeleted { get; set; }
        public string? InboxEventsDeleted { get; set; }
        public string? RealtimeDeviceEventsDeleted { get; set; }
        public string? RtcSessionsDeleted { get; set; }
        public string? InvitationsDeleted { get; set; }
        public string? AuditRecordsDeleted { get; set; }
    }
}
