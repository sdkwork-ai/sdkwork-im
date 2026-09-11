using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.BackendApi.Generated.Models
{
    public class SocialFriendRequestInventoryPageData
    {
        public List<SocialFriendRequestInventoryItem> Items { get; set; }
        public PageInfo PageInfo { get; set; }
    }
}
