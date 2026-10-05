/**
 * Typing indicator contract (signal + realtime push).
 *
 * Runs the typing service and the realtime service from the shipped runtime
 * bundle against structural fakes of the SDK port and the live connection, so
 * the throttle window and the `conversation.typing` scope wiring are exercised
 * exactly as the device will run them.
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
    onConversation: [],
    onScope: [],
    syncConversations: [],
    syncScopes: [],
  };
  const scopeHandlers = new Map();
  const connection = {
    disconnect() {},
    events: {
      onConversation() {
        return () => {};
      },
      onScope(scopeType, scopeId, handler) {
        calls.onScope.push({ scopeType, scopeId });
        const key = `${scopeType}:${scopeId}`;
        const handlers = scopeHandlers.get(key) ?? new Set();
        handlers.add(handler);
        scopeHandlers.set(key, handlers);
        return () => {
          handlers.delete(handler);
        };
      },
    },
    messages: {
      onConversation(conversationId) {
        calls.onConversation.push(conversationId);
        return () => {};
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
  const emitScopeEvent = (scopeType, scopeId, event, context) => {
    const handlers = scopeHandlers.get(`${scopeType}:${scopeId}`) ?? new Set();
    for (const handler of handlers) {
      handler(event, context);
    }
  };
  return { calls, connection, emitScopeEvent };
}

function createFakeRealtimePort(connection) {
  return {
    connect: async () => connection,
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

test("realtime typing subscription declares the scope and dispatches the peer id", async () => {
  const fake = createFakeConnection();
  const service = createImMpChatRealtimeService(() => createFakeRealtimePort(fake.connection));
  const received = [];

  const unsubscribe = service.subscribeConversationTyping("c_1", (peerUserId) => {
    received.push(peerUserId);
  });
  await flushMicrotasks();

  assert.deepEqual(fake.calls.onScope, [{ scopeType: "conversation", scopeId: "c_1" }]);
  assert.equal(fake.calls.syncScopes.length >= 1, true);
  const lastSync = fake.calls.syncScopes[fake.calls.syncScopes.length - 1];
  assert.deepEqual(lastSync, [
    { scopeType: "conversation", scopeId: "c_1", eventTypes: ["conversation.typing"] },
  ]);

  fake.emitScopeEvent("conversation", "c_1", { userId: "u_9" }, {
    eventType: "conversation.typing",
    payload: { conversationId: "c_1", userId: "u_9", userKind: "user" },
  });
  fake.emitScopeEvent("conversation", "c_1", {}, { eventType: "message.posted", payload: {} });

  assert.deepEqual(received, ["u_9"]);

  unsubscribe();
  const finalSync = fake.calls.syncScopes[fake.calls.syncScopes.length - 1];
  assert.deepEqual(finalSync, []);
});
