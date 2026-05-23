import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import { cn } from "../utils/index";

/**
 * Accessible navigation landmark that shows the user's location in the
 * site hierarchy.
 *
 * Compose with its sub-parts: wrap a {@link BreadcrumbList} containing
 * {@link BreadcrumbItem} elements, each holding either a
 * {@link BreadcrumbLink} (for navigable ancestors) or a
 * {@link BreadcrumbPage} (for the non-navigable current location).
 * Place a {@link BreadcrumbSeparator} between items, and optionally
 * a {@link BreadcrumbEllipsis} to collapse long trails.
 *
 * @remarks
 * The root renders a `<nav>` with `aria-label="breadcrumb"` so screen
 * readers announce the landmark correctly without any extra markup.
 * {@link BreadcrumbPage} marks the current location via `aria-current="page"`
 * and `aria-disabled="true"` so it is identified as the final crumb but
 * is intentionally non-interactive.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Components</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(className)}
      data-slot="breadcrumb"
      {...props}
    />
  );
}

/** Ordered list that lays out {@link BreadcrumbItem} elements in a wrapping
 *  flex row with muted text styling. */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm",
        className
      )}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
}

/**
 * Single list item inside a {@link BreadcrumbList}; wraps a
 * {@link BreadcrumbLink} or {@link BreadcrumbPage} together with any
 * adjacent {@link BreadcrumbSeparator}.
 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("inline-flex items-center gap-1", className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
}

/**
 * Navigable ancestor link inside a {@link BreadcrumbItem}.
 *
 * Uses Base UI's `useRender` so the underlying element can be swapped via the
 * `render` prop (e.g. a framework `<Link>`) without losing the hover styles.
 */
function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn("transition-colors hover:text-foreground", className),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  });
}

/**
 * Non-interactive indicator for the current page in a {@link Breadcrumb}.
 *
 * Carries `aria-current="page"` and `aria-disabled="true"` so assistive
 * technology identifies it as the current location without treating it as a
 * focusable link.
 */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: the current page is intentionally non-interactive (aria-disabled); role="link" + aria-current marks it as the current location for AT.
    // biome-ignore lint/a11y/useSemanticElements: a non-navigable current-page indicator is not an <a>; role="link" conveys it is the breadcrumb's link position without being focusable.
    <span
      aria-current="page"
      aria-disabled="true"
      className={cn("font-normal text-foreground", className)}
      data-slot="breadcrumb-page"
      role="link"
      {...props}
    />
  );
}

/**
 * Decorative divider placed between {@link BreadcrumbItem} elements.
 *
 * Defaults to an arrow icon; pass any `children` to substitute a custom
 * separator. Hidden from assistive technology via `aria-hidden`.
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {children ?? <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />}
    </li>
  );
}

/**
 * Visual placeholder used in place of collapsed middle crumbs in a
 * {@link Breadcrumb}. Renders a horizontal-dots icon with an
 * `sr-only` "More" label for screen readers.
 */
function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}
    >
      <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
