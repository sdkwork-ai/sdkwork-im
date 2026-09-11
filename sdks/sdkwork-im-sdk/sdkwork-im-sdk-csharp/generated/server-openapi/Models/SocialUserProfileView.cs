using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.Sdk.Generated.Models
{
    public class SocialUserProfileView
    {
        public string UserId { get; set; }
        public string? ImNickname { get; set; }
        public string? ImAvatarUrl { get; set; }
        public string? ImStatusMessage { get; set; }
        public string ImOnlineStatus { get; set; }
        public string? LastActiveAt { get; set; }
    }
}
