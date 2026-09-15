/**
 * CSS class coverage audit for sdkwork-im-h5.
 *
 * Extracts every static className token from all sources that im-h5's
 * Tailwind scans (local packages + the @source-listed external packages),
 * then verifies each token exists in the built CSS (with Tailwind escaping
 * and variant handling). Reports classes that are used but never generated.
 *
 * Usage: node scripts/audit-class-coverage.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The shared checkout root: this script lives four levels below it.
const WORKSPACE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");

const IM_H5_ROOT = join(WORKSPACE_ROOT, "sdkwork-im/apps/sdkwork-im-h5");
const AGENTS_H5_ROOT = join(WORKSPACE_ROOT, "sdkwork-agents/apps/sdkwork-agents-h5");

// Every root scanned by im-h5's Tailwind (auto root + explicit @source entries).
const SCAN_ROOTS = [
  join(IM_H5_ROOT, "src"),
  join(IM_H5_ROOT, "packages"),
  join(AGENTS_H5_ROOT, "packages"),
  join(WORKSPACE_ROOT, "sdkwork-aiot/apps/sdkwork-aiot-shared/packages/sdkwork-aiot-mobile-react-hardware/src"),
  join(WORKSPACE_ROOT, "sdkwork-iam/apps/sdkwork-iam-h5/packages/sdkwork-iam-h5-auth/src"),
  join(WORKSPACE_ROOT, "sdkwork-community/apps/sdkwork-community-common/packages/sdkwork-community-mobile-react-community/src"),
  join(WORKSPACE_ROOT, "sdkwork-course/apps/sdkwork-course-common/packages/sdkwork-course-mobile-react-courses/src"),
  join(WORKSPACE_ROOT, "sdkwork-drive/apps/sdkwork-drive-common/packages/sdkwork-drive-mobile-react-drive/src"),
  join(WORKSPACE_ROOT, "sdkwork-image/apps/sdkwork-image-common/packages/sdkwork-image-mobile-react-generation/src"),
  join(WORKSPACE_ROOT, "sdkwork-knowledgebase/apps/sdkwork-knowledgebase-common/packages/sdkwork-knowledgebase-mobile-react-knowledge/src"),
  join(WORKSPACE_ROOT, "sdkwork-membership/apps/sdkwork-membership-common/packages/sdkwork-membership-mobile-react-subscription/src"),
  join(WORKSPACE_ROOT, "sdkwork-music/apps/sdkwork-music-common/packages/sdkwork-music-mobile-react-generation/src"),
  join(WORKSPACE_ROOT, "sdkwork-music/apps/sdkwork-music-common/packages/sdkwork-music-mobile-react-playback/src"),
  join(WORKSPACE_ROOT, "sdkwork-notary/apps/sdkwork-notary-h5/packages/sdkwork-notary-h5-notary/src"),
  join(WORKSPACE_ROOT, "sdkwork-order/apps/sdkwork-order-common/packages/sdkwork-order-mobile-react-orders/src"),
  join(WORKSPACE_ROOT, "sdkwork-order/apps/sdkwork-order-h5/packages/sdkwork-order-h5-subscription/src"),
  join(WORKSPACE_ROOT, "sdkwork-order/apps/sdkwork-order-h5/packages/sdkwork-order-h5-withdraw/src"),
  join(WORKSPACE_ROOT, "sdkwork-rtc/apps/sdkwork-rtc-h5/packages/sdkwork-rtc-mobile-react-meeting/src"),
  join(WORKSPACE_ROOT, "sdkwork-shop/apps/sdkwork-shop-common/packages/sdkwork-shop-mobile-react-shopping/src"),
  join(WORKSPACE_ROOT, "sdkwork-video/apps/sdkwork-video-common/packages/sdkwork-video-mobile-react-generation/src"),
  join(WORKSPACE_ROOT, "sdkwork-voice/apps/sdkwork-voice-common/packages/sdkwork-voice-mobile-react-generation/src"),
  join(WORKSPACE_ROOT, "sdkwork-voice/apps/sdkwork-voice-common/packages/sdkwork-voice-mobile-my-voices/src"),
  join(WORKSPACE_ROOT, "sdkwork-ui/sdkwork-ui-mobile-react/src"),
];

function collectFiles(root, out = []) {
  let entries;
  try {
    entries = readdirSync(root);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === "dist" || entry === ".git") continue;
    const full = join(root, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) collectFiles(full, out);
    else if (/\.(ts|tsx)$/u.test(entry)) out.push(full);
  }
  return out;
}

const CLASS_TOKEN_RE =
  /^[a-zA-Z@][a-zA-Z0-9_:[\]\/.#%()&,=\-*!]*$/u;

/** Known single-word utilities (no `-`, `[`, `:`, `/`) that are real classes. */
const SINGLE_WORD_CLASSES = new Set([
  "flex", "grid", "block", "hidden", "inline", "inline-block", "inline-flex",
  "table", "contents", "flow-root", "relative", "absolute", "fixed", "sticky",
  "static", "none", "auto", "left", "right", "top", "bottom", "center", "start",
  "end", "nowrap", "truncate", "uppercase", "lowercase", "capitalize", "italic",
  "underline", "line-through", "no-underline", "bold", "medium", "semibold",
  "light", "normal", "thin", "black", "white", "transparent", "current",
  "inherit", "initial", "unset", "revert", "fill", "stroke", "visible",
  "invisible", "sr-only", "not-sr-only", "antialiased", "subpixel-antialiased",
  "shadow", "ring", "outline-none", "rounded", "border", "border-t", "border-r",
  "border-b", "border-l", "divide", "space-x", "space-y", "scroll-mt", "scroll-mb",
]);

/** Is this token plausibly a Tailwind class (not prose from template literals)? */
function isClassLike(token) {
  // Skip tokens with uppercase letters outside `[...]` (names, prose, errors).
  const outsideBrackets = token.replace(/\[[^\]]*\]/gu, "");
  if (/[A-Z]/u.test(outsideBrackets)) {
    return false;
  }
  // Tokens with a structural marker are classes.
  if (/[:\-[\]\/.%]|^!/u.test(token)) {
    return true;
  }
  return SINGLE_WORD_CLASSES.has(token);
}

function extractClassTokens(source) {
  const tokens = new Set();
  // className="..." / className={'...'} / className={`...`} and bare strings in cn(...)
  const stringRe = /(?:className|title|placeholder|aria-label)?\s*=\s*(['"`])(.*?)\1|cn\(\s*(['"`])(.*?)\3/gsu;
  let m;
  while ((m = stringRe.exec(source)) !== null) {
    const raw = m[2] ?? m[4];
    for (const part of raw.split(/\s+/u)) {
      const token = part.trim();
      if (!token || token.startsWith("$") || token.includes("${")) continue;
      if (CLASS_TOKEN_RE.test(token)) tokens.add(token);
    }
  }
  return tokens;
}

/** Tailwind CSS escaping for a class token (approximation of the official rules). */
function escapeForCss(token) {
  // Hyphens and alphanumerics need no escaping; `-` MUST stay unescaped.
  return token.replace(
    /([\\()[\]{}#.,:;'"`%=+*\/|&^~<>!?@])/gu,
    "\\$1",
  ).replace(/\s/gu, "\\ ");
}

function main() {
  const distDir = join(IM_H5_ROOT, "dist", "assets");
  const cssFiles = readdirSync(distDir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => join(distDir, f));
  const css = cssFiles.map((f) => readFileSync(f, "utf8")).join("\n");

  const missing = new Map(); // token -> files
  let checked = 0;
  let present = 0;

  for (const root of SCAN_ROOTS) {
    const files = collectFiles(root);
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const tokens = extractClassTokens(source);
      for (const token of tokens) {
        if (!isClassLike(token)) continue;
        checked += 1;
        const escaped = escapeForCss(token);
        if (css.includes(`.${escaped}`) || css.includes(`.${escaped}:`)) {
          present += 1;
        } else {
          if (!missing.has(token)) missing.set(token, new Set());
          missing.get(token).add(relative(WORKSPACE_ROOT, file));
        }
      }
    }
  }

  console.log(`checked=${checked} present=${present} missing=${missing.size}`);
  const sorted = [...missing.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [token, files] of sorted) {
    console.log(`MISSING ${token}  <- ${[...files].slice(0, 3).join(", ")}`);
  }
}

main();
