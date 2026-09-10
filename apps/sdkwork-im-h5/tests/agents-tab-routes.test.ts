import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_IM_H5_MODULES, COMPOSABLE_IM_H5_MODULES, CONTRACT_PENDING_IM_H5_MODULES } from "../packages/sdkwork-im-h5-shell/src/moduleCatalog";
import { IM_H5_ROUTE_DEFINITIONS } from "../packages/sdkwork-im-h5-shell/src/routeCatalog";

test("agents tab page routes are composed with the real marketplace surfaces", () => {
  assert.equal(IM_H5_ROUTE_DEFINITIONS.agentsList.path, "/agents");
  assert.equal(IM_H5_ROUTE_DEFINITIONS.agentsSearch.path, "/agent-search");
  assert.equal(IM_H5_ROUTE_DEFINITIONS.agentsChat.path, "/agent/chat/:agentId");
  assert.equal(IM_H5_ROUTE_DEFINITIONS.agentsChat.moduleId, "agents");
  assert.equal(IM_H5_ROUTE_DEFINITIONS.agentsChat.screen, "chat");
  // The marketplace tab routes are owned by the contacts module (default
  // composition); the agent lifecycle module (agent chat/create/edit) is
  // opt-in via `VITE_SDKWORK_IM_H5_MODULES` (audited release surface, PRD).
  assert.equal(IM_H5_ROUTE_DEFINITIONS.agentsList.moduleId, "contacts");
  assert.deepEqual(DEFAULT_IM_H5_MODULES, ["chat", "contacts", "notary", "orders"]);
  assert.equal(COMPOSABLE_IM_H5_MODULES.has("agents"), false);
  assert.equal(CONTRACT_PENDING_IM_H5_MODULES.has("agents"), true);
});
