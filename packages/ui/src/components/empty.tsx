import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/** Props for the {@link Empty} root container. */
export interface EmptyProps extends React.ComponentProps<"div"> {
  /**
   * When `true` (the default) the root renders a `border border-dashed`
   * outline, signalling the absence of real content. Pass `false` to suppress
   * the border — useful when the empty state lives inside a card that already
   * provides a boundary.
   */
  border?: boolean;
}

/**
 * Centred placeholder surface shown when a list or view has no content.
 *
 * `Empty` is the root container. Compose it with {@link EmptyHeader}
 * (holding {@link EmptyMedia}, {@link EmptyTitle}, and
 * {@link EmptyDescription}) and an optional {@link EmptyContent} region for
 * call-to-action controls.
 *
 * @remarks
 * The root renders a dashed border by default (`border={true}`), signalling
 * the absence of real content. Pass `border={false}` to suppress it when the
 * empty state is already enclosed by a bordered container. It stretches to
 * fill available space via `flex-1`.
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
 *
 * @example Borderless variant
 * ```tsx
 * <Empty border={false}>
 *   <EmptyHeader>
 *     <EmptyTitle>Nothing here</EmptyTitle>
 *   </EmptyHeader>
 * </Empty>
 * ```
 */
function Empty({ className, border = true, ...props }: EmptyProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 text-balance rounded-xl p-6 text-center",
        border && "border border-dashed",
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
 * Exposes three axes:
 *
 * - `variant` — `"default"` is transparent and suits illustrations or custom
 *   imagery; `"icon"` wraps the child in a rounded square with chrome colours
 *   controlled by the `intent` axis.
 *
 * - `size` — `"sm"` / `"default"` / `"lg"` scale the container and its
 *   child SVG. Size only applies a fixed box dimension when `variant="icon"`;
 *   for `variant="default"` the container is unsized.
 *
 * - `intent` — `"muted"` (default) | `"info"` | `"success"` | `"warning"` |
 *   `"destructive"`. Intent colours only apply when `variant="icon"`.
 */
const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex items-center justify-center rounded-lg",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
      },
      intent: {
        muted: "",
        info: "",
        success: "",
        warning: "",
        destructive: "",
      },
    },
    compoundVariants: [
      // ── size × variant=icon ──────────────────────────────────────────────
      {
        variant: "icon",
        size: "sm",
        className: "size-6 [&_svg:not([class*='size-'])]:size-3.5",
      },
      {
        variant: "icon",
        size: "default",
        className: "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
      {
        variant: "icon",
        size: "lg",
        className: "size-12 [&_svg:not([class*='size-'])]:size-6",
      },
      // ── intent × variant=icon ────────────────────────────────────────────
      {
        variant: "icon",
        intent: "muted",
        className: "bg-muted text-foreground",
      },
      {
        variant: "icon",
        intent: "info",
        className: "bg-info/10 text-info-accent",
      },
      {
        variant: "icon",
        intent: "success",
        className: "bg-success/10 text-success-accent",
      },
      {
        variant: "icon",
        intent: "warning",
        className: "bg-warning/10 text-warning-accent",
      },
      {
        variant: "icon",
        intent: "destructive",
        className: "bg-destructive/10 text-destructive-accent",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      intent: "muted",
    },
  }
);

/**
 * Visual focal point at the top of an {@link EmptyHeader} — an illustration,
 * image, or icon container styled via {@link emptyMediaVariants}.
 *
 * @remarks
 * Use `variant="icon"` to wrap a small SVG in a tinted rounded chip. Pair
 * with `size` (`"sm"` | `"default"` | `"lg"`) to control the chip dimensions
 * and with `intent` to apply semantic colour (`"muted"` | `"info"` |
 * `"success"` | `"warning"` | `"destructive"`).
 *
 * @example Info icon, large
 * ```tsx
 * <EmptyMedia variant="icon" size="lg" intent="info">
 *   <InfoCircleIcon />
 * </EmptyMedia>
 * ```
 */
function EmptyMedia({
  className,
  variant = "default",
  size = "default",
  intent = "muted",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      className={cn(emptyMediaVariants({ variant, size, intent, className }))}
      data-intent={intent}
      data-size={size}
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
  emptyMediaVariants,
};
