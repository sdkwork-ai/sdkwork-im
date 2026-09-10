import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sdkwork_im_flutter_mobile_chat/sdkwork_im_flutter_mobile_chat.dart';

// Storage contract locked by the offline send queue service; the legacy-claim
// heal test seeds this key directly.
const _storageKey = 'sdkwork-im-flutter-mobile:pending-sends:v2';
const _tenantId = 'tenant-1';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues(<String, Object>{});
  });

  test(
      'claims only the flushing conversation so other conversations stay claimable',
      () async {
    await enqueuePendingTextSend(
      tenantId: _tenantId,
      payload: _payload('conversation-1', 'client-1'),
    );
    await enqueuePendingTextSend(
      tenantId: _tenantId,
      payload: _payload('conversation-2', 'client-2'),
    );

    final conversation1 = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000,
    );
    expect(conversation1, hasLength(1));
    expect(conversation1.single.clientMsgId, 'client-1');

    final conversation2 = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-2',
      nowMs: 1000,
    );
    expect(conversation2, hasLength(1));
    expect(conversation2.single.clientMsgId, 'client-2');
  });

  test('re-claims a send after its claim lease expires', () async {
    await enqueuePendingTextSend(
      tenantId: _tenantId,
      payload: _payload('conversation-1', 'client-1'),
    );

    final first = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000,
    );
    expect(first, hasLength(1));
    expect(first.single.claimId, isNotEmpty);

    final duringLease = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000 + pendingSendClaimLeaseMs - 1,
    );
    expect(duringLease, isEmpty);

    final afterLease = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000 + pendingSendClaimLeaseMs + 1,
    );
    expect(afterLease, hasLength(1));
    expect(afterLease.single.clientMsgId, 'client-1');
    expect(afterLease.single.claimId, isNot(first.single.claimId));
  });

  test('a stale claim cannot acknowledge or release another lease', () async {
    await enqueuePendingTextSend(
      tenantId: _tenantId,
      payload: _payload('conversation-1', 'client-1'),
    );

    final stale = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000,
    );
    final current = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000 + pendingSendClaimLeaseMs + 1,
    );
    expect(current.single.claimId, isNot(stale.single.claimId));

    expect(
      await acknowledgePendingTextSend(
        tenantId: _tenantId,
        clientMsgId: 'client-1',
        claimId: stale.single.claimId,
      ),
      isFalse,
    );

    // A stale release must not clear the active lease either.
    await releasePendingTextSendClaim(
      tenantId: _tenantId,
      clientMsgId: 'client-1',
      claimId: stale.single.claimId,
    );
    final duringCurrentLease = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000 + pendingSendClaimLeaseMs + 2,
    );
    expect(duringCurrentLease, isEmpty);

    expect(
      await acknowledgePendingTextSend(
        tenantId: _tenantId,
        clientMsgId: 'client-1',
        claimId: current.single.claimId,
      ),
      isTrue,
    );
    expect(await listPendingTextSends(tenantId: _tenantId), isEmpty);
    expect(await listQuarantinedTextSends(tenantId: _tenantId), isEmpty);
  });

  test(
      'quarantines a send after the retry budget is exhausted and keeps it surfaced',
      () async {
    await enqueuePendingTextSend(
      tenantId: _tenantId,
      payload: _payload('conversation-1', 'client-1'),
    );

    for (var attempt = 0; attempt < maxPendingSendAttempts; attempt += 1) {
      final claimed = await claimPendingTextSends(
        tenantId: _tenantId,
        conversationId: 'conversation-1',
        nowMs: 1000 + attempt * (pendingSendClaimLeaseMs + 1),
      );
      expect(claimed, hasLength(1), reason: 'claim attempt ${attempt + 1}');
    }

    final exhausted = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000 + maxPendingSendAttempts * (pendingSendClaimLeaseMs + 1),
    );
    expect(exhausted, isEmpty);
    expect(await listPendingTextSends(tenantId: _tenantId), isEmpty);

    final quarantined = await listQuarantinedTextSends(tenantId: _tenantId);
    expect(quarantined, hasLength(1));
    expect(quarantined.single.clientMsgId, 'client-1');
    expect(quarantined.single.attemptCount, maxPendingSendAttempts);
    expect(quarantined.single.quarantineReason, 'retry budget exhausted');
  });

  test('heals a claim persisted without an expiry as expired', () async {
    // Records written by the version without lease expiry carry flushClaimId
    // but no flushClaimExpiresAtMs; they must become claimable again instead
    // of stranding forever.
    SharedPreferences.setMockInitialValues(<String, Object>{
      _storageKey: jsonEncode([
        {
          'tenantId': _tenantId,
          'clientMsgId': 'client-stranded',
          'conversationId': 'conversation-1',
          'payloadJson': jsonEncode({
            'conversationId': 'conversation-1',
            'text': 'hello',
            'clientMsgId': 'client-stranded',
          }),
          'createdAt': '2026-09-09T00:00:00.000Z',
          'attemptCount': 1,
          'flushClaimId': 'flutter-flush-123-456',
        },
      ]),
    });

    final claimed = await claimPendingTextSends(
      tenantId: _tenantId,
      conversationId: 'conversation-1',
      nowMs: 1000,
    );
    expect(claimed, hasLength(1));
    expect(claimed.single.clientMsgId, 'client-stranded');
    expect(claimed.single.claimId, isNot('flutter-flush-123-456'));
  });
}

PendingTextSendPayload _payload(String conversationId, String clientMsgId) {
  return PendingTextSendPayload(
    conversationId: conversationId,
    text: 'hello from $clientMsgId',
    clientMsgId: clientMsgId,
  );
}
