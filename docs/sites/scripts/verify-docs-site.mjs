import fs from "node:fs";
import path from "node:path";

const docsRoot = process.cwd();
const repoRoot = path.resolve(docsRoot, "..", "..");
const issues = [];

function marker(...parts) {
  return parts.join("");
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function assertFileExists(relativePath, baseDir = docsRoot) {
  const absolutePath = path.join(baseDir, relativePath);
  if (!fs.existsSync(absolutePath)) {
    issues.push(`${relativePath}: missing file`);
    return null;
  }
  return absolutePath;
}

function assertContains(relativePath, expectedText, baseDir = docsRoot) {
  const absolutePath = assertFileExists(relativePath, baseDir);
  if (!absolutePath) {
    return;
  }

  const content = read(absolutePath);
  if (!content.includes(expectedText)) {
    issues.push(`${relativePath}: missing "${expectedText}"`);
  }
}

function assertContainsInFirstExisting(relativePaths, expectedText, baseDir = docsRoot) {
  for (const relativePath of relativePaths) {
    const absolutePath = path.join(baseDir, relativePath);
    if (!fs.existsSync(absolutePath)) {
      continue;
    }

    const content = read(absolutePath);
    if (!content.includes(expectedText)) {
      issues.push(`${relativePath}: missing "${expectedText}"`);
    }
    return;
  }

  issues.push(`${relativePaths.join(' or ')}: missing file`);
}

function assertDoesNotContain(relativePath, forbiddenText, baseDir = docsRoot) {
  const absolutePath = assertFileExists(relativePath, baseDir);
  if (!absolutePath) {
    return;
  }

  const content = read(absolutePath);
  if (content.includes(forbiddenText)) {
    issues.push(`${relativePath}: must not contain "${forbiddenText}"`);
  }
}

// The retired admin storage reference page (reference/admin-storage-contract.md) was removed:
// the /backend/v3/api/admin/storage/* surface it described was never implemented and is not part
// of the current backend authority. Do not reintroduce page or link assertions for it.

assertContains("reference/cli-and-scripts.md", "npm run docs:verify");
assertContains("reference/cli-and-scripts.md", "sdkwork-im-sdk");
assertContains("reference/cli-and-scripts.md", "sdkwork-im-app-sdk");
assertContains("reference/cli-and-scripts.md", "sdkwork-im-backend-sdk");
assertContains("reference/cli-and-scripts.md", "sdkwork-rtc-sdk");
assertContains("reference/cli-and-scripts.md", "sdkwork-im-im.sdkgen.yaml");
assertContains("reference/cli-and-scripts.md", "sdkwork-im-im.flutter.sdkgen.yaml");
assertContains(
  "reference/cli-and-scripts.md",
  "node .\\sdks\\sdkwork-im-sdk\\bin\\verify-sdk.mjs",
);
assertContains("reference/cli-and-scripts.md", "prepare-openapi-source.mjs");
assertContains("reference/cli-and-scripts.md", "materialize-im-v3-openapi-boundaries.mjs");
assertContains(
  "reference/cli-and-scripts.md",
  "node .\\sdks\\sdkwork-im-app-sdk\\bin\\verify-sdk.mjs",
);
assertContains(
  "reference/cli-and-scripts.md",
  "node .\\sdks\\sdkwork-im-backend-sdk\\bin\\verify-sdk.mjs",
);
assertContains(
  "reference/cli-and-scripts.md",
  "node ..\\sdkwork-rtc\\sdks\\sdkwork-rtc-sdk\\bin\\verify-sdk.mjs",
);
assertContains("reference/cli-and-scripts.md", "sdk-manifest.json");
assertContains("reference/cli-and-scripts.md", "Do not use a separate admin or control SDK family.");
assertDoesNotContain(
  "reference/cli-and-scripts.md",
  marker("sdkwork", "-control", "-plane", "-sdk"),
);
assertDoesNotContain(
  "reference/cli-and-scripts.md",
  marker("sdkwork", "-im", "-admin", "-sdk"),
);

// No apps/sdkwork-im-admin surface exists; if one is ever added it must not reference the
// retired admin storage contract page either.

if (issues.length > 0) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(
  "Verified docs navigation links and CLI docs alignment (retired admin storage reference page removed).",
);
