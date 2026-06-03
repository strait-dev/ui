// scripts/generate-changelog.ts
// Renders the published package CHANGELOG (owned by Changesets) into the docs
// changelog page, so the site's version history stays in lockstep with releases
// without hand-copying. The release history below the intro is generated.
//
// Run: `bun scripts/generate-changelog.ts` (idempotent); `--check` is the drift
// gate. Wired into `bun run docs:generate`.
import { readFileSync, writeFileSync } from "node:fs";

const SRC = "packages/ui/CHANGELOG.md";
const OUT = "apps/docs/content/docs/changelog.mdx";

// Hand-authored intro that sits above the generated release history.
const INTRO = `---
title: Changelog
description: Releases and version history for @strait/ui.
---

\`@strait/ui\` follows [semantic versioning](https://semver.org) and is released
with [Changesets](https://github.com/changesets/changesets). Every user-facing
change ships with a categorized release note.

## Where to find releases

- **[GitHub Releases](https://github.com/strait-dev/ui/releases)** — the
  canonical, categorized changelog for every published version, generated on
  each release.
- **[CHANGELOG.md](https://github.com/strait-dev/ui/blob/main/packages/ui/CHANGELOG.md)**
  — the full per-version history in the repository.
- **[npm](https://www.npmjs.com/package/@strait/ui)** — published versions and
  install metadata.

## Versioning policy

- **Patch** — bug fixes and internal changes with no API impact.
- **Minor** — new, backwards-compatible components and props.
- **Major** — breaking changes (prop renames, removed variants), always
  accompanied by a migration note in the release.

## Release history`;

const HEADING_RE = /^(#{1,5})\s/;
const FENCE_RE = /^\s*```/;
const INLINE_CODE_RE = /(`[^`]*`)/;
const LT_RE = /</g;
const BRACE_RE = /\{/g;
const LEADING_H1_RE = /^#\s.*\n/;

/**
 * Escape MDX-significant characters (`<`, `{`) that fall outside inline code
 * spans and fenced code blocks, and demote every heading one level so the
 * version history nests under the "Release history" section.
 */
function toMdxSafe(markdown: string): string {
  let inFence = false;
  return markdown
    .split("\n")
    .map((line) => {
      if (FENCE_RE.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) {
        return line;
      }
      const demoted = line.replace(HEADING_RE, (_m, hashes) => `${hashes}# `);
      return demoted
        .split(INLINE_CODE_RE)
        .map((part) =>
          part.startsWith("`")
            ? part
            : part.replace(LT_RE, "&lt;").replace(BRACE_RE, "&#123;")
        )
        .join("");
    })
    .join("\n");
}

const raw = readFileSync(SRC, "utf8").replace(LEADING_H1_RE, "").trim();
const out = `${INTRO}\n\n${toMdxSafe(raw)}\n`;

if (process.argv.includes("--check")) {
  let existing: string | null = null;
  try {
    existing = readFileSync(OUT, "utf8");
  } catch {
    existing = null;
  }
  if (existing !== out) {
    console.error(
      `✗ ${OUT} is out of date. Run \`bun run docs:generate\` and commit.`
    );
    process.exit(1);
  }
  console.log("✓ changelog.mdx is in sync with packages/ui/CHANGELOG.md.");
} else {
  writeFileSync(OUT, out);
  console.log(`✓ Generated ${OUT} from ${SRC}.`);
}
