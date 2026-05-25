// scripts/release-notes.test.mjs
// Unit tests for the release-notes re-bucketing module. Run with `node --test`.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  bucketize,
  classifyEntry,
  extractSection,
  parseEntries,
  renderNotes,
} from "./release-notes.mjs";

// A realistic Changesets + changelog-github CHANGELOG.md.
const CHANGELOG = `# @strait/ui

## 0.2.0

### Minor Changes

- [#12](https://github.com/strait-dev/ui/pull/12) [\`abc1234\`](https://github.com/strait-dev/ui/commit/abc1234) Thanks [@leo](https://github.com/leo)! - feat: add Sidebar collapse mode

### Patch Changes

- [#13](https://github.com/strait-dev/ui/pull/13) [\`def5678\`](https://github.com/strait-dev/ui/commit/def5678) Thanks [@leo](https://github.com/leo)! - fix(button): correct focus ring colour
- [#14](https://github.com/strait-dev/ui/pull/14) Thanks [@leo](https://github.com/leo)! - perf: memoize chart series
- chore: bump internal tokens

## 0.1.0

### Minor Changes

- first release
`;

test("extractSection returns the body for a version", () => {
  const section = extractSection(CHANGELOG, "0.2.0");
  assert.match(section, /add Sidebar collapse mode/);
  assert.match(section, /correct focus ring colour/);
  // Must stop before the previous version.
  assert.doesNotMatch(section, /first release/);
});

test("extractSection returns empty string for unknown version", () => {
  assert.equal(extractSection(CHANGELOG, "9.9.9"), "");
});

test("parseEntries drops ### subheadings and keeps bullets", () => {
  const entries = parseEntries(extractSection(CHANGELOG, "0.2.0"));
  assert.equal(entries.length, 4);
  assert.ok(entries.every((e) => e.startsWith("- ")));
  assert.ok(!entries.some((e) => e.includes("Changes")));
});

test("parseEntries keeps indented continuation lines with their bullet", () => {
  const body = "- feat: thing\n  more detail\n- fix: other";
  const entries = parseEntries(body);
  assert.equal(entries.length, 2);
  assert.equal(entries[0], "- feat: thing\n  more detail");
});

test("classifyEntry buckets by conventional type and strips the prefix", () => {
  assert.deepEqual(classifyEntry("- feat: add thing"), {
    bucket: "features",
    text: "- add thing",
  });
  assert.deepEqual(classifyEntry("- fix(button): focus"), {
    bucket: "fixes",
    text: "- focus",
  });
  assert.deepEqual(classifyEntry("- perf!: speed"), {
    bucket: "perf",
    text: "- speed",
  });
  assert.equal(classifyEntry("- chore: bump").bucket, "other");
  assert.equal(classifyEntry("- no prefix here").bucket, "other");
});

test("classifyEntry finds the prefix after changelog-github metadata", () => {
  const line =
    "- [#13](https://github.com/strait-dev/ui/pull/13) [`def5678`](https://github.com/strait-dev/ui/commit/def5678) Thanks [@leo](https://github.com/leo)! - fix(button): correct focus ring colour";
  const { bucket, text } = classifyEntry(line);
  assert.equal(bucket, "fixes");
  assert.match(text, /correct focus ring colour$/);
  // Links and thanks are preserved; only the type prefix is removed.
  assert.match(text, /#13/);
  assert.match(text, /Thanks \[@leo\]/);
  assert.doesNotMatch(text, /fix\(button\):/);
});

test("bucketize groups all entries", () => {
  const buckets = bucketize(parseEntries(extractSection(CHANGELOG, "0.2.0")));
  assert.equal(buckets.features.length, 1);
  assert.equal(buckets.fixes.length, 1);
  assert.equal(buckets.perf.length, 1);
  assert.equal(buckets.other.length, 1);
});

test("renderNotes emits ordered sections, install snippet, and compare link", () => {
  const notes = renderNotes({
    changelog: CHANGELOG,
    version: "0.2.0",
    repo: "strait-dev/ui",
    tag: "@strait/ui@0.2.0",
    prevTag: "@strait/ui@0.1.0",
    docsUrl: "https://strait-dev.github.io/ui",
  });

  // Section order: Features before Bug Fixes before Performance before Other.
  const iFeat = notes.indexOf("🚀 Features");
  const iFix = notes.indexOf("🐛 Bug Fixes");
  const iPerf = notes.indexOf("⚡ Performance");
  const iOther = notes.indexOf("🧹 Other Changes");
  assert.ok(iFeat > -1 && iFix > iFeat && iPerf > iFix && iOther > iPerf);

  assert.match(notes, /bun add @strait\/ui@0\.2\.0/);
  assert.match(
    notes,
    /\[Documentation\]\(https:\/\/strait-dev\.github\.io\/ui\)/
  );
  assert.match(notes, /compare\/@strait\/ui@0\.1\.0\.\.\.@strait\/ui@0\.2\.0/);
});

test("renderNotes omits empty sections and the compare link without a prevTag", () => {
  const changelog =
    "# @strait/ui\n\n## 1.0.0\n\n### Patch Changes\n\n- fix: only a fix\n";
  const notes = renderNotes({
    changelog,
    version: "1.0.0",
    repo: "strait-dev/ui",
    tag: "@strait/ui@1.0.0",
  });
  assert.match(notes, /🐛 Bug Fixes/);
  assert.doesNotMatch(notes, /🚀 Features/);
  assert.doesNotMatch(notes, /Full Changelog/);
  assert.match(notes, /bun add @strait\/ui@1\.0\.0/);
});

test("renderNotes falls back to a maintenance message when nothing parses", () => {
  const changelog = "# @strait/ui\n\n## 2.0.0\n\n### Patch Changes\n\n";
  const notes = renderNotes({
    changelog,
    version: "2.0.0",
    repo: "strait-dev/ui",
    tag: "@strait/ui@2.0.0",
  });
  assert.match(notes, /Maintenance release/);
});
