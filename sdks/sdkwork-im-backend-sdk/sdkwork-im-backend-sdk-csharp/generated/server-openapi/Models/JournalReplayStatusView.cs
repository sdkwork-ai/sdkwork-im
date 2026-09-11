using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.BackendApi.Generated.Models
{
    public class JournalReplayStatusView
    {
        public string Status { get; set; }
        public string Mode { get; set; }
        public bool DatabaseConfigured { get; set; }
        public bool JournalReady { get; set; }
        public string? TotalCommits { get; set; }
        public string? HeadCommitOffset { get; set; }
        public string? LatestOccurredAt { get; set; }
        public string? Detail { get; set; }
        public string GeneratedAt { get; set; }
    }
}
