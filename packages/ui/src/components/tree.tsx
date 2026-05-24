"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type React from "react";
import {
  Button,
  composeRenderProps,
  TreeItemContent,
  type TreeItemProps as TreeItemPropsRac,
  TreeItem as TreeItemRac,
  type TreeProps as TreePropsRac,
  Tree as TreeRac,
} from "react-aria-components";

export type { TreeProps } from "react-aria-components";

import { cn } from "../utils/index";

/**
 * A hierarchical tree view for displaying nested data with support for
 * keyboard navigation, single/multiple selection, and expand/collapse.
 *
 * @remarks
 * A thin, accessible wrapper around React Aria Components `Tree`. Adds
 * a `data-slot="tree"` attribute for slot-based styling, applies a
 * consistent Tailwind base, and forwards all `TreeProps<T>`. Compose
 * with {@link TreeItem} for the individual rows.
 *
 * The `aria-label` prop is **required** by ARIA spec for a tree widget
 * without an adjacent visible label element.
 *
 * @example
 * ```tsx
 * <Tree aria-label="Project files" selectionMode="single">
 *   <TreeItem id="src" title="src">
 *     <TreeItem id="app" title="app.tsx" />
 *   </TreeItem>
 *   <TreeItem id="readme" title="README.md" />
 * </Tree>
 * ```
 */
function Tree<T extends object>({
  className,
  children,
  ...props
}: TreePropsRac<T>) {
  return (
    <TreeRac
      className={composeRenderProps(className, (cls) =>
        cn(
          "flex flex-col gap-0.5 overflow-auto rounded-lg border border-input bg-background p-1 outline-hidden",
          cls
        )
      )}
      data-slot="tree"
      {...props}
    >
      {children}
    </TreeRac>
  );
}

/**
 * Props for the {@link TreeItem} component.
 *
 * @remarks
 * Extends all of the underlying RAC `TreeItemProps` (id, value,
 * isDisabled, onAction, …) with the visual props `title` and `icon`.
 * Nested `<TreeItem>` children are passed as `children`.
 */
export interface TreeItemProps<T extends object = object>
  extends Omit<TreeItemPropsRac<T>, "textValue" | "children"> {
  /** Nested `<TreeItem>` elements that form the item's children. */
  children?: React.ReactNode;
  /**
   * Optional leading icon rendered before the label.
   *
   * Accepts any `IconSvgElement` from `@hugeicons/core-free-icons`.
   *
   * @example
   * ```tsx
   * import { Folder01Icon } from "@hugeicons/core-free-icons";
   * <TreeItem title="Documents" icon={Folder01Icon} />
   * ```
   */
  icon?: IconSvgElement;
  /**
   * Typeahead / accessibility string for the row.
   *
   * Defaults to `title` when `title` is a plain string. Provide
   * explicitly when `title` is a non-string React node.
   */
  textValue?: string;
  /** The visible label for the row. */
  title: React.ReactNode;
}

/**
 * A single row inside a {@link Tree}, optionally containing child rows.
 *
 * @remarks
 * Wraps RAC `TreeItem` + `TreeItemContent`. The expand/collapse
 * chevron is rendered as a `Button slot="chevron"` (RAC wires it to
 * the item's toggle handler). Indentation is driven by the `level`
 * render prop so deeply nested trees align automatically.
 *
 * State-based styles (hover, selected, focus ring, disabled opacity)
 * are applied via Tailwind arbitrary data-attribute selectors on the
 * inner row `<div>`.
 *
 * @example
 * ```tsx
 * <Tree aria-label="Files">
 *   <TreeItem id="docs" title="Documents">
 *     <TreeItem id="resume" title="resume.pdf" />
 *   </TreeItem>
 * </Tree>
 * ```
 */
function TreeItem<T extends object = object>({
  title,
  icon,
  textValue,
  className,
  children,
  ...props
}: TreeItemProps<T>) {
  const resolvedTextValue =
    typeof title === "string" ? title : (textValue ?? "");

  return (
    <TreeItemRac
      className={composeRenderProps(className, (cls) =>
        cn("outline-hidden", cls)
      )}
      data-slot="tree-item"
      textValue={resolvedTextValue}
      {...props}
    >
      <TreeItemContent>
        {({
          level,
          hasChildItems,
          isExpanded,
          isSelected,
          isFocusVisible,
          isDisabled,
        }) => {
          const chevronClass = cn(
            "flex size-4 items-center justify-center rounded-sm text-muted-foreground outline-hidden transition-transform",
            isExpanded && "rotate-90"
          );

          const rowClass = cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-foreground text-sm transition-colors",
            "data-[hovered]:bg-accent data-[selected]:bg-accent",
            "data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/50",
            isSelected && "bg-accent",
            isFocusVisible && "ring-2 ring-ring/50",
            isDisabled && "pointer-events-none opacity-50"
          );

          return (
            <div
              className={rowClass}
              style={{
                paddingInlineStart: `calc(${level - 1} * 1.25rem + 0.5rem)`,
              }}
            >
              {hasChildItems ? (
                <Button className={chevronClass} slot="chevron">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              ) : (
                <span aria-hidden className="size-4 shrink-0" />
              )}
              {icon ? (
                <HugeiconsIcon
                  className="shrink-0 text-muted-foreground"
                  icon={icon}
                  size={16}
                />
              ) : null}
              <span className="truncate">{title}</span>
            </div>
          );
        }}
      </TreeItemContent>
      {children}
    </TreeItemRac>
  );
}

export { Tree, TreeItem };
