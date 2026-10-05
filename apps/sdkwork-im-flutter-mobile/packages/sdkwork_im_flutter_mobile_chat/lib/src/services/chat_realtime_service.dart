import 'dart:async';

import 'package:sdkwork_im_flutter_mobile_core/sdkwork_im_flutter_mobile_core.dart';

typedef RealtimeRefreshHandler = Future<void> Function();
typedef RealtimeMessageHandler = Future<void> Function();

/// Notified with the typing peer's user id (`conversation.typing` payload).
typedef RealtimeTypingHandler = void Function(String peerUserId);

/// The wire event type tag for typing pushes (`im-domain-core` typing.rs).
const String _typingEventType = 'conversation.typing';

/// Extracts the typing peer user id from a conversation-scope event.
///
/// Returns null for anything but a `conversation.typing` event without a
/// usable user id (camelCase payload first, snake_case as the fallback).
String? extractTypingPeerUserId(Map<String, dynamic> event) {
  final eventType = _pickFirstString([event['eventType'], event['type']]);
  if (eventType != null && eventType != _typingEventType) {
    return null;
  }
  final payload = event['payload'];
  final payloadMap =
      payload is Map ? Map<String, dynamic>.from(payload) : event;
  return _pickFirstString([payloadMap['userId'], payloadMap['user_id']]);
}

String? _pickFirstString(List<Object?> values) {
  for (final value in values) {
    if (value is String && value.trim().isNotEmpty) {
      return value.trim();
    }
  }
  return null;
}

final _liveHubs = <int, _ChatLiveHub>{};

class _ChatLiveHub {
  _ChatLiveHub(this._bundle);

  static const _reconnectBaseDelay = Duration(seconds: 1);
  static const _reconnectMaxDelay = Duration(seconds: 30);

  final ImSdkClientBundle _bundle;
  ImLiveConnection? _connection;
  ImSubscription? _stateSubscription;
  Timer? _reconnectTimer;
  bool _liveConnected = false;
  int _connectionGeneration = 0;
  int _reconnectAttempt = 0;

  final Map<String, Set<RealtimeRefreshHandler>> _inboxHandlers = {};
  final Map<String, Set<RealtimeRefreshHandler>> _conversationHandlers = {};
  final Map<String, Set<RealtimeMessageHandler>> _conversationMessageHandlers = {};
  final Map<String, Set<RealtimeTypingHandler>> _typingHandlers = {};
  final Map<String, ImSubscription> _inboxUnsubs = {};
  final Map<String, ImSubscription> _conversationUnsubs = {};
  final Map<String, ImSubscription> _typingUnsubs = {};

  bool get isLiveConnected => _liveConnected;

  bool get _hasSubscriptionDemand =>
      _inboxHandlers.isNotEmpty ||
      _conversationHandlers.isNotEmpty ||
      _conversationMessageHandlers.isNotEmpty ||
      _typingHandlers.isNotEmpty;

  String _scopeKey(String scopeType, String scopeId) => '$scopeType:$scopeId';

  Future<ImLiveConnection> _ensureConnection() async {
    if (_connection != null) {
      return _connection!;
    }

    _reconnectTimer?.cancel();
    _reconnectTimer = null;
    final generation = _connectionGeneration + 1;
    _connectionGeneration = generation;
    final connection = await _bundle.composed.connect(
      options: const ImConnectOptions(subscriptions: ImConnectSubscriptions()),
    );
    _connection = connection;
    _stateSubscription = connection.lifecycle.onStateChange((state) {
      if (generation != _connectionGeneration || !identical(_connection, connection)) {
        return;
      }
      _liveConnected = state.status == 'open';
      if (_liveConnected) {
        _reconnectAttempt = 0;
        _syncSubscriptions(connection);
        return;
      }
      if (state.status == 'closed' || state.status == 'error') {
        _stateSubscription = null;
        _clearWireSubscriptions();
        _connection = null;
        _liveConnected = false;
        _scheduleReconnect();
      }
    });
    return connection;
  }

  List<ImRealtimeScopeSubscription> _buildScopeSubscriptions() {
    final scopes = _inboxHandlers.keys.map((scopeKey) {
      final parts = scopeKey.split(':');
      final scopeType = parts.first;
      final scopeId = parts.sublist(1).join(':');
      return ImRealtimeScopeSubscription(
        scopeType: scopeType,
        scopeId: scopeId,
        eventTypes: inboxRealtimeEventTypes,
      );
    }).toList();
    // Typing scopes declare their own event-type filter so the wire only
    // pushes `conversation.typing` into this connection for them.
    for (final conversationId in _typingHandlers.keys) {
      scopes.add(ImRealtimeScopeSubscription(
        scopeType: 'conversation',
        scopeId: conversationId,
        eventTypes: const [_typingEventType],
      ));
    }
    return scopes;
  }

  void _clearWireSubscriptions() {
    for (final unsubscribe in _inboxUnsubs.values) {
      unsubscribe();
    }
    for (final unsubscribe in _conversationUnsubs.values) {
      unsubscribe();
    }
    for (final unsubscribe in _typingUnsubs.values) {
      unsubscribe();
    }
    _inboxUnsubs.clear();
    _conversationUnsubs.clear();
    _typingUnsubs.clear();
  }

  void _bindWireSubscriptions(ImLiveConnection connection) {
    final conversationIds = <String>{
      ..._conversationHandlers.keys,
      ..._conversationMessageHandlers.keys,
    };
    for (final conversationId in conversationIds) {
      if (_conversationUnsubs.containsKey(conversationId)) {
        continue;
      }
      final refreshHandlers = _conversationHandlers[conversationId];
      final messageHandlers = _conversationMessageHandlers[conversationId];
      final unsubscribe = connection.messages.onConversation(
        conversationId,
        (_) {
          for (final activeHandler in refreshHandlers ?? {}) {
            unawaited(activeHandler());
          }
          for (final activeHandler in messageHandlers ?? {}) {
            unawaited(activeHandler());
          }
        },
      );
      _conversationUnsubs[conversationId] = unsubscribe;
    }

    for (final scopeKey in _inboxHandlers.keys) {
      if (_inboxUnsubs.containsKey(scopeKey)) {
        continue;
      }
      final parts = scopeKey.split(':');
      if (parts.length < 2) {
        continue;
      }
      final scopeType = parts.first;
      final scopeId = parts.sublist(1).join(':');
      final handlers = _inboxHandlers[scopeKey];
      final unsubscribe = connection.events.onScope(
        scopeType,
        scopeId,
        (_) {
          for (final activeHandler in handlers ?? {}) {
            unawaited(activeHandler());
          }
        },
      );
      _inboxUnsubs[scopeKey] = unsubscribe;
    }

    for (final conversationId in _typingHandlers.keys) {
      if (_typingUnsubs.containsKey(conversationId)) {
        continue;
      }
      final handlers = _typingHandlers[conversationId];
      final unsubscribe = connection.events.onScope(
        'conversation',
        conversationId,
        (event) {
          final peerUserId = extractTypingPeerUserId(event);
          if (peerUserId == null) {
            return;
          }
          for (final activeHandler in handlers ?? {}) {
            activeHandler(peerUserId);
          }
        },
      );
      _typingUnsubs[conversationId] = unsubscribe;
    }
  }

  void _syncSubscriptions(ImLiveConnection connection) {
    if (!_liveConnected) {
      return;
    }
    _bindWireSubscriptions(connection);
    connection.subscriptions.syncConversations(<String>{
      ..._conversationHandlers.keys,
      ..._conversationMessageHandlers.keys,
    }.toList());
    connection.subscriptions.syncScopes(_buildScopeSubscriptions());
  }

  Duration _nextReconnectDelay() {
    final exponent = _reconnectAttempt.clamp(0, 5).toInt();
    final multiplier = 1 << exponent;
    final delay = _reconnectBaseDelay * multiplier;
    if (delay > _reconnectMaxDelay) {
      return _reconnectMaxDelay;
    }
    return delay;
  }

  void _scheduleReconnect() {
    if (_reconnectTimer != null || !_hasSubscriptionDemand) {
      return;
    }
    final delay = _nextReconnectDelay();
    _reconnectAttempt += 1;
    _reconnectTimer = Timer(delay, () {
      _reconnectTimer = null;
      if (!_hasSubscriptionDemand || _connection != null) {
        return;
      }
      unawaited(_reconnect());
    });
  }

  Future<void> _reconnect() async {
    try {
      await _ensureConnection();
    } catch (_) {
      _connection = null;
      _liveConnected = false;
      _clearWireSubscriptions();
      _scheduleReconnect();
    }
  }

  void _teardownIfIdle() {
    if (_hasSubscriptionDemand) {
      return;
    }
    _reconnectTimer?.cancel();
    _reconnectTimer = null;
    _clearWireSubscriptions();
    _stateSubscription?.call();
    _stateSubscription = null;
    _connection?.disconnect();
    _connection = null;
    _liveConnected = false;
  }

  Future<void> subscribeInbox({
    required String userId,
    required RealtimeRefreshHandler handler,
  }) async {
    final scopeKey = _scopeKey('user', userId);
    final connection = await _ensureConnection();
    var handlers = _inboxHandlers[scopeKey];
    if (handlers == null) {
      handlers = {};
      _inboxHandlers[scopeKey] = handlers;
    }
    handlers.add(handler);
    _syncSubscriptions(connection);
  }

  void unsubscribeInbox({
    required String userId,
    required RealtimeRefreshHandler handler,
  }) {
    final scopeKey = _scopeKey('user', userId);
    final handlers = _inboxHandlers[scopeKey];
    if (handlers == null) {
      return;
    }
    handlers.remove(handler);
    if (handlers.isNotEmpty) {
      return;
    }

    _inboxUnsubs.remove(scopeKey)?.call();
    _inboxHandlers.remove(scopeKey);
    if (_connection != null) {
      _syncSubscriptions(_connection!);
    }
    _teardownIfIdle();
  }

  Future<void> subscribeConversation({
    required String conversationId,
    required RealtimeRefreshHandler handler,
  }) async {
    final connection = await _ensureConnection();
    var handlers = _conversationHandlers[conversationId];
    if (handlers == null) {
      handlers = {};
      _conversationHandlers[conversationId] = handlers;
    }
    handlers.add(handler);
    _syncSubscriptions(connection);
  }

  void unsubscribeConversation({
    required String conversationId,
    required RealtimeRefreshHandler handler,
  }) {
    final handlers = _conversationHandlers[conversationId];
    if (handlers == null) {
      return;
    }
    handlers.remove(handler);
    if (handlers.isNotEmpty) {
      return;
    }

    _conversationUnsubs.remove(conversationId)?.call();
    _conversationHandlers.remove(conversationId);
    if (_connection != null) {
      _syncSubscriptions(_connection!);
    }
    _teardownIfIdle();
  }

  Future<void> subscribeConversationTyping({
    required String conversationId,
    required RealtimeTypingHandler handler,
  }) async {
    final connection = await _ensureConnection();
    var handlers = _typingHandlers[conversationId];
    if (handlers == null) {
      handlers = {};
      _typingHandlers[conversationId] = handlers;
    }
    handlers.add(handler);
    _syncSubscriptions(connection);
  }

  void unsubscribeConversationTyping({
    required String conversationId,
    required RealtimeTypingHandler handler,
  }) {
    final handlers = _typingHandlers[conversationId];
    if (handlers == null) {
      return;
    }
    handlers.remove(handler);
    if (handlers.isNotEmpty) {
      return;
    }

    _typingUnsubs.remove(conversationId)?.call();
    _typingHandlers.remove(conversationId);
    if (_connection != null) {
      _syncSubscriptions(_connection!);
    }
    _teardownIfIdle();
  }

  Future<void> dispose() async {
    _reconnectTimer?.cancel();
    _reconnectTimer = null;
    _clearWireSubscriptions();
    _inboxHandlers.clear();
    _conversationHandlers.clear();
    _conversationMessageHandlers.clear();
    _typingHandlers.clear();
    _stateSubscription?.call();
    _stateSubscription = null;
    _connectionGeneration += 1;
    _connection?.disconnect();
    _connection = null;
    _liveConnected = false;
    _reconnectAttempt = 0;
  }
}

_ChatLiveHub _hubForBundle(ImSdkClientBundle bundle) {
  return _liveHubs.putIfAbsent(
    identityHashCode(bundle.composed),
    () => _ChatLiveHub(bundle),
  );
}

class ChatRealtimeService {
  ChatRealtimeService(this._bundle);

  final ImSdkClientBundle _bundle;
  _ChatLiveHub get _hub => _hubForBundle(_bundle);

  RealtimeRefreshHandler? _inboxHandler;
  RealtimeRefreshHandler? _conversationHandler;
  RealtimeTypingHandler? _typingHandler;
  String? _inboxUserId;
  String? _conversationId;
  String? _typingConversationId;

  bool get isLiveConnected => _hub.isLiveConnected;

  Future<void> startConversation({
    required String conversationId,
    required RealtimeRefreshHandler onRefresh,
  }) async {
    await stopConversation();
    _conversationId = conversationId;
    _conversationHandler = onRefresh;
    await _hub.subscribeConversation(
      conversationId: conversationId,
      handler: onRefresh,
    );
  }

  Future<void> startConversationTyping({
    required String conversationId,
    required RealtimeTypingHandler onTyping,
  }) async {
    await stopConversationTyping();
    _typingConversationId = conversationId;
    _typingHandler = onTyping;
    await _hub.subscribeConversationTyping(
      conversationId: conversationId,
      handler: onTyping,
    );
  }

  Future<void> stopConversationTyping() async {
    final conversationId = _typingConversationId;
    final handler = _typingHandler;
    _typingConversationId = null;
    _typingHandler = null;
    if (conversationId == null || handler == null) {
      return;
    }
    _hub.unsubscribeConversationTyping(
      conversationId: conversationId,
      handler: handler,
    );
  }

  Future<void> startInbox({
    required String userId,
    required RealtimeRefreshHandler onRefresh,
  }) async {
    await stopInbox();
    _inboxUserId = userId;
    _inboxHandler = onRefresh;
    await _hub.subscribeInbox(userId: userId, handler: onRefresh);
  }

  Future<void> stopInbox() async {
    final userId = _inboxUserId;
    final handler = _inboxHandler;
    _inboxUserId = null;
    _inboxHandler = null;
    if (userId == null || handler == null) {
      return;
    }
    _hub.unsubscribeInbox(userId: userId, handler: handler);
  }

  Future<void> stopConversation() async {
    final conversationId = _conversationId;
    final handler = _conversationHandler;
    _conversationId = null;
    _conversationHandler = null;
    if (conversationId == null || handler == null) {
      return;
    }
    _hub.unsubscribeConversation(
      conversationId: conversationId,
      handler: handler,
    );
  }

  Future<void> stop() async {
    await stopInbox();
    await stopConversation();
    stopConversationTyping();
  }
}

ChatRealtimeService createChatRealtimeService(ImSdkClientBundle bundle) {
  return ChatRealtimeService(bundle);
}

Future<void> disposeChatRealtimeHub(ImSdkClientBundle bundle) async {
  final hub = _liveHubs.remove(identityHashCode(bundle.composed));
  await hub?.dispose();
}
