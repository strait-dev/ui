import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "@/src/components/component-preview";
import { PropsTable } from "@/src/components/props-table";
import { ThemeExplorer } from "@/src/components/theme-explorer";

/**
 * Components available to every MDX page, including the Strait-specific blocks
 * `ComponentPreview` (live demo + code), `PropsTable` (generated reference), and
 * `ThemeExplorer` (interactive rebrand demo).
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ComponentPreview,
    PropsTable,
    ThemeExplorer,
    ...components,
  };
}
