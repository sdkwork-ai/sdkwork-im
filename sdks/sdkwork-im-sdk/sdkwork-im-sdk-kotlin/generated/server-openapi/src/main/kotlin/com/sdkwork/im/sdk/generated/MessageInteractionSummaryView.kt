package com.sdkwork.im.sdk.generated

data class MessageInteractionSummaryView(
    val tenantId: String? = null,
    val conversationId: String? = null,
    val messageId: String? = null,
    val messageSeq: String? = null,
    val totalReactionCount: Int? = null,
    val reactionCounts: List<MessageReactionCountView>? = null,
    val pin: MessagePinView? = null
)
