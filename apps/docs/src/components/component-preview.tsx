import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { demoImports } from "@/src/registry/demos.generated";

const SEED_MARKER_RE = /^\/\/ generated seed.*\n/;

/** Strip the generated-seed marker so the displayed source reads cleanly. */
function cleanSource(source: string): string {
  return source.replace(SEED_MARKER_RE, "").trimStart();
}

/**
 * Renders a live demo (from `demos/<name>.tsx`) in a theme-aware canvas with a
 * Preview/Code tab pair. The Code tab shows the demo's real source, highlighted
 * by Fumadocs' Shiki pipeline with a built-in copy button.
 *
 * @param name demo path relative to `demos/`, without extension (e.g.
 *   `button/sizes`).
 */
export async function ComponentPreview({ name }: { name: string }) {
  const load = demoImports[name];
  if (!load) {
    return (
      <div className="rounded-lg border border-fd-border p-4 text-fd-muted-foreground text-sm">
        Demo <code>{name}</code> not found. Run{" "}
        <code>bun run docs:generate</code>.
      </div>
    );
  }

  const Demo = (await load()).default;
  const source = cleanSource(
    readFileSync(join(process.cwd(), "demos", `${name}.tsx`), "utf8")
  );

  return (
    <Tabs className="my-4" items={["Preview", "Code"]}>
      <Tab value="Preview">
        <div className="flex min-h-48 w-full items-center justify-center rounded-lg border border-fd-border bg-fd-card p-8">
          <Demo />
        </div>
      </Tab>
      <Tab className="p-0" value="Code">
        <DynamicCodeBlock code={source} lang="tsx" />
      </Tab>
    </Tabs>
  );
}
