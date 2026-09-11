using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.Im.BackendApi.Generated.Models
{
    public class AuditChainVerification
    {
        public string TenantId { get; set; }
        public string VerifiedAt { get; set; }
        public string Total { get; set; }
        public string ChainHeadHash { get; set; }
        public bool ChainValid { get; set; }
    }
}
