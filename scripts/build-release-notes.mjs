// scripts/build-release-notes.mjs
// Post-publish step for the release workflow: turn the freshly-written
// CHANGELOG.md into categorized notes and create the GitHub Release.
//
// Invoked by .github/workflows/release.yml only when changesets actually
// published, e.g.:
//
//   bun scripts/build-release-notes.mjs \
//     --published '${{ steps.changesets.outputs.publishedPackages }}' \
//     --repo "$GITHUB_REPOSITORY"
//
// `--published` is the JSON array changesets/action emits:
//   [{ "name": "@strait/ui", "version": "0.1.1" }]
//
// Use `--dry-run` to print the notes instead of calling `gh`.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

import { renderNotes } from "./release-notes.mjs";

const PACKAGE = "@strait/ui";
const CHANGELOG_PATH = "packages/ui/CHANGELOG.md";
const DOCS_URL = "https://strait-dev.github.io/ui";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

const dryRun = process.argv.includes("--dry-run");
const repo = arg("repo", process.env.GITHUB_REPOSITORY ?? "strait-dev/ui");

const publishedRaw = arg("published", "[]");
let published;
try {
  published = JSON.parse(publishedRaw);
} catch {
  console.error(`Could not parse --published JSON: ${publishedRaw}`);
  process.exit(1);
}

const entry = published.find((p) => p.name === PACKAGE);
if (!entry) {
  console.log(`No ${PACKAGE} in published packages — nothing to release.`);
  process.exit(0);
}

const { version } = entry;
const tag = `${PACKAGE}@${version}`;

if (!existsSync(CHANGELOG_PATH)) {
  console.error(`Missing ${CHANGELOG_PATH}; cannot build release notes.`);
  process.exit(1);
}
const changelog = readFileSync(CHANGELOG_PATH, "utf8");

/** Previous published tag (highest version below the current one), or undefined. */
function previousTag() {
  let tags = [];
  try {
    tags = execFileSync("git", ["tag", "--list", `${PACKAGE}@*`], {
      encoding: "utf8",
    })
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
  } catch {
    return;
  }
  const toParts = (t) =>
    t
      .slice(`${PACKAGE}@`.length)
      .split(".")
      .map((n) => Number.parseInt(n, 10));
  const cmp = (a, b) => {
    const pa = toParts(a);
    const pb = toParts(b);
    for (let i = 0; i < 3; i++) {
      if ((pa[i] ?? 0) !== (pb[i] ?? 0)) {
        return (pa[i] ?? 0) - (pb[i] ?? 0);
      }
    }
    return 0;
  };
  const older = tags.filter((t) => cmp(t, tag) < 0).sort(cmp);
  return older.at(-1);
}

const notes = renderNotes({
  changelog,
  version,
  repo,
  tag,
  prevTag: previousTag(),
  docsUrl: DOCS_URL,
  installName: PACKAGE,
});

if (dryRun) {
  console.log(notes);
  process.exit(0);
}

execFileSync(
  "gh",
  [
    "release",
    "create",
    tag,
    "--repo",
    repo,
    "--title",
    `${PACKAGE} ${version}`,
    "--notes",
    notes,
    "--verify-tag",
  ],
  { stdio: "inherit" }
);

console.log(`Created GitHub Release ${tag}.`);
