import type { source } from "@/lib/source";

type Page = NonNullable<ReturnType<typeof source.getPage>>;

/** Render a docs page as standalone Markdown for LLM consumption. */
export async function getLLMText(page: Page) {
  const processed = await page.data.getText("processed");
  return `# ${page.data.title} (${page.url})

${page.data.description ?? ""}

${processed}`;
}
