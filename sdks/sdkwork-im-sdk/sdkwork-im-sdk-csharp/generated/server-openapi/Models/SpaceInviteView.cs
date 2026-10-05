using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.Sdk.Generated.Models
{
    public class SpaceInviteView
    {
        public string InvitationId { get; set; }
        public string InviterUserId { get; set; }
        public string? InviteeUserId { get; set; }
        public string TargetType { get; set; }
        public string TargetId { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
        public string CreatedAt { get; set; }
    }
}
