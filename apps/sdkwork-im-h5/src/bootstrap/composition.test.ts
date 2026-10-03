import assert from "node:assert/strict";
import test from "node:test";

import {
  parseImH5ModuleSelection,
  resolveConfiguredImH5ModuleIds,
} from "./composition";

test("keeps the audited real-SDK application composition (fail-closed)", () => {
  // The default composition is the audited H5 release surface only
  // (moduleCatalog.ts): chat / contacts / notary / orders render real,
  // SDK-backed content end to end. Everything else — including the `user`
  // module, whose package still carries fabricated billing/games pages —
  // stays opt-in through VITE_SDKWORK_IM_H5_MODULES (fail-closed, PRD).
  // Account identity and sign-out ship through the chat header account
  // sheet, which consumes only the real IAM ProfileService and the
  // app-owned logout executor.
  const expected = ["chat", "contacts", "notary", "orders"];
  assert.deepEqual(resolveConfiguredImH5ModuleIds(), expected);
  assert.deepEqual(parseImH5ModuleSelection(), expected);
});

test("accepts an explicit composition of SDK-backed modules", () => {
  assert.deepEqual(
    parseImH5ModuleSelection("chat, contacts, notary, orders"),
    ["chat", "contacts", "notary", "orders"],
  );
  assert.deepEqual(parseImH5ModuleSelection("notary"), ["notary"]);
});

test("rejects unknown, duplicate, empty, and contract-pending modules", () => {
  assert.throws(() => parseImH5ModuleSelection("chat,unknown"), /unknown module unknown/u);
  assert.throws(() => parseImH5ModuleSelection("chat,chat"), /duplicate module chat/u);
  assert.throws(() => parseImH5ModuleSelection("chat,,drive"), /empty module id/u);
  assert.throws(() => parseImH5ModuleSelection("chat,channels"), /does not have a composed runtime contract/u);
  // Mock-only modules moved to contract-pending until a real owner SDK exists.
  assert.throws(
    () => parseImH5ModuleSelection("chat,approval"),
    /approval does not have a composed runtime contract/u,
  );
  // The user module keeps fabricated billing/games pages; it is
  // contract-pending until those surfaces are split out or backed by a
  // real owner SDK.
  assert.throws(
    () => parseImH5ModuleSelection("chat,user"),
    /user does not have a composed runtime contract/u,
  );
});
