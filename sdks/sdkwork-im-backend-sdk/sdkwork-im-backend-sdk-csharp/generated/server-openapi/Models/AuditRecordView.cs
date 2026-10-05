using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.BackendApi.Generated.Models
{
    public class AuditRecordView
    {
        public string TenantId { get; set; }
        public string RecordId { get; set; }
        public string AuditSeq { get; set; }
        public string AggregateType { get; set; }
        public string AggregateId { get; set; }
        public string Action { get; set; }
        public string ActorId { get; set; }
        public string ActorKind { get; set; }
        public string? ActorSessionId { get; set; }
        public string? Payload { get; set; }
        public string RecordedAt { get; set; }
        public string? ChainPrevHash { get; set; }
        public string ChainHash { get; set; }
    }
}
