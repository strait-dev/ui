import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// Size axis
// ---------------------------------------------------------------------------

/**
 * The three size steps available on the `Breadcrumb` root.
 *
 * - `sm`  — compact text (`text-xs`) with tighter gap (`gap-1`).
 * - `default` — the original look (`text-sm`, `gap-1.5`).
 * - `lg`  — larger text (`text-base`) with a wider gap (`gap-2`).
 */
type BreadcrumbSize = "sm" | "default" | "lg";

// ---------------------------------------------------------------------------
// Breadcrumb (root)
// ---------------------------------------------------------------------------

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
 * **Size axis** — pass `size` (`sm | default | lg`) on the root to scale
 * text size and gap uniformly across all descendant parts via a
 * `data-size` attribute that child parts read with
 * `group-data-[size=…]` selectors.
 *
 * **Default separator** — pass `separator` as a React node to use the same
 * separator for every position without manually placing
 * `<BreadcrumbSeparator>` between each item.  Per-item separators
 * (explicit `<BreadcrumbSeparator>`) always take precedence.
 *
 * @example
 * ```tsx
 * // Compact breadcrumb with a slash separator for every crumb.
 * <Breadcrumb size="sm" separator={<span>/</span>}>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Components</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
function Breadcrumb({
  className,
  size = "default",
  separator,
  ...props
}: React.ComponentProps<"nav"> & {
  /** Controls text size and gap across all descendant breadcrumb parts. */
  size?: BreadcrumbSize;
  /**
   * Default separator node rendered between every {@link BreadcrumbItem}
   * when the caller omits explicit `<BreadcrumbSeparator>` elements.
   * Forwarded via React context so each `BreadcrumbSeparator` can
   * fall back to it.
   */
  separator?: React.ReactNode;
}) {
  return (
    <BreadcrumbSeparatorContext.Provider value={separator}>
      <nav
        aria-label="breadcrumb"
        className={cn(className)}
        data-size={size}
        data-slot="breadcrumb"
        {...props}
      />
    </BreadcrumbSeparatorContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Context — propagates the root `separator` prop down to BreadcrumbSeparator
// ---------------------------------------------------------------------------

const BreadcrumbSeparatorContext = React.createContext<
  React.ReactNode | undefined
>(undefined);

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

/**
 * Ordered list that lays out {@link BreadcrumbItem} elements in a wrapping
 * flex row with muted text styling.
 *
 * Reads the `data-size` set by the parent `Breadcrumb` root via
 * `group-data-[size=…]` selectors to apply the matching text-size and gap.
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        // Base (default size)
        "wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm",
        // sm override — read from the nav ancestor's data-size
        "in-data-[size=sm]:gap-1 in-data-[size=sm]:text-xs",
        // lg override
        "in-data-[size=lg]:gap-2 in-data-[size=lg]:text-base",
        className
      )}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbItem
// ---------------------------------------------------------------------------

/**
 * Single list item inside a {@link BreadcrumbList}; wraps a
 * {@link BreadcrumbLink} or {@link BreadcrumbPage} together with any
 * adjacent {@link BreadcrumbSeparator}.
 *
 * Gap between the link/page text and an inline separator is also scaled
 * by the ancestor `data-size` via `in-data-[size=…]` selectors.
 */
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "inline-flex items-center gap-1",
        "in-data-[size=sm]:gap-0.5",
        "in-data-[size=lg]:gap-1.5",
        className
      )}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbLink
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// BreadcrumbPage
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// BreadcrumbSeparator
// ---------------------------------------------------------------------------

/**
 * Decorative divider placed between {@link BreadcrumbItem} elements.
 *
 * Resolution order for the rendered separator content:
 * 1. Explicit `children` prop on this instance.
 * 2. The `separator` prop passed to the root {@link Breadcrumb} (propagated
 *    via React context).
 * 3. The default arrow icon.
 *
 * Hidden from assistive technology via `aria-hidden`.
 */
function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  const contextSeparator = React.useContext(BreadcrumbSeparatorContext);
  const content = children ?? contextSeparator ?? (
    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
  );

  return (
    <li
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {content}
    </li>
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbEllipsis
// ---------------------------------------------------------------------------

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
