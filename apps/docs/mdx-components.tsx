import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "@/src/components/component-preview";
import {
  ColorSwatches,
  IconGallery,
  RadiusScale,
  ShadowScale,
  SpacingScale,
  TypeScale,
} from "@/src/components/foundations";
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
    ColorSwatches,
    ComponentPreview,
    IconGallery,
    PropsTable,
    RadiusScale,
    ShadowScale,
    SpacingScale,
    Tab,
    Tabs,
    ThemeExplorer,
    TypeScale,
    ...components,
  };
}
