import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
  // Expose processed Markdown so pages can be served to LLMs via getLLMText.
  docs: {
    postprocess: { includeProcessedMarkdown: true },
  },
});

export default defineConfig();
