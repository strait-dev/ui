import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/**
 * Centred placeholder surface shown when a list or view has no content.
 *
 * `Empty` is the root container. Compose it with {@link EmptyHeader}
 * (holding {@link EmptyMedia}, {@link EmptyTitle}, and
 * {@link EmptyDescription}) and an optional {@link EmptyContent} region for
 * call-to-action controls.
 *
 * @remarks
 * The root renders a dashed border by default, signalling the absence of
 * real content. It stretches to fill available space via `flex-1`.
 *
 * @example
 * ```tsx
 * <Empty>
 *   <EmptyHeader>
 *     <EmptyMedia variant="icon">
 *       <FolderIcon />
 *     </EmptyMedia>
 *     <EmptyTitle>No files yet</EmptyTitle>
 *     <EmptyDescription>
 *       Upload a file to get started.
 *     </EmptyDescription>
 *   </EmptyHeader>
 *   <EmptyContent>
 *     <Button>Upload</Button>
 *   </EmptyContent>
 * </Empty>
 * ```
 */
function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 text-balance rounded-xl border-dashed p-6 text-center",
        className
      )}
      data-slot="empty"
      {...props}
    />
  );
}

/** Centred column that stacks {@link EmptyMedia}, {@link EmptyTitle}, and
 * {@link EmptyDescription} inside an {@link Empty}. */
function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      data-slot="empty-header"
      {...props}
    />
  );
}

/**
 * Class-variance-authority recipe for {@link EmptyMedia}.
 *
 * Exposes one axis:
 * - `variant` — `"default"` is transparent and suits illustrations or
 *   custom imagery; `"icon"` wraps the child in a muted rounded square
 *   sized for a 16 × 16 SVG icon.
 */
const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Visual focal point at the top of an {@link EmptyHeader} — an illustration,
 * image, or icon container styled via {@link emptyMediaVariants}.
 */
function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      className={cn(emptyMediaVariants({ variant, className }))}
      data-slot="empty-icon"
      data-variant={variant}
      {...props}
    />
  );
}

/** Primary heading inside an {@link EmptyHeader}. */
function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-sm tracking-tight", className)}
      data-slot="empty-title"
      {...props}
    />
  );
}

/** Muted supporting copy beneath an {@link EmptyTitle}. */
function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      className={cn(
        "text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-slot="empty-description"
      {...props}
    />
  );
}

/**
 * Centred region below {@link EmptyHeader} for action controls such as
 * a call-to-action button.
 */
function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-2.5 text-balance text-sm",
        className
      )}
      data-slot="empty-content"
      {...props}
    />
  );
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
};
