using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.BackendApi.Generated.Models
{
    public class AuditRecordAnchorRequest
    {
        public string RecordId { get; set; }
        public string AggregateType { get; set; }
        public string AggregateId { get; set; }
        public string Action { get; set; }
        public string? Payload { get; set; }
    }
}
