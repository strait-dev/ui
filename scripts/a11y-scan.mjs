// Comprehensive axe-core a11y scan across Storybook stories.
// Scans one representative story per component (first story of each title),
// injects axe-core into each story iframe, collects serious+critical violations,
// and writes a deduped report to scripts/a11y-report.json.
//
// Usage: node scripts/a11y-scan.mjs [--all] [--ids id1,id2]
//   --all      scan every story (default: one per component title)
//   --ids ...  scan only the given comma-separated story ids
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const BASE = process.env.STORYBOOK_URL || "http://localhost:6006";
const AXE_PATH =
  "node_modules/.bun/axe-core@4.11.4/node_modules/axe-core/axe.min.js";
const AXE_SRC = readFileSync(AXE_PATH, "utf8");

const args = process.argv.slice(2);
const scanAll = args.includes("--all");
const idsArg = args.includes("--ids") ? args[args.indexOf("--ids") + 1] : null;
const theme = args.includes("--theme")
  ? args[args.indexOf("--theme") + 1]
  : null;
const globalsParam = theme ? `&globals=theme:${theme}` : "";

const idx = await (await fetch(`${BASE}/index.json`)).json();
const stories = Object.values(idx.entries).filter((e) => e.type === "story");

let targets;
if (idsArg) {
  const wanted = new Set(idsArg.split(","));
  targets = stories.filter((s) => wanted.has(s.id));
} else if (scanAll) {
  targets = stories;
} else {
  // one story per component title
  const seen = new Set();
  targets = stories.filter((s) => {
    if (seen.has(s.title)) {
      return false;
    }
    seen.add(s.title);
    return true;
  });
}

console.log(
  `Scanning ${targets.length} stories against ${BASE}${theme ? ` (theme: ${theme})` : ""}`
);

const browser = await chromium.launch();

// Documented, deliberate a11y exceptions. Findings whose individual nodes match
// an entry here are dropped from the pass/fail set (and logged separately for
// transparency). Keep this list tiny and justified — every entry is a conscious
// trade-off, not a way to silence real issues.
const ALLOWLIST = [
  {
    rule: "color-contrast",
    // The brand-solid Button renders warm-white text on the #FF4F00 brand
    // colour (3.16:1, below WCAG AA). This is a deliberate brand-identity
    // decision; see packages/ui/src/globals.css (--brand-foreground note).
    // Axe sometimes truncates class names in both target and node HTML, so also
    // match the computed foreground/background pair reported by color-contrast.
    targetIncludes: "bg-brand",
    fgColor: "#fafaf9",
    bgColor: "#ff4f00",
    reason:
      "brand-solid: warm-white-on-#FF4F00 is a deliberate brand exception",
  },
];

function allowlistMatch(rule, node) {
  const target = (node?.target ?? []).join(" ");
  const html = node?.html ?? "";
  return ALLOWLIST.find((a) => {
    if (a.rule !== rule) {
      return false;
    }
    if (target.includes(a.targetIncludes) || html.includes(a.targetIncludes)) {
      return true;
    }
    const contrast = node?.any?.find((check) => check.id === "color-contrast");
    return (
      contrast?.data?.fgColor === a.fgColor &&
      contrast?.data?.bgColor === a.bgColor
    );
  });
}

const allowlisted = []; // {id, title, rule, reason, count}
const findings = []; // {id, title, rule, impact, count, sampleTarget, sampleHtml}

for (const s of targets) {
  const url = `${BASE}/iframe.html?id=${s.id}&viewMode=story${globalsParam}`;
  // Fresh page per story so axe state never bleeds across runs
  // ("Axe is already running" otherwise surfaces on slow-rendering stories).
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  try {
    await page.goto(url, { waitUntil: "load", timeout: 20_000 });
    // wait for the story root to have content or an error block
    await page
      .waitForFunction(
        () => {
          const root = document.querySelector("#storybook-root");
          const err = document.querySelector(".sb-errordisplay");
          return (
            (root && root.children.length > 0 && root.textContent.trim()) || err
          );
        },
        { timeout: 8000 }
      )
      .catch(() => {});
    // When scanning a non-default theme, wait until Storybook has actually
    // applied the theme class to <html> before measuring (otherwise axe reads
    // colours mid-transition and reports false contrast failures).
    if (theme === "dark") {
      await page
        .waitForFunction(
          () => document.documentElement.classList.contains("dark"),
          { timeout: 5000 }
        )
        .catch(() => {});
    }
    await page.waitForTimeout(theme ? 700 : 250);
    await page.evaluate(AXE_SRC);
    const results = await page.evaluate(async () => {
      const opts = {
        resultTypes: ["violations"],
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
      };
      // Storybook's addon-a11y runs axe automatically; retry until its run
      // finishes so we don't collide with "Axe is already running".
      for (let i = 0; i < 15; i++) {
        try {
          // @ts-expect-error
          return await window.axe.run(document, opts);
        } catch (err) {
          if (String(err?.message ?? err).includes("already running")) {
            await new Promise((r) => setTimeout(r, 300));
            continue;
          }
          throw err;
        }
      }
      throw new Error("axe stayed busy after retries");
    });
    for (const v of results.violations) {
      if (v.impact !== "serious" && v.impact !== "critical") {
        continue;
      }
      // Drop only the individual nodes covered by a documented exception, so
      // every other node of the same rule still fails the build.
      const exempt = [];
      const nodes = v.nodes.filter((n) => {
        const hit = allowlistMatch(v.id, n);
        if (hit) {
          exempt.push(hit);
          return false;
        }
        return true;
      });
      if (exempt.length > 0) {
        allowlisted.push({
          id: s.id,
          title: s.title,
          rule: v.id,
          reason: exempt[0].reason,
          count: exempt.length,
        });
      }
      if (nodes.length === 0) {
        continue;
      }
      const node = nodes[0];
      findings.push({
        id: s.id,
        title: s.title,
        rule: v.id,
        impact: v.impact,
        count: nodes.length,
        sampleTarget: node?.target?.join(" ") ?? "",
        sampleHtml: (node?.html ?? "").slice(0, 160),
        message: node?.failureSummary?.split("\n").slice(0, 2).join(" ") ?? "",
      });
    }
  } catch (e) {
    findings.push({
      id: s.id,
      title: s.title,
      rule: "__scan_error__",
      impact: "error",
      count: 0,
      sampleTarget: "",
      sampleHtml: "",
      message: String(e.message).split("\n")[0],
    });
  } finally {
    await page.close();
  }
}

await browser.close();

writeFileSync("scripts/a11y-report.json", JSON.stringify(findings, null, 2));

// Summary by rule
const byRule = {};
for (const f of findings) {
  byRule[f.rule] = byRule[f.rule] || { count: 0, nodes: 0, stories: new Set() };
  byRule[f.rule].count++;
  byRule[f.rule].nodes += f.count;
  byRule[f.rule].stories.add(f.title);
}
console.log("\n=== Violations by rule (serious/critical) ===");
const rows = Object.entries(byRule).sort((a, b) => b[1].nodes - a[1].nodes);
if (rows.length === 0) {
  console.log("None! 🎉");
}
for (const [rule, info] of rows) {
  console.log(
    `${rule}: ${info.nodes} nodes across ${info.stories.size} components`
  );
  for (const t of [...info.stories].slice(0, 12)) {
    console.log(`    - ${t}`);
  }
}
if (allowlisted.length > 0) {
  console.log("\n=== Allowlisted (documented exceptions, not counted) ===");
  for (const a of allowlisted) {
    console.log(`${a.rule} on ${a.title} (${a.count}) — ${a.reason}`);
  }
}

console.log(
  `\nFull report: scripts/a11y-report.json (${findings.length} findings)`
);
