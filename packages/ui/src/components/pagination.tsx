import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";

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
 * Pass `isActive` on {@link PaginationLink} to mark the current page
 * (`aria-current="page"` is set automatically).
 * The `text` label on {@link PaginationPrevious} and
 * {@link PaginationNext} is hidden on small viewports (`sm:block`).
 *
 * @example
 * ```tsx
 * <Pagination>
 *   <PaginationContent>
 *     <PaginationItem>
 *       <PaginationPrevious href="/page/1" />
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="/page/1">1</PaginationLink>
 *     </PaginationItem>
 *     <PaginationItem>
 *       <PaginationLink href="/page/2" isActive>2</PaginationLink>
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
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      data-slot="pagination"
      {...props}
    />
  );
}

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

/** List item wrapper for a single {@link PaginationLink} or control. */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

/**
 * Individual page link inside a {@link PaginationItem}.
 *
 * Renders as a {@link Button} whose underlying element is an `<a>` tag.
 * When `isActive` is true the link receives `aria-current="page"` and
 * switches to the `outline` variant for visual emphasis.
 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      className={cn(className)}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-active={isActive}
          data-slot="pagination-link"
          {...props}
        />
      }
      size={size}
      variant={isActive ? "outline" : "ghost"}
    />
  );
}

/**
 * Convenience {@link PaginationLink} wired up for "go to previous page".
 *
 * The `text` prop (default `"Previous"`) is only visible on `sm` and wider
 * viewports; on smaller screens only the arrow icon is shown.
 */
function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("pl-1.5!", className)}
      size="default"
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

/**
 * Convenience {@link PaginationLink} wired up for "go to next page".
 *
 * The `text` prop (default `"Next"`) is only visible on `sm` and wider
 * viewports; on smaller screens only the arrow icon is shown.
 */
function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("pr-1.5!", className)}
      size="default"
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
