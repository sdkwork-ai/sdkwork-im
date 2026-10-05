package com.sdkwork.im.backend.api.generated

data class AuditRecordView(
    val tenantId: String? = null,
    val recordId: String? = null,
    val auditSeq: String? = null,
    val aggregateType: String? = null,
    val aggregateId: String? = null,
    val action: String? = null,
    val actorId: String? = null,
    val actorKind: String? = null,
    val actorSessionId: String? = null,
    val payload: String? = null,
    val recordedAt: String? = null,
    val chainPrevHash: String? = null,
    val chainHash: String? = null
)
