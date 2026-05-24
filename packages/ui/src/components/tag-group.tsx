"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import {
  Button,
  composeRenderProps,
  Label,
  type TagGroupProps as TagGroupPropsRac,
  TagGroup as TagGroupRac,
  type TagListProps as TagListPropsRac,
  TagList as TagListRac,
  type TagProps as TagPropsRac,
  Tag as TagRac,
} from "react-aria-components";
import { cn } from "../utils/index";

/* ------------------------------------------------------------------ */
/* tagVariants                                                         */
/* ------------------------------------------------------------------ */

/**
 * Class-variance-authority recipe for the {@link Tag} component.
 *
 * @remarks
 * Exposes one axis:
 * - `variant` — `default`, `secondary`, or `outline`.
 *
 * State classes are baked into the base string and applied via
 * React Aria data attributes (`data-selected`, `data-hovered`, etc.)
 * so they work in both controlled and uncontrolled modes.
 */
const tagVariants = cva(
  [
    "inline-flex cursor-default items-center gap-1 rounded-md border px-2 py-0.5 font-medium text-xs outline-hidden transition-colors",
    "data-hovered:bg-accent",
    "data-selected:border-transparent data-selected:bg-primary data-selected:text-primary-foreground",
    "data-focus-visible:ring-2 data-focus-visible:ring-ring/50",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        secondary: "border-transparent bg-muted text-muted-foreground",
        outline: "border-input bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* ------------------------------------------------------------------ */
/* TagGroup                                                            */
/* ------------------------------------------------------------------ */

/**
 * Props for the {@link TagGroup} wrapper.
 *
 * @remarks
 * Extends the React Aria `TagGroupProps` with an optional `label` for
 * rendering an accessible group heading via RAC's `Label` primitive.
 * The `className` prop is forwarded as a plain string (not a render-prop
 * function) because `TagGroupProps` is backed by `DOMProps`.
 */
interface TagGroupProps extends TagGroupPropsRac {
  /** Additional Tailwind classes merged onto the wrapper `<div>`. */
  className?: string;
  /**
   * Optional label text or element rendered above the tag list.
   *
   * Uses RAC's `Label` component so it is automatically associated with
   * the group for accessibility.
   */
  label?: React.ReactNode;
}

/**
 * An accessible group container for a set of selectable or removable tags.
 *
 * @remarks
 * Wraps React Aria Components `TagGroup`. The group supports single and
 * multiple selection via `selectionMode`, controlled selection via
 * `selectedKeys` / `onSelectionChange`, and removal via `onRemove`.
 *
 * Compose with {@link TagList} and {@link Tag}:
 *
 * ```tsx
 * <TagGroup label="Skills" selectionMode="multiple" onSelectionChange={setSelected}>
 *   <TagList>
 *     {skills.map(s => <Tag id={s} key={s} textValue={s}>{s}</Tag>)}
 *   </TagList>
 * </TagGroup>
 * ```
 *
 * @example
 * ```tsx
 * // Removable tags
 * <TagGroup label="Tags" onRemove={(keys) => remove(keys)}>
 *   <TagList items={tags}>
 *     {(tag) => <Tag id={tag.id} textValue={tag.name}>{tag.name}</Tag>}
 *   </TagList>
 * </TagGroup>
 * ```
 */
function TagGroup({ label, className, children, ...props }: TagGroupProps) {
  return (
    <TagGroupRac
      className={cn("flex flex-col gap-1", className)}
      data-slot="tag-group"
      {...props}
    >
      {label ? (
        <Label className="mb-1.5 block font-medium text-foreground text-sm">
          {label}
        </Label>
      ) : null}
      {children}
    </TagGroupRac>
  );
}

/* ------------------------------------------------------------------ */
/* TagList                                                             */
/* ------------------------------------------------------------------ */

/**
 * Props for the {@link TagList} wrapper.
 *
 * @remarks
 * Generic over `T` (the item type) so that `items` and the render-prop
 * children are strongly typed together. Accepts either:
 * - A static list of `<Tag>` children, or
 * - An `items` array plus a render function `(item: T) => ReactNode`.
 */
type TagListProps<T extends object> = TagListPropsRac<T>;

/**
 * A flex-wrapped container that renders a collection of {@link Tag} elements.
 *
 * @remarks
 * Wraps React Aria's `TagList`. Supports both static children and a
 * collection-based `items` + render-function pattern. The `className`
 * prop is composed via `composeRenderProps` so RAC state classes are
 * preserved.
 *
 * @example
 * ```tsx
 * // Static children
 * <TagList>
 *   <Tag id="react" textValue="React">React</Tag>
 *   <Tag id="ts" textValue="TypeScript">TypeScript</Tag>
 * </TagList>
 *
 * // Collection pattern
 * <TagList items={frameworks}>
 *   {(fw) => <Tag id={fw.id} textValue={fw.name}>{fw.name}</Tag>}
 * </TagList>
 * ```
 */
function TagList<T extends object>({
  className,
  children,
  ...props
}: TagListProps<T>) {
  return (
    <TagListRac
      className={composeRenderProps(className, (base) =>
        cn("flex flex-wrap gap-2", base)
      )}
      data-slot="tag-list"
      {...props}
    >
      {children}
    </TagListRac>
  );
}

/* ------------------------------------------------------------------ */
/* Tag                                                                 */
/* ------------------------------------------------------------------ */

/**
 * Props for the {@link Tag} component.
 *
 * @remarks
 * Extends `TagProps` from React Aria with `variant` from
 * {@link tagVariants} and a plain `className` string.
 */
interface TagProps extends TagPropsRac {
  /** Additional Tailwind classes merged onto the tag element. */
  className?: string;
  /** Visual style variant. Defaults to `"default"`. */
  variant?: VariantProps<typeof tagVariants>["variant"];
}

/**
 * An individual tag item rendered inside a {@link TagList}.
 *
 * @remarks
 * Wraps React Aria Components `Tag`. Styling is controlled by
 * {@link tagVariants} via the `variant` prop. State-based styles
 * (hover, selected, focused, disabled) are applied automatically via
 * RAC data attributes.
 *
 * When the parent {@link TagGroup} has an `onRemove` handler, a small
 * remove button ({@link Cancel01Icon}) is appended inside each tag.
 * The button uses RAC's `slot="remove"` so keyboard and pointer removal
 * work accessibly out of the box.
 *
 * Always provide `id` and `textValue` for accessibility and keyboard
 * navigation.
 *
 * @example
 * ```tsx
 * <Tag id="react" textValue="React">React</Tag>
 *
 * // Removable (parent must have onRemove)
 * <Tag id="react" textValue="React">React</Tag>
 * ```
 */
function Tag({ children, className, variant, ...props }: TagProps) {
  return (
    <TagRac
      className={composeRenderProps(className, (base) =>
        cn(tagVariants({ variant }), base)
      )}
      data-slot="tag"
      {...props}
    >
      {composeRenderProps(children, (resolvedChildren, { allowsRemoving }) => (
        <>
          {resolvedChildren}
          {allowsRemoving ? (
            <Button
              className="ml-0.5 inline-flex size-3.5 items-center justify-center rounded-sm opacity-60 outline-hidden hover:opacity-100 data-focus-visible:ring-2 data-focus-visible:ring-ring/50"
              slot="remove"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
            </Button>
          ) : null}
        </>
      ))}
    </TagRac>
  );
}

/* ------------------------------------------------------------------ */
/* Exports                                                             */
/* ------------------------------------------------------------------ */

export type { TagGroupProps, TagListProps, TagProps };
export { Tag, TagGroup, TagList, tagVariants };
