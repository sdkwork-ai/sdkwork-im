using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.Sdk.Generated.Models
{
    public class SpaceInviteCreateRequest
    {
        public string? InviteeUserId { get; set; }
        public string? InviteeEmail { get; set; }
        public string? InviteePhone { get; set; }
        public string TargetType { get; set; }
        public string TargetId { get; set; }
        public string? Role { get; set; }
        public string? Message { get; set; }
        public string? ExpiresAt { get; set; }
    }
}
