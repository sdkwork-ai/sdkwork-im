using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.Sdk.Generated.Models
{
    public class SharedChannelLinkSyncRequest
    {
        public string ConversationId { get; set; }
        public string SharedChannelPolicyId { get; set; }
        public string ExternalConnectionId { get; set; }
        public string LocalActorId { get; set; }
        public string LocalActorKind { get; set; }
        public string ExternalMemberId { get; set; }
        public string? RequestKey { get; set; }
    }
}
