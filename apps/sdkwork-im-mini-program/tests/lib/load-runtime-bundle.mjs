/**
 * Loads the built IM mini program runtime bundle from Node.
 *
 * The bundle is CommonJS (the WeChat runtime loads it directly) but the
 * repository root declares `"type": "module"`, so a plain `require` would make
 * Node parse it as ESM and fail on `module.exports`. The bundle is fully
 * self-contained — esbuild inlines every workspace package and no import is
 * marked external — so it is evaluated with `new Function` and a `require` shim
 * that fails loudly if the bundle ever stops being self-contained.
 *
 * Tests read the built artifact on purpose: the checked-in
 * `src/runtime/im-app.js` is the code that ships, so asserting against it is
 * asserting against the deployment. It is committed, so the suite runs on a
 * fresh clone without a prior build.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const libRoot = path.dirname(fileURLToPath(import.meta.url));

/** `apps/sdkwork-im-mini-program` */
export const appRoot = path.resolve(libRoot, "..", "..");

export const runtimeDir = path.join(appRoot, "src", "runtime");
export const runtimeBundlePath = path.join(runtimeDir, "im-app.js");
export const runtimeEnvPath = path.join(runtimeDir, "runtime-env.js");
export const buildManifestPath = path.join(runtimeDir, "build-manifest.json");
export const appJsonPath = path.join(appRoot, "src", "app.json");

/** Minimum plausible bundle size; anything smaller means a truncated build. */
const MIN_BUNDLE_BYTES = 10_000;

export function loadRuntimeBundle(file = runtimeBundlePath) {
  if (!existsSync(file)) {
    throw new Error(
      `IM mini program runtime bundle is missing: ${file}\n` +
        "Run `pnpm build:mini-program` in apps/sdkwork-im-mini-program.",
    );
  }
  const source = readFileSync(file, "utf8");
  if (source.length < MIN_BUNDLE_BYTES) {
    throw new Error(`IM mini program runtime bundle looks truncated: ${source.length} bytes`);
  }
  const loaded = { exports: {} };
  const factory = new Function("module", "exports", "require", source);
  factory(loaded, loaded.exports, (specifier) => {
    throw new Error(
      `Runtime bundle must be self-contained but required ${JSON.stringify(specifier)}`,
    );
  });
  return loaded.exports;
}

export function requireBundleExport(bundle, name) {
  const value = bundle[name];
  if (value === undefined) {
    throw new Error(`Runtime bundle must export ${name}`);
  }
  return value;
}

/**
 * Recursively lists files with the given extension, skipping `node_modules`.
 *
 * Shared by the suites so "every stylesheet" and "every package source file"
 * mean the same traversal rather than two subtly different ones.
 */
export function listFiles(dir, extension) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...listFiles(full, extension));
    } else if (entry.name.endsWith(extension)) {
      found.push(full);
    }
  }
  return found;
}

/**
 * Reads and parses a JSON file, tolerating a UTF-8 BOM.
 *
 * `JSON.parse` rejects a leading BOM outright, and several manifests in this
 * workspace carry one — a bare `JSON.parse(readFileSync(...))` throws on them,
 * which silently turns a real assertion into a skipped one when the caller
 * swallows the error. Always read JSON through this helper.
 */
export function readJsonFile(file) {
  return JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

/**
 * Finds real platform-global member access (`wx.`, `my.`, `dd.`) in source.
 *
 * Shared by the boundary check and by that check's own regression test, so the
 * detector is verified against known inputs rather than trusted. A checker that
 * can only ever return "clean" is worse than no checker.
 */
export function findPlatformGlobalAccess(source, globals = ["wx", "my", "dd"]) {
  const code = stripCommentsAndLiterals(source);
  const found = [];
  for (const globalName of globals) {
    for (const match of code.matchAll(new RegExp(`\\b${globalName}\\s*\\.`, "gu"))) {
      found.push({ globalName, index: match.index });
    }
  }
  return found.sort((left, right) => left.index - right.index);
}

/**
 * Blanks out comments and string/template literals, keeping line numbers.
 *
 * Used by the platform-global boundary check. That check looks for real member
 * access (`wx.something`), so both comments AND literals must go: a comment
 * explaining why a file does NOT call `wx.x`, and an error message like
 * `throw new Error("wx.login() did not return a code")`, are prose, not calls.
 * An earlier comment-only version reported the error message as a violation.
 *
 * Removed spans are replaced with spaces (newlines preserved) so a reported
 * line number still points at the right line. Template-literal interpolations
 * are kept as code, so `wx.foo()` inside `${...}` is still detected.
 *
 * This is a scanner, not a parser. Two limits are accepted, both of which fail
 * loudly rather than silently: it does not distinguish a regex literal from a
 * division (so a regex written as `/**` or containing `//` would confuse it),
 * and an interpolation is closed by counting braces, so a `{` or `}` inside a
 * string within `${...}` shifts the count. Neither pattern appears in this root.
 */
export function stripCommentsAndLiterals(source) {
  const chars = [...source];
  const blank = (from, to) => {
    for (let index = from; index < to; index += 1) {
      if (chars[index] !== "\n") {
        chars[index] = " ";
      }
    }
  };

  let index = 0;
  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "/" && next === "/") {
      let end = index;
      while (end < source.length && source[end] !== "\n") {
        end += 1;
      }
      blank(index, end);
      index = end;
      continue;
    }

    if (char === "/" && next === "*") {
      const end = source.indexOf("*/", index + 2);
      const stop = end === -1 ? source.length : end + 2;
      blank(index, stop);
      index = stop;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      const quote = char;
      let cursor = index + 1;
      let literalStart = index;
      while (cursor < source.length) {
        if (source[cursor] === "\\") {
          cursor += 2;
          continue;
        }
        if (source[cursor] === quote) {
          blank(literalStart, cursor + 1);
          cursor += 1;
          break;
        }
        if (quote === "`" && source[cursor] === "$" && source[cursor + 1] === "{") {
          // Blank the literal text up to the interpolation, then skip the
          // expression as CODE and KEEP scanning the template.
          //
          // Exiting the template here instead - which an earlier version did -
          // leaves the template's own closing backtick to be read as a new
          // opening one, and every span after it is blanked as if it were
          // literal text. That is exactly how a doc comment three hundred lines
          // later was reported as a platform-global violation.
          blank(literalStart, cursor + 2);
          let depth = 1;
          let scan = cursor + 2;
          while (scan < source.length && depth > 0) {
            if (source[scan] === "{") depth += 1;
            else if (source[scan] === "}") depth -= 1;
            scan += 1;
          }
          cursor = scan;
          literalStart = cursor;
          continue;
        }
        cursor += 1;
      }
      if (cursor >= source.length) {
        blank(literalStart, source.length);
      }
      index = Math.max(cursor, index + 1);
      continue;
    }

    index += 1;
  }

  return chars.join("");
}
