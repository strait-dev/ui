import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

/**
 * Components available to every MDX page. Strait-specific blocks
 * (`ComponentPreview`, `PropsTable`) are registered here in Phase 2.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
  };
}
