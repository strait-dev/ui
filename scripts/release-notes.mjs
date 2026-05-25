// scripts/release-notes.mjs
// Pure helpers that turn a Changesets `CHANGELOG.md` version section into
// categorized GitHub Release notes (Features / Bug Fixes / Performance / Other).
//
// Changesets bakes its own `### Major/Minor/Patch Changes` subheadings into the
// changelog and groups by semver bump, which is not how humans read release
// notes. We instead re-bucket each entry by its Conventional-Commit prefix
// (`feat:` / `fix:` / `perf:` / …) — the prefix our changeset-format check
// enforces — and emit emoji-headed sections plus an install + compare footer.
//
// Everything here is side-effect-free and unit-tested in release-notes.test.mjs;
// the I/O wiring (reading CHANGELOG.md, calling `gh`) lives in
// build-release-notes.mjs.

/** Conventional-Commit types that get their own section; the rest fall to Other. */
const TYPE_TO_BUCKET = {
  feat: "features",
  fix: "fixes",
  perf: "perf",
};

/** Section order + titles for the rendered notes. */
const BUCKETS = [
  ["features", "## 🚀 Features"],
  ["fixes", "## 🐛 Bug Fixes"],
  ["perf", "## ⚡ Performance"],
  ["other", "## 🧹 Other Changes"],
];

/**
 * Matches a Conventional-Commit prefix (`type(scope)!: `) anywhere in a line.
 * With `@changesets/changelog-github` the summary trails the PR/commit/author
 * metadata, so we scan the whole entry. None of the recognised type tokens
 * appear before a colon inside that metadata (URLs use `https:`, not a type),
 * so the first match is always the real summary prefix.
 */
const TYPE_RE =
  /\b(feat|fix|perf|refactor|docs|chore|test|build|ci|style|revert)(?:\([^)]*\))?!?:\s+/;

/**
 * Extract the body of the `## <version>` section from a CHANGELOG.md string.
 * Returns the trimmed lines between the version heading and the next version
 * heading (or end of file), or `""` when the version is not present.
 */
export function extractSection(changelog, version) {
  const lines = changelog.split("\n");
  const start = lines.findIndex((l) => l.trim() === `## ${version}`);
  if (start === -1) {
    return "";
  }
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines
    .slice(start + 1, end)
    .join("\n")
    .trim();
}

/**
 * Split a section body into entries. Each entry is a top-level `- ` bullet plus
 * any indented continuation lines. Changesets `### …` subheadings are dropped.
 */
export function parseEntries(sectionBody) {
  const entries = [];
  let current = null;
  for (const line of sectionBody.split("\n")) {
    if (/^#{2,}\s/.test(line)) {
      continue; // "### Patch Changes" and friends
    }
    if (/^- /.test(line)) {
      if (current !== null) {
        entries.push(current);
      }
      current = line;
    } else if (current !== null && line.trim() !== "") {
      current += `\n${line}`;
    }
  }
  if (current !== null) {
    entries.push(current);
  }
  return entries;
}

/**
 * Classify a single entry by its Conventional-Commit prefix and strip that
 * prefix from the human-readable summary, preserving PR/commit/author links.
 */
export function classifyEntry(entry) {
  const match = entry.match(TYPE_RE);
  if (!match) {
    return { bucket: "other", text: entry };
  }
  const bucket = TYPE_TO_BUCKET[match[1]] ?? "other";
  return { bucket, text: entry.replace(TYPE_RE, "") };
}

/** Group entries into the four buckets, preserving original order within each. */
export function bucketize(entries) {
  const buckets = { features: [], fixes: [], perf: [], other: [] };
  for (const entry of entries) {
    const { bucket, text } = classifyEntry(entry);
    buckets[bucket].push(text);
  }
  return buckets;
}

/**
 * Render full GitHub Release notes for a published version.
 *
 * @param {object} opts
 * @param {string} opts.changelog   Full CHANGELOG.md contents.
 * @param {string} opts.version     Version being released, e.g. "0.1.1".
 * @param {string} opts.repo        "owner/name", e.g. "strait-dev/ui".
 * @param {string} opts.tag         Git tag of this release.
 * @param {string} [opts.prevTag]   Previous git tag, for the compare link.
 * @param {string} [opts.docsUrl]   Documentation URL appended to the footer.
 * @param {string} [opts.installName] Package name for the install snippet.
 * @returns {string} Markdown release-notes body.
 */
export function renderNotes({
  changelog,
  version,
  repo,
  tag,
  prevTag,
  docsUrl,
  installName = "@strait/ui",
}) {
  const buckets = bucketize(parseEntries(extractSection(changelog, version)));

  const sections = [];
  for (const [key, title] of BUCKETS) {
    if (buckets[key].length > 0) {
      sections.push(`${title}\n\n${buckets[key].join("\n")}`);
    }
  }
  const body =
    sections.length > 0 ? sections.join("\n\n") : "_Maintenance release._";

  const footer = [
    "## 📦 Install",
    "",
    "```sh",
    `bun add ${installName}@${version}`,
    "```",
  ];
  if (docsUrl) {
    footer.push("", `📚 [Documentation](${docsUrl})`);
  }
  if (prevTag) {
    footer.push(
      "",
      `**Full Changelog**: https://github.com/${repo}/compare/${prevTag}...${tag}`
    );
  }

  return `${body}\n\n${footer.join("\n")}\n`;
}
