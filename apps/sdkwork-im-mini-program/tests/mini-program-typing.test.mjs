/**
 * Typing indicator contract (signal + realtime push).
 *
 * Runs the typing service and the realtime service from the shipped runtime
 * bundle against structural fakes of the SDK port and the live connection, so
 * the throttle window and the `conversation.typing` delivery wiring are
 * exercised exactly as the device will run them.
 *
 * Delivery shape: one wire subscription per conversation carries BOTH the
 * message stream and the typing pushes (`[message.posted,
 * conversation.typing]` declared by the connection); the typing lease binds
 * the conversation's event channel and filters the ephemeral typing events
 * out of it. A separate same-key scope entry must never be declared — it
 * would replace the message stream on the wire.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { loadRuntimeBundle, requireBundleExport } from "./lib/load-runtime-bundle.mjs";

const bundle = loadRuntimeBundle();
const createImMpChatRealtimeService = requireBundleExport(
  bundle,
  "createImMpChatRealtimeService",
);
const createImMpChatTypingService = requireBundleExport(bundle, "createImMpChatTypingService");

/** Lets `void ensureConnection()` settle before assertions run. */
async function flushMicrotasks() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function createFakeConnection() {
  const calls = {
    connectConversations: [],
    onConversation: [],
    onScope: [],
    syncConversations: [],
    syncScopes: [],
  };
  const conversationMessageHandlers = new Map();
  const conversationEventHandlers = new Map();
  const connection = {
    disconnect() {},
    events: {
      onConversation(conversationId, handler) {
        calls.onConversation.push(conversationId);
        const handlers = conversationEventHandlers.get(conversationId) ?? new Set();
        handlers.add(handler);
        conversationEventHandlers.set(conversationId, handlers);
        return () => {
          handlers.delete(handler);
        };
      },
      onScope() {
        return () => {};
      },
    },
    messages: {
      onConversation(conversationId, handler) {
        calls.onConversation.push(conversationId);
        const handlers = conversationMessageHandlers.get(conversationId) ?? new Set();
        handlers.add(handler);
        conversationMessageHandlers.set(conversationId, handlers);
        return () => {
          handlers.delete(handler);
        };
      },
    },
    subscriptions: {
      syncConversations(conversationIds) {
        calls.syncConversations.push(conversationIds);
      },
      syncScopes(scopes) {
        calls.syncScopes.push(scopes);
      },
    },
    lifecycle: {
      onError() {
        return () => {};
      },
      onStateChange() {
        return () => {};
      },
    },
  };
  const emitConversationEvent = (conversationId, event, context) => {
    const handlers = conversationEventHandlers.get(conversationId) ?? new Set();
    for (const handler of handlers) {
      handler(event, context);
    }
  };
  return { calls, connection, emitConversationEvent };
}

function createFakeRealtimePort(connection, calls) {
  return {
    connect: async (options) => {
      calls.connectConversations.push(options?.subscriptions?.conversations ?? []);
      return connection;
    },
  };
}

test("typing service throttles signals per conversation and drops the rest", async () => {
  const signaled = [];
  const service = createImMpChatTypingService(() => ({
    conversations: {
      signalTyping: async (conversationId) => {
        signaled.push(conversationId);
        return {};
      },
    },
  }));

  service.signalTyping("c_1");
  service.signalTyping("c_1");
  service.signalTyping("c_2");
  service.signalTyping("");
  await flushMicrotasks();

  assert.deepEqual(signaled, ["c_1", "c_2"]);
});

test("typing service survives a failing signal without throwing", async () => {
  const service = createImMpChatTypingService(() => ({
    conversations: {
      signalTyping: async () => {
        throw new Error("transport down");
      },
    },
  }));

  service.signalTyping("c_1");
  await flushMicrotasks();
});

test("typing lease rides the conversation stream without splitting the wire scope", async () => {
  const fake = createFakeConnection();
  const service = createImMpChatRealtimeService(() =>
    createFakeRealtimePort(fake.connection, fake.calls),
  );
  const received = [];

  // The typing lease is the first demand: it opens the connection with the
  // conversation declared in the connect options.
  const unsubscribeTyping = service.subscribeConversationTyping("c_1", (peerUserId) => {
    received.push(peerUserId);
  });
  await flushMicrotasks();
  assert.deepEqual(fake.calls.connectConversations, [["c_1"]]);

  // The conversation page then adds its message lease on the open connection.
  const unsubscribeMessages = service.subscribeConversation("c_1", () => {});
  assert.deepEqual(
    fake.calls.syncConversations[fake.calls.syncConversations.length - 1],
    ["c_1"],
  );

  // One wire subscription for the conversation (no typing scope entry that
  // could replace the message stream), and both channels are bound.
  assert.deepEqual(fake.calls.syncScopes, []);
  assert.equal(fake.calls.onConversation.filter((id) => id === "c_1").length, 2);

  // The typing event is dispatched through the conversation event channel.
  fake.emitConversationEvent(
    "c_1",
    { userId: "u_9" },
    { eventType: "conversation.typing", payload: { userId: "u_9", userKind: "user" } },
  );
  fake.emitConversationEvent("c_1", {}, { eventType: "message.posted", payload: {} });
  assert.deepEqual(received, ["u_9"]);

  // Releasing the message lease keeps the wire subscription (typing remains).
  unsubscribeMessages();
  assert.deepEqual(
    fake.calls.syncConversations[fake.calls.syncConversations.length - 1],
    ["c_1"],
  );

  // Releasing the typing lease drops the wire entry.
  unsubscribeTyping();
  assert.deepEqual(
    fake.calls.syncConversations[fake.calls.syncConversations.length - 1],
    [],
  );
});
