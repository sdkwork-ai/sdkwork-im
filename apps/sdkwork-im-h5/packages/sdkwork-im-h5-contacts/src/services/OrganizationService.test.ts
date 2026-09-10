import assert from "node:assert/strict";
import test from "node:test";

import {
  OrganizationDirectoryCycleError,
  resolveDepartmentPath,
} from "./OrganizationService";

test("resolves the root-to-department path in parent-first order", () => {
  const departments = [
    { id: "root", name: "Root", parentId: null, count: 0 },
    { id: "mid", name: "Mid", parentId: "root", count: 0 },
    { id: "leaf", name: "Leaf", parentId: "mid", count: 0 },
  ];
  const path = resolveDepartmentPath(departments, "leaf");
  assert.deepEqual(
    path.map((department) => department.id),
    ["root", "mid", "leaf"],
  );
});

test("returns a single-entry path for a root department and an empty path for unknown ids", () => {
  const departments = [{ id: "root", name: "Root", parentId: null, count: 0 }];
  assert.deepEqual(resolveDepartmentPath(departments, "root"), departments);
  assert.deepEqual(resolveDepartmentPath(departments, "missing"), []);
});

test("fails closed with a typed error on a parentId cycle", () => {
  const departments = [
    { id: "a", name: "A", parentId: "b", count: 0 },
    { id: "b", name: "B", parentId: "a", count: 0 },
  ];
  assert.throws(
    () => resolveDepartmentPath(departments, "a"),
    OrganizationDirectoryCycleError,
  );
});
