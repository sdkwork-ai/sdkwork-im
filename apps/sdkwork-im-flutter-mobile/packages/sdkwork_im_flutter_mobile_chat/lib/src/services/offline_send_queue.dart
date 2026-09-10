import 'dart:convert';
import 'dart:io';

import 'package:shared_preferences/shared_preferences.dart';

const _storageKey = 'sdkwork-im-flutter-mobile:pending-sends:v2';
const _legacyStorageKey = 'sdkwork-im-flutter-mobile:pending-sends:v1';
const _defaultFlushLimit = 50;
const maxPendingSends = 100;

/// Lease window for a flush claim in milliseconds.
///
/// While the lease is active no other flush may claim the record; once it
/// expires the record becomes claimable again, so an app death mid-flush can
/// never strand a send. Mirrors `PENDING_SEND_CLAIM_LEASE_MS` in the PC
/// offline store.
const int pendingSendClaimLeaseMs = 60000;

/// Maximum claim attempts before a pending send is quarantined instead of
/// retried. Mirrors `MAX_PENDING_SEND_ATTEMPTS` in the PC offline store.
const int maxPendingSendAttempts = 20;

const String _queueStatusPending = 'pending';
const String _queueStatusQuarantined = 'quarantined';
const String _retryBudgetExhaustedReason = 'retry budget exhausted';

class PendingTextSendPayload {
  const PendingTextSendPayload({
    required this.conversationId,
    required this.text,
    required this.clientMsgId,
  });

  final String conversationId;
  final String text;
  final String clientMsgId;

  Map<String, dynamic> toJson() => {
        'conversationId': conversationId,
        'text': text,
        'clientMsgId': clientMsgId,
      };

  factory PendingTextSendPayload.fromJson(Map<String, dynamic> json) {
    return PendingTextSendPayload(
      conversationId: json['conversationId']?.toString() ?? '',
      text: json['text']?.toString() ?? '',
      clientMsgId: json['clientMsgId']?.toString() ?? '',
    );
  }
}

class PendingTextSendPayloadWithClaim extends PendingTextSendPayload {
  const PendingTextSendPayloadWithClaim({
    required super.conversationId,
    required super.text,
    required super.clientMsgId,
    required this.claimId,
  });

  final String claimId;
}

/// A pending send that exceeded the retry budget and was quarantined.
///
/// Quarantined records are retained in the queue (never silently deleted) so
/// the failure stays visible and diagnosable.
class QuarantinedTextSendRecord {
  const QuarantinedTextSendRecord({
    required this.clientMsgId,
    required this.conversationId,
    required this.attemptCount,
    required this.quarantineReason,
    required this.quarantinedAtMs,
    required this.createdAt,
  });

  final String clientMsgId;
  final String conversationId;
  final int attemptCount;
  final String quarantineReason;
  final int? quarantinedAtMs;
  final String createdAt;
}

class _PendingSendRecord {
  const _PendingSendRecord({
    required this.tenantId,
    required this.clientMsgId,
    required this.conversationId,
    required this.payloadJson,
    required this.createdAt,
    this.attemptCount = 0,
    this.flushClaimId,
    this.flushClaimExpiresAtMs,
    this.queueStatus = _queueStatusPending,
    this.quarantineReason,
    this.quarantinedAtMs,
  });

  final String tenantId;
  final String clientMsgId;
  final String conversationId;
  final String payloadJson;
  final String createdAt;
  final int attemptCount;
  final String? flushClaimId;
  final int? flushClaimExpiresAtMs;
  final String queueStatus;
  final String? quarantineReason;
  final int? quarantinedAtMs;

  bool get isQuarantined => queueStatus == _queueStatusQuarantined;

  Map<String, dynamic> toJson() => {
        'tenantId': tenantId,
        'clientMsgId': clientMsgId,
        'conversationId': conversationId,
        'payloadJson': payloadJson,
        'createdAt': createdAt,
        'attemptCount': attemptCount,
        'queueStatus': queueStatus,
        if (flushClaimId != null) 'flushClaimId': flushClaimId,
        if (flushClaimExpiresAtMs != null)
          'flushClaimExpiresAtMs': flushClaimExpiresAtMs,
        if (quarantineReason != null) 'quarantineReason': quarantineReason,
        if (quarantinedAtMs != null) 'quarantinedAtMs': quarantinedAtMs,
      };

  factory _PendingSendRecord.fromJson(Map<String, dynamic> json) {
    return _PendingSendRecord(
      tenantId: json['tenantId']?.toString() ?? '',
      clientMsgId: json['clientMsgId']?.toString() ?? '',
      conversationId: json['conversationId']?.toString() ?? '',
      payloadJson: json['payloadJson']?.toString() ?? '',
      createdAt: json['createdAt']?.toString() ?? '',
      attemptCount: int.tryParse(json['attemptCount']?.toString() ?? '') ?? 0,
      flushClaimId: json['flushClaimId']?.toString(),
      flushClaimExpiresAtMs:
          int.tryParse(json['flushClaimExpiresAtMs']?.toString() ?? ''),
      // Records persisted before the quarantine status existed stay pending.
      queueStatus: json['queueStatus']?.toString() == _queueStatusQuarantined
          ? _queueStatusQuarantined
          : _queueStatusPending,
      quarantineReason: json['quarantineReason']?.toString(),
      quarantinedAtMs: int.tryParse(json['quarantinedAtMs']?.toString() ?? ''),
    );
  }

  _PendingSendRecord copyWith({
    int? attemptCount,
    String? flushClaimId,
    int? flushClaimExpiresAtMs,
    String? queueStatus,
    String? quarantineReason,
    int? quarantinedAtMs,
    bool clearFlushClaim = false,
  }) {
    return _PendingSendRecord(
      tenantId: tenantId,
      clientMsgId: clientMsgId,
      conversationId: conversationId,
      payloadJson: payloadJson,
      createdAt: createdAt,
      attemptCount: attemptCount ?? this.attemptCount,
      flushClaimId:
          clearFlushClaim ? null : (flushClaimId ?? this.flushClaimId),
      flushClaimExpiresAtMs: clearFlushClaim
          ? null
          : (flushClaimExpiresAtMs ?? this.flushClaimExpiresAtMs),
      queueStatus: queueStatus ?? this.queueStatus,
      quarantineReason: quarantineReason ?? this.quarantineReason,
      quarantinedAtMs: quarantinedAtMs ?? this.quarantinedAtMs,
    );
  }
}

Future<void>? _pendingSendFlushInFlight;

int _pendingSendClaimSequence = 0;

String _createPendingSendClaimId() {
  // Wall clocks (notably Windows) can have coarse resolution, so a
  // process-local sequence keeps claim ids unique within one clock tick and
  // prevents two flushes from holding the same lease identity.
  _pendingSendClaimSequence += 1;
  return 'flutter-flush-${DateTime.now().millisecondsSinceEpoch}-$_pendingSendClaimSequence';
}

bool isRetryableFlutterSendError(Object error) {
  if (error is SocketException || error is HttpException) {
    return true;
  }
  final message = error.toString().toLowerCase();
  return message.contains('failed host lookup') ||
      message.contains('connection refused') ||
      message.contains('connection reset') ||
      message.contains('network') ||
      message.contains('timeout') ||
      message.contains('service unavailable') ||
      message.contains('503') ||
      message.contains('502') ||
      message.contains('504');
}

/// Whether [record] is held by a flush claim that has not expired yet.
///
/// A claim without an expiry timestamp can only come from a version that
/// predates lease expiry; it is treated as expired so those stranded records
/// heal instead of being stuck forever.
bool _isFlushClaimActive(_PendingSendRecord record, int nowMs) {
  final expiresAtMs = record.flushClaimExpiresAtMs;
  return record.flushClaimId != null &&
      expiresAtMs != null &&
      expiresAtMs > nowMs;
}

bool _isClaimable(
  _PendingSendRecord record, {
  required String tenantId,
  required String conversationId,
  required int nowMs,
}) {
  return record.tenantId == tenantId &&
      record.conversationId == conversationId &&
      !record.isQuarantined &&
      record.attemptCount < maxPendingSendAttempts &&
      !_isFlushClaimActive(record, nowMs);
}

Future<List<_PendingSendRecord>> _readQueue(SharedPreferences prefs) async {
  final raw = prefs.getString(_storageKey);
  if (raw == null || raw.isEmpty) {
    return const [];
  }
  try {
    final decoded = jsonDecode(raw);
    if (decoded is! List) {
      return const [];
    }
    return decoded
        .whereType<Map>()
        .map((entry) =>
            _PendingSendRecord.fromJson(Map<String, dynamic>.from(entry)))
        .toList();
  } on FormatException {
    return const [];
  } on ArgumentError {
    return const [];
  }
}

Future<void> _writeQueue(
    SharedPreferences prefs, List<_PendingSendRecord> records) async {
  await prefs.setString(
    _storageKey,
    jsonEncode(records.map((record) => record.toJson()).toList()),
  );
}

Future<void> _migrateLegacyQueue(SharedPreferences prefs) async {
  final legacyRaw = prefs.getString(_legacyStorageKey);
  if (legacyRaw == null || legacyRaw.isEmpty) {
    return;
  }
  try {
    final decoded = jsonDecode(legacyRaw);
    if (decoded is! List) {
      return;
    }
    final migrated = <_PendingSendRecord>[];
    for (final entry in decoded.whereType<Map>()) {
      final record =
          _PendingSendRecord.fromJson(Map<String, dynamic>.from(entry));
      if (record.tenantId.isEmpty || record.clientMsgId.isEmpty) {
        continue;
      }
      migrated.add(
        record.copyWith(clearFlushClaim: true),
      );
    }
    if (migrated.isNotEmpty) {
      await _writeQueue(prefs, migrated);
    }
  } on FormatException {
    // Drop corrupt legacy queue.
  } on ArgumentError {
    // Drop corrupt legacy queue.
  } finally {
    await prefs.remove(_legacyStorageKey);
  }
}

Future<SharedPreferences> _openPrefs() async {
  final prefs = await SharedPreferences.getInstance();
  await _migrateLegacyQueue(prefs);
  return prefs;
}

PendingTextSendPayload? _parsePayload(_PendingSendRecord record) {
  try {
    final decoded = jsonDecode(record.payloadJson);
    if (decoded is! Map) {
      return null;
    }
    final payload = PendingTextSendPayload.fromJson(
      Map<String, dynamic>.from(decoded),
    );
    if (payload.conversationId.isEmpty ||
        payload.text.isEmpty ||
        payload.clientMsgId.isEmpty) {
      return null;
    }
    return payload;
  } on FormatException {
    return null;
  } on ArgumentError {
    return null;
  }
}

Future<void> enqueuePendingTextSend({
  required String tenantId,
  required PendingTextSendPayload payload,
}) async {
  if (tenantId.isEmpty) {
    return;
  }
  final prefs = await _openPrefs();
  final queue = (await _readQueue(prefs))
      .where((record) => record.clientMsgId != payload.clientMsgId)
      .toList();
  queue.add(
    _PendingSendRecord(
      tenantId: tenantId,
      clientMsgId: payload.clientMsgId,
      conversationId: payload.conversationId,
      payloadJson: jsonEncode(payload.toJson()),
      createdAt: DateTime.now().toUtc().toIso8601String(),
      attemptCount: 0,
    ),
  );
  final tenantQueue =
      queue.where((record) => record.tenantId == tenantId).toList();
  if (tenantQueue.length > maxPendingSends) {
    final sorted = [...tenantQueue]
      ..sort((left, right) => left.createdAt.compareTo(right.createdAt));
    final dropCount = tenantQueue.length - maxPendingSends;
    final dropIds =
        sorted.take(dropCount).map((record) => record.clientMsgId).toSet();
    queue.removeWhere(
      (record) =>
          record.tenantId == tenantId && dropIds.contains(record.clientMsgId),
    );
  }
  await _writeQueue(prefs, queue);
}

/// Lists pending (not quarantined) text sends whose flush claim is absent or
/// expired, in FIFO order of creation.
Future<List<PendingTextSendPayload>> listPendingTextSends({
  required String tenantId,
  int limit = _defaultFlushLimit,
}) async {
  if (tenantId.isEmpty) {
    return const [];
  }
  final nowMs = DateTime.now().millisecondsSinceEpoch;
  final prefs = await _openPrefs();
  final payloads = <PendingTextSendPayload>[];
  final records = (await _readQueue(prefs))
      .where((record) =>
          record.tenantId == tenantId &&
          !record.isQuarantined &&
          !_isFlushClaimActive(record, nowMs))
      .toList()
    ..sort((left, right) => left.createdAt.compareTo(right.createdAt));
  for (final record in records.take(limit)) {
    final payload = _parsePayload(record);
    if (payload != null) {
      payloads.add(payload);
    }
  }
  return payloads;
}

/// Lists quarantined text sends so budget-exhausted records stay surfaced
/// (they are retained with their quarantine reason, never silently deleted).
Future<List<QuarantinedTextSendRecord>> listQuarantinedTextSends({
  required String tenantId,
}) async {
  if (tenantId.isEmpty) {
    return const [];
  }
  final prefs = await _openPrefs();
  final records = (await _readQueue(prefs))
      .where((record) => record.tenantId == tenantId && record.isQuarantined)
      .toList()
    ..sort((left, right) => left.createdAt.compareTo(right.createdAt));
  return records
      .map(
        (record) => QuarantinedTextSendRecord(
          clientMsgId: record.clientMsgId,
          conversationId: record.conversationId,
          attemptCount: record.attemptCount,
          quarantineReason: record.quarantineReason ?? '',
          quarantinedAtMs: record.quarantinedAtMs,
          createdAt: record.createdAt,
        ),
      )
      .toList();
}

/// Claims up to [limit] pending text sends for [conversationId] only, so a
/// conversation-scoped flush can never strand other conversations' records.
///
/// A record is claimable when it is pending, has attempts left under
/// [maxPendingSendAttempts], and its previous flush claim is absent or
/// expired; expired leases are re-claimable and each claim increments the
/// attempt counter. Records at the attempt budget are quarantined first.
/// The claim carries a [pendingSendClaimLeaseMs] lease, and only the matching
/// claim id may later acknowledge or release the record.
///
/// [nowMs] defaults to the current wall clock and is injectable for tests.
Future<List<PendingTextSendPayloadWithClaim>> claimPendingTextSends({
  required String tenantId,
  required String conversationId,
  int limit = _defaultFlushLimit,
  int? nowMs,
}) async {
  if (tenantId.isEmpty || conversationId.isEmpty) {
    return const [];
  }
  final claimedAtMs = nowMs ?? DateTime.now().millisecondsSinceEpoch;
  final claimExpiresAtMs = claimedAtMs + pendingSendClaimLeaseMs;
  final claimId = _createPendingSendClaimId();
  final prefs = await _openPrefs();
  final queue = await _readQueue(prefs);
  final swept = _quarantineExhaustedRecords(
    queue,
    tenantId: tenantId,
    conversationId: conversationId,
    nowMs: claimedAtMs,
  );
  final candidates = swept
      .where(
        (record) => _isClaimable(
          record,
          tenantId: tenantId,
          conversationId: conversationId,
          nowMs: claimedAtMs,
        ),
      )
      .toList()
    ..sort((left, right) {
      final createdAtComparison = left.createdAt.compareTo(right.createdAt);
      if (createdAtComparison != 0) {
        return createdAtComparison;
      }
      return left.clientMsgId.compareTo(right.clientMsgId);
    });
  final selected =
      candidates.take(limit).map((record) => record.clientMsgId).toSet();
  if (selected.isEmpty) {
    // Persist the quarantine sweep even when nothing is claimable. The sweep
    // keeps untouched record instances, so identity detects any change.
    var sweepChanged = false;
    for (var index = 0; index < queue.length; index += 1) {
      if (!identical(queue[index], swept[index])) {
        sweepChanged = true;
        break;
      }
    }
    if (sweepChanged) {
      await _writeQueue(prefs, swept);
    }
    return const [];
  }
  final updated = swept.map((record) {
    if (record.tenantId == tenantId &&
        record.conversationId == conversationId &&
        selected.contains(record.clientMsgId)) {
      return record.copyWith(
        flushClaimId: claimId,
        flushClaimExpiresAtMs: claimExpiresAtMs,
        attemptCount: record.attemptCount + 1,
      );
    }
    return record;
  }).toList();
  await _writeQueue(prefs, updated);
  final payloads = <PendingTextSendPayloadWithClaim>[];
  for (final record in candidates.take(limit)) {
    final payload = _parsePayload(record);
    if (payload == null) {
      continue;
    }
    payloads.add(
      PendingTextSendPayloadWithClaim(
        conversationId: payload.conversationId,
        text: payload.text,
        clientMsgId: payload.clientMsgId,
        claimId: claimId,
      ),
    );
  }
  return payloads;
}

List<_PendingSendRecord> _quarantineExhaustedRecords(
  List<_PendingSendRecord> queue, {
  required String tenantId,
  required String conversationId,
  required int nowMs,
}) {
  return queue.map((record) {
    final exhaustible = record.tenantId == tenantId &&
        record.conversationId == conversationId &&
        !record.isQuarantined &&
        record.attemptCount >= maxPendingSendAttempts &&
        !_isFlushClaimActive(record, nowMs);
    if (!exhaustible) {
      return record;
    }
    return record.copyWith(
      queueStatus: _queueStatusQuarantined,
      quarantineReason: _retryBudgetExhaustedReason,
      quarantinedAtMs: nowMs,
      clearFlushClaim: true,
    );
  }).toList();
}

/// Removes a pending send after the server accepted it (ack path).
///
/// The claim must still match the current lease holder: a stale claim id
/// (for example from an expired lease that another flush re-claimed) never
/// removes the record. Returns true when the record was removed.
Future<bool> acknowledgePendingTextSend({
  required String tenantId,
  required String clientMsgId,
  required String claimId,
}) async {
  if (tenantId.isEmpty || clientMsgId.isEmpty || claimId.isEmpty) {
    return false;
  }
  final prefs = await _openPrefs();
  final queue = await _readQueue(prefs);
  final updated = queue
      .where(
        (record) => !(record.tenantId == tenantId &&
            record.clientMsgId == clientMsgId &&
            record.flushClaimId == claimId),
      )
      .toList();
  if (updated.length == queue.length) {
    return false;
  }
  await _writeQueue(prefs, updated);
  return true;
}

/// Releases a flush claim without deleting the record (retry path).
///
/// Only the current lease holder can release: a stale claim id leaves the
/// record untouched, and the cleared record becomes immediately claimable
/// again (its attempt counter keeps its budget progress).
Future<void> releasePendingTextSendClaim({
  required String tenantId,
  required String clientMsgId,
  required String claimId,
}) async {
  if (tenantId.isEmpty || claimId.isEmpty) {
    return;
  }
  final prefs = await _openPrefs();
  final queue = await _readQueue(prefs);
  final updated = queue.map((record) {
    if (record.tenantId == tenantId &&
        record.clientMsgId == clientMsgId &&
        record.flushClaimId == claimId) {
      return record.copyWith(clearFlushClaim: true);
    }
    return record;
  }).toList();
  await _writeQueue(prefs, updated);
}

/// Removes a pending send regardless of claim state.
///
/// Intended for the direct-send dedup path: when the user's live send with
/// the same clientMsgId was accepted, any queued copy is obsolete even if a
/// flush currently holds a claim. The flush ack path must use
/// [acknowledgePendingTextSend] instead.
Future<void> removePendingTextSend({
  required String tenantId,
  required String clientMsgId,
}) async {
  if (tenantId.isEmpty) {
    return;
  }
  final prefs = await _openPrefs();
  final queue = (await _readQueue(prefs))
      .where(
        (record) =>
            !(record.tenantId == tenantId && record.clientMsgId == clientMsgId),
      )
      .toList();
  await _writeQueue(prefs, queue);
}

/// Runs a single-flight flush of the pending sends for one conversation.
///
/// Claiming is scoped to [conversationId], so the flush callback only sees
/// records it owns; other conversations' records stay claimable. While a
/// flush is already in flight the caller waits for it and skips its own pass;
/// the skipped records remain claimable for the next flush.
Future<void> runPendingTextSendFlushForConversation({
  required String tenantId,
  required String conversationId,
  required Future<void> Function(List<PendingTextSendPayloadWithClaim> pending)
      flush,
  int limit = _defaultFlushLimit,
}) async {
  if (_pendingSendFlushInFlight != null) {
    await _pendingSendFlushInFlight;
    return;
  }
  _pendingSendFlushInFlight = () async {
    final pending = await claimPendingTextSends(
      tenantId: tenantId,
      conversationId: conversationId,
      limit: limit,
    );
    if (pending.isEmpty) {
      return;
    }
    await flush(pending);
  }();
  try {
    await _pendingSendFlushInFlight;
  } finally {
    _pendingSendFlushInFlight = null;
  }
}
