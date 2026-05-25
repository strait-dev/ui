// scripts/check-changeset-format.mjs
// Enforces that every changeset summary starts with a Conventional-Commit type
// prefix (`feat:`, `fix(scope):`, `perf!:`, …). The release-notes generator
// (scripts/release-notes.mjs) buckets entries by this prefix, so a missing or
// unknown prefix would silently land the change under "Other" in the GitHub
// Release. Catching it here keeps release notes meaningful.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CHANGESET_DIR = ".changeset";
const TYPES = [
  "feat",
  "fix",
  "perf",
  "refactor",
  "docs",
  "chore",
  "test",
  "build",
  "ci",
  "style",
  "revert",
];
const PREFIX_RE = new RegExp(`^(${TYPES.join("|")})(?:\\([^)]*\\))?!?:\\s+\\S`);

/** The summary is everything after the second `---` frontmatter fence. */
function summaryOf(contents) {
  const parts = contents.split(/^---\s*$/m);
  // ["", frontmatter, summary...]; rejoin in case the summary contained ---.
  return parts.slice(2).join("---").trim();
}

const files = readdirSync(CHANGESET_DIR).filter(
  (f) => f.endsWith(".md") && f !== "README.md"
);

const violations = [];
for (const file of files) {
  const summary = summaryOf(readFileSync(join(CHANGESET_DIR, file), "utf8"));
  const firstLine = summary.split("\n")[0]?.trim() ?? "";
  if (firstLine === "") {
    violations.push(`${file}: empty summary`);
  } else if (!PREFIX_RE.test(firstLine)) {
    violations.push(
      `${file}: summary must start with a type prefix (e.g. "fix: …"); got "${firstLine}"`
    );
  }
}

if (violations.length > 0) {
  console.error(`\n✗ ${violations.length} changeset(s) with a bad summary:\n`);
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  console.error(`\n  Allowed types: ${TYPES.join(", ")}`);
  process.exit(1);
}

console.log(
  `✓ ${files.length} changeset(s) start with a Conventional-Commit prefix.`
);
