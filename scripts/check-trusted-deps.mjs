// scripts/check-trusted-deps.mjs
// Locks in Bun's default supply-chain posture: dependency lifecycle scripts
// (preinstall/install/postinstall) stay blocked.
//
// Bun never runs a dependency's install scripts unless the package is listed in
// `trustedDependencies` (or is on Bun's small built-in allow-list). A malicious
// postinstall is one of the most common npm supply-chain payloads, so adding a
// package to `trustedDependencies` is a security decision that must be reviewed,
// not slipped in. This check fails CI if any workspace package.json grants trust
// to a package that is not in the explicitly-reviewed ALLOW set below.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Directories whose immediate children may be workspace packages.
const WORKSPACE_DIRS = ["packages", "apps"];

// Reviewed, intentional exceptions. Each entry is a package whose lifecycle
// scripts we have audited and deliberately allow to run. Keep this empty unless
// a build genuinely breaks without a dependency's postinstall, and document why.
const ALLOW = new Set([
  // e.g. "esbuild", // native binary fetch — audited 2026-xx-xx
]);

/** Every package.json in the workspace (root + packages/* + apps/*). */
function manifestPaths() {
  const paths = [];
  if (existsSync("package.json")) {
    paths.push("package.json");
  }
  for (const dir of WORKSPACE_DIRS) {
    if (!existsSync(dir)) {
      continue;
    }
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }
      const manifest = join(dir, entry.name, "package.json");
      if (existsSync(manifest)) {
        paths.push(manifest);
      }
    }
  }
  return paths;
}

const violations = [];
for (const path of manifestPaths()) {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    violations.push(`${path}: not valid JSON (${err.message})`);
    continue;
  }
  const trusted = pkg.trustedDependencies;
  if (trusted === undefined) {
    continue;
  }
  if (!Array.isArray(trusted)) {
    violations.push(`${path}: "trustedDependencies" must be an array`);
    continue;
  }
  for (const name of trusted) {
    if (!ALLOW.has(name)) {
      violations.push(
        `${path}: trusts "${name}" — allowing its install scripts to run. ` +
          "Audit it and add to ALLOW in scripts/check-trusted-deps.mjs, or remove it."
      );
    }
  }
}

if (violations.length) {
  console.error(
    `\n✗ ${violations.length} unreviewed trusted-dependency grant(s):\n`
  );
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  process.exit(1);
}

console.log(
  "✓ No unreviewed trustedDependencies — dependency install scripts stay blocked."
);
