using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.Sdk.Generated.Models
{
    public class SocialDirectChatView
    {
        public string DirectChatId { get; set; }
        public string LeftActorId { get; set; }
        public string RightActorId { get; set; }
        public string Status { get; set; }
        public string? ConversationId { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
    }
}
