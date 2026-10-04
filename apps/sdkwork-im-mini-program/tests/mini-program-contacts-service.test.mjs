/**
 * Contacts service contract.
 *
 * Authority: `MINI_PROGRAM_APP_ARCHITECTURE_SPEC.md` section 7 and the
 * generated `social` surface. Runs the contacts service from the shipped
 * runtime bundle against a structural fake of the SDK port, so the projection
 * and validation rules are exercised exactly as the device will run them.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { loadRuntimeBundle, requireBundleExport } from "./lib/load-runtime-bundle.mjs";

const bundle = loadRuntimeBundle();
const createImMpContactsService = requireBundleExport(bundle, "createImMpContactsService");
const toImMpContactsContactItem = requireBundleExport(bundle, "toImMpContactsContactItem");

function createFakePort(responses) {
  const calls = { contactsList: [], usersList: [], bindDirectChat: [] };
  const port = {
      conversations: {
        bindDirectChat: async (body) => {
          calls.bindDirectChat.push(body);
          return responses.bindDirectChat ?? { conversationId: "conv-1" };
        },
      },
      social: {
        contacts: {
          list: async (params) => {
            calls.contactsList.push(params);
            return responses.contacts ?? {
              items: [
                {
                  tenantId: "t1",
                  ownerUserId: "me",
                  targetUserId: "u_1",
                  displayName: "Alice",
                  avatarUrl: "https://cdn.example/a.png",
                  contactType: "friend",
                  relationshipState: "friend",
                  friendshipId: "f_1",
                },
                {
                  tenantId: "t1",
                  ownerUserId: "me",
                  targetUserId: "u_2",
                  displayName: null,
                  avatarUrl: null,
                  contactType: "friend",
                  relationshipState: "friend",
                  friendshipId: "f_2",
                },
              ],
              pageInfo: { mode: "cursor", hasMore: true, nextCursor: "cur-2" },
            };
          },
        },
        users: {
          list: async (params) => {
            calls.usersList.push(params);
            return responses.users ?? {
              items: [
                {
                  tenantId: "t1",
                  userId: "u_9",
                  chatId: "c_9",
                  displayName: "Bob",
                  relationshipState: "none",
                  avatarUrl: null,
                },
              ],
              pageInfo: { mode: "cursor", hasMore: false },
            };
          },
        },
        friendRequests: responses.friendRequests ?? {
          list: async () => ({ items: [], pageInfo: { mode: "cursor", hasMore: false } }),
          create: async () => ({}),
          accept: async () => ({}),
          decline: async () => ({}),
          cancel: async () => ({}),
          pendingCount: async () => ({ count: 0 }),
        },
      },
  };
  port.calls = calls;
  return { calls, port };
}

test("projects contacts with the display-name fallback and the cursor contract", async () => {
  const { port } = createFakePort({});
  const service = createImMpContactsService(() => port);
  const page = await service.listContacts();

  assert.equal(page.items.length, 2);
  assert.equal(page.items[0].userId, "u_1");
  assert.equal(page.items[0].displayName, "Alice");
  assert.equal(page.items[0].avatarUrl, "https://cdn.example/a.png");
  // A nameless contact falls back to the user id, never renders blank.
  assert.equal(page.items[1].displayName, "u_2");
  assert.equal(page.hasMore, true);
  assert.equal(page.nextCursor, "cur-2");
  assert.equal(port.calls.contactsList[0].pageSize > 0, true);
});

test("search rejects a blank query and forwards the query text", async () => {
  const { port } = createFakePort({});
  const service = createImMpContactsService(() => port);

  await assert.rejects(() => service.searchUsers("   "), /search query is required/u);

  const page = await service.searchUsers("bob");
  assert.equal(page.items[0].userId, "u_9");
  assert.equal(port.calls.usersList[0].q, "bob");
});

test("startDirectChat binds the current user as the left actor", async () => {
  const { port } = createFakePort({});
  const service = createImMpContactsService(() => port);

  const conversationId = await service.startDirectChat("me", {
    userId: "u_1",
    displayName: "Alice",
    relationshipState: "friend",
  });

  assert.equal(conversationId, "conv-1");
  assert.equal(port.calls.bindDirectChat[0].leftActorId, "me");
  assert.equal(port.calls.bindDirectChat[0].rightActorId, "u_1");
  assert.equal(port.calls.bindDirectChat[0].leftActorKind, "user");
  assert.equal(port.calls.bindDirectChat[0].rightActorKind, "user");

  await assert.rejects(
    () => service.startDirectChat("  ", { userId: "u_1", displayName: "x", relationshipState: "friend" }),
    /current user id is required/u,
  );
});

test("friend request submission omits an empty message and trims ids", async () => {
  const created = [];
  const { port } = createFakePort({
    friendRequests: {
      list: async () => ({ items: [], pageInfo: { mode: "cursor", hasMore: false } }),
      create: async (body) => {
        created.push(body);
        return {};
      },
      accept: async (id) => ({ accepted: id }),
      decline: async () => ({}),
      cancel: async () => ({}),
      pendingCount: async () => ({ count: 3 }),
    },
  });
  const service = createImMpContactsService(() => port);

  await service.sendFriendRequest(" u_7 ", "   ");
  assert.deepEqual(created[0], { targetUserId: "u_7" });

  await service.sendFriendRequest("u_8", "hi");
  assert.deepEqual(created[1], { targetUserId: "u_8", requestMessage: "hi" });

  await assert.rejects(() => service.acceptFriendRequest("  "), /friend request id is required/u);
  assert.equal(await service.pendingFriendRequestCount(), 3);
});

test("the contact projection keeps the string identity untouched", () => {
  const item = toImMpContactsContactItem({
    targetUserId: "9007199254740993",
    displayName: "",
    relationshipState: "friend",
  });
  assert.equal(typeof item.userId, "string");
  assert.equal(item.userId, "9007199254740993");
});
