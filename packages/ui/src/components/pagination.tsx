"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";

// ---------------------------------------------------------------------------
// Size axis
// ---------------------------------------------------------------------------

/**
 * The three size steps available on the `Pagination` root.
 *
 * - `sm`  — maps icon buttons to `icon-sm` (28 px square).
 * - `default` — the original look; icon buttons use `icon` (32 px square).
 * - `lg`  — maps icon buttons to `icon-lg` (36 px square).
 *
 * `PaginationPrevious` and `PaginationNext` follow the same steps but use
 * the non-icon sizes `sm`, `default`, and `lg` respectively so they keep
 * their text labels.
 */
type PaginationSize = "sm" | "default" | "lg";

// ---------------------------------------------------------------------------
// Context — propagates size from root to every link/control
// ---------------------------------------------------------------------------

const PaginationSizeContext = React.createContext<PaginationSize>("default");

// ---------------------------------------------------------------------------
// Pagination (root)
// ---------------------------------------------------------------------------

/** Props for {@link Pagination}. */
export type PaginationProps = React.ComponentProps<"nav"> & {
  /** Scales all page-button controls uniformly. */
  size?: PaginationSize;
};

/**
 * Accessible navigation landmark for moving between pages of content.
 *
 * Compose with its sub-parts: a {@link PaginationContent} list holding
 * {@link PaginationItem} wrappers that each contain a
 * {@link PaginationLink}, {@link PaginationPrevious},
 * {@link PaginationNext}, or {@link PaginationEllipsis}.
 *
 * @remarks
 * The root renders a `<nav>` with `aria-label="pagination"` so screen
 * readers announce the landmark. {@link PaginationLink} delegates to
 * {@link Button} (via its `render` prop) so every page control inherits
 * the full button styling system while keeping the correct `<a>` semantics
 * for keyboard navigation.
 * Pass `active` on {@link PaginationLink} to mark the current page
 * (`aria-current="page"` is set automatically).
 * The `text` label on {@link PaginationPrevious} and
 * {@link PaginationNext} is hidden on small viewports (`sm:block`).
 *
 * **Size axis** — pass `size` (`sm | default | lg`) to scale page buttons
 * uniformly. The value propagates via React context so every descendant
 * link/control automatically uses the matching button size.
 *
 * @example
 * ```tsx
 * <Pagination size="sm">
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="/page/1" />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="/page/1">1</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="/page/2" active>2</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationEllipsis />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationNext href="/page/3" />
 *     </PaginationItem>
 *   </PaginationContent>
 * </Pagination>
 * ```
 */
function Pagination({
  className,
  size = "default",
  ...props
}: PaginationProps) {
  return (
    <PaginationSizeContext.Provider value={size}>
      <nav
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        data-size={size}
        data-slot="pagination"
        {...props}
      />
    </PaginationSizeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// PaginationContent
// ---------------------------------------------------------------------------

/** Flex list that holds {@link PaginationItem} controls. */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex items-center gap-0.5", className)}
      data-slot="pagination-content"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// PaginationItem
// ---------------------------------------------------------------------------

/** List item wrapper for a single {@link PaginationLink} or control. */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

// ---------------------------------------------------------------------------
// PaginationLink
// ---------------------------------------------------------------------------

type PaginationLinkProps = {
  active?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

/**
 * Individual page link inside a {@link PaginationItem}.
 *
 * Renders as a {@link Button} whose underlying element is an `<a>` tag.
 * When `active` is true the link receives `aria-current="page"` and
 * switches to the `outline` variant for visual emphasis.
 *
 * @remarks
 * When an explicit `size` prop is omitted the component reads the nearest
 * {@link Pagination} root's size via context and maps it to the appropriate
 * `icon-*` button size:
 *
 * | Pagination size | Button icon size |
 * |-----------------|-----------------|
 * | `sm`            | `icon-sm`        |
 * | `default`       | `icon`           |
 * | `lg`            | `icon-lg`        |
 */
function PaginationLink({
  className,
  active,
  size,
  ...props
}: PaginationLinkProps) {
  const ctxSize = React.useContext(PaginationSizeContext);

  /** Map the pagination size to a matching icon button size. */
  function iconSizeFromCtx(): React.ComponentProps<typeof Button>["size"] {
    if (ctxSize === "sm") {
      return "icon-sm";
    }
    if (ctxSize === "lg") {
      return "icon-lg";
    }
    return "icon";
  }
  const resolvedSize: React.ComponentProps<typeof Button>["size"] =
    size ?? iconSizeFromCtx();

  return (
    <Button
      className={cn(className)}
      nativeButton={false}
      render={
        <a
          aria-current={active ? "page" : undefined}
          data-active={active}
          data-slot="pagination-link"
          {...props}
        />
      }
      size={resolvedSize}
      variant={active ? "outline" : "ghost"}
    />
  );
}

// ---------------------------------------------------------------------------
// PaginationPrevious
// ---------------------------------------------------------------------------

/**
 * Convenience {@link PaginationLink} wired up for "go to previous page".
 *
 * The `text` prop (default `"Previous"`) is only visible on `sm` and wider
 * viewports; on smaller screens only the arrow icon is shown.
 *
 * @remarks
 * The button size follows the parent {@link Pagination} size context using
 * the non-icon size steps (`sm`, `default`, `lg`) so the text label can
 * sit beside the arrow.
 */
function PaginationPrevious({
  className,
  text = "Previous",
  size,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  const ctxSize = React.useContext(PaginationSizeContext);

  /** Map pagination size to the matching non-icon button size. */
  function textSizeFromCtx(): React.ComponentProps<typeof Button>["size"] {
    if (ctxSize === "sm") {
      return "sm";
    }
    if (ctxSize === "lg") {
      return "lg";
    }
    return "default";
  }
  const resolvedSize: React.ComponentProps<typeof Button>["size"] =
    size ?? textSizeFromCtx();

  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("pl-1.5!", className)}
      size={resolvedSize}
      {...props}
    >
      <HugeiconsIcon
        data-icon="inline-start"
        icon={ArrowLeft01Icon}
        strokeWidth={2}
      />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  );
}

// ---------------------------------------------------------------------------
// PaginationNext
// ---------------------------------------------------------------------------

/**
 * Convenience {@link PaginationLink} wired up for "go to next page".
 *
 * The `text` prop (default `"Next"`) is only visible on `sm` and wider
 * viewports; on smaller screens only the arrow icon is shown.
 *
 * @remarks
 * The button size follows the parent {@link Pagination} size context using
 * the non-icon size steps (`sm`, `default`, `lg`) so the text label can
 * sit beside the arrow.
 */
function PaginationNext({
  className,
  text = "Next",
  size,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  const ctxSize = React.useContext(PaginationSizeContext);

  /** Map pagination size to the matching non-icon button size. */
  function textSizeFromCtx(): React.ComponentProps<typeof Button>["size"] {
    if (ctxSize === "sm") {
      return "sm";
    }
    if (ctxSize === "lg") {
      return "lg";
    }
    return "default";
  }
  const resolvedSize: React.ComponentProps<typeof Button>["size"] =
    size ?? textSizeFromCtx();

  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("pr-1.5!", className)}
      size={resolvedSize}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <HugeiconsIcon
        data-icon="inline-end"
        icon={ArrowRight01Icon}
        strokeWidth={2}
      />
    </PaginationLink>
  );
}

// ---------------------------------------------------------------------------
// PaginationEllipsis
// ---------------------------------------------------------------------------

/**
 * Non-interactive placeholder indicating skipped page numbers in a
 * {@link Pagination}. Includes an `sr-only` "More pages" label for
 * screen readers.
 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        "in-data-[size=sm]:size-7",
        "in-data-[size=lg]:size-9",
        className
      )}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
