import 'package:sdkwork_common_flutter/sdkwork_common_flutter.dart' as common;

/// Id spaces for client-supplied deduplication ids.
///
/// The prefix is part of the wire value, so it must stay stable once an id has
/// been persisted by the server.
const String clientMessageIdPrefix = 'flutter';
const String clientConversationIdPrefix = 'direct';

/// Generates a collision-resistant client message id.
///
/// Idempotent message writes bind the client message id as the deduplication
/// key, so ids must never collide across messages, conversations, or send
/// attempts.
String newClientMessageId() =>
    common.generateSecureHexId(prefix: clientMessageIdPrefix);

/// Generates a collision-resistant client conversation id.
///
/// Direct conversations accept a client-supplied id, so ids must never collide
/// across attempts or peers.
String newDirectConversationId() =>
    common.generateSecureHexId(prefix: clientConversationIdPrefix);
