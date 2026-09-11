using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.BackendApi.Generated.Models
{
    public class SocialFriendRequestInventoryItem
    {
        public string TenantId { get; set; }
        public string FriendRequestId { get; set; }
        public string RequesterUserId { get; set; }
        public string TargetUserId { get; set; }
        public string Status { get; set; }
        public string? RequestMessage { get; set; }
        public string? ExpiredAt { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public string? RequesterDisplayName { get; set; }
        public string? RequesterAvatarUrl { get; set; }
    }
}
