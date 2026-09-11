using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.Sdk.Generated.Models
{
    public class SocialUserBlockSummary
    {
        public string BlockId { get; set; }
        public string BlockerUserId { get; set; }
        public string BlockedUserId { get; set; }
        public string Scope { get; set; }
        public string CreatedAt { get; set; }
    }
}
