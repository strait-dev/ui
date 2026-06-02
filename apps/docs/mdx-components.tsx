import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "@/src/components/component-preview";
import { PropsTable } from "@/src/components/props-table";

/**
 * Components available to every MDX page, including the Strait-specific blocks
 * `ComponentPreview` (live demo + code) and `PropsTable` (generated reference).
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ComponentPreview,
    PropsTable,
    ...components,
  };
}
