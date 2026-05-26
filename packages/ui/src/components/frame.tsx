import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// Frame — a bordered surface that hosts one or more FramePanel children.
// ---------------------------------------------------------------------------

/**
 * CVA recipe driving the {@link Frame} root.
 *
 * Two axes:
 * - `variant` — `"default"` draws the outer border + radius; `"ghost"` removes
 *   it (panels then carry their own border).
 * - `spacing` — vertical gap between sibling {@link FramePanel} children when
 *   the frame is *not* `stacked`. Ignored under `stacked` (panels are joined
 *   edge-to-edge with shared borders).
 */
export const frameVariants = cva(
  // `group/frame` lets descendants react to `data-*` flags set on the root
  // (e.g. `stacked`, `dense`). `--frame-radius` is the corner radius reused
  // by descendant `FramePanel`s; consumers can override it on the root.
  "group/frame flex w-full flex-col [--frame-radius:var(--radius-xl)] [border-radius:var(--frame-radius)]",
  {
    variants: {
      variant: {
        default: "border bg-card text-card-foreground",
        ghost: "bg-transparent",
      },
      spacing: {
        sm: "gap-2",
        default: "gap-4",
        lg: "gap-6",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "default",
    },
    compoundVariants: [
      // Stacked frames don't gap their panels — handled inline in `Frame`.
    ],
  }
);

type FrameVariantProps = VariantProps<typeof frameVariants>;

/** Props for {@link Frame}. */
export interface FrameProps
  extends React.ComponentProps<"div">,
    FrameVariantProps {
  /**
   * When `true`, {@link FramePanel}s drop their inner padding. Useful when
   * the panel's content owns its own padding (e.g. a `<DataGrid>`).
   * Default `false`.
   */
  dense?: boolean;
  /**
   * When `true`, sibling {@link FramePanel}s are joined edge-to-edge with
   * shared borders (no gap, no inner radius between them). Only the first
   * and last panels keep rounded corners. Default `false`.
   */
  stacked?: boolean;
}

/**
 * A bordered surface that hosts one or more {@link FramePanel} children.
 *
 * Frame composes like a card but with first-class support for *stacking*
 * multiple panels inside a single bordered shell — useful for settings
 * groups, summary blocks, or any layout where related panels should share
 * an outer frame.
 *
 * @remarks
 * - `variant="ghost"` removes the outer border; panels then own the border.
 * - `spacing` sets the vertical gap between non-stacked panels.
 * - `stacked` joins panels edge-to-edge with a shared border so the group
 *   reads as one continuous surface.
 * - `dense` strips inner panel padding (defer padding to the panel's child).
 * - Override `--frame-radius` on the root to retheme the corner radius for
 *   the frame and every nested panel.
 *
 * @example
 * ```tsx
 * <Frame stacked>
 *   <FramePanel>
 *     <FrameHeader>
 *       <FrameTitle>Storage</FrameTitle>
 *       <FrameDescription>Currently using 12 GB of 100 GB.</FrameDescription>
 *     </FrameHeader>
 *   </FramePanel>
 *   <FramePanel>
 *     <FrameHeader>
 *       <FrameTitle>Bandwidth</FrameTitle>
 *       <FrameDescription>3 TB / month plan.</FrameDescription>
 *     </FrameHeader>
 *   </FramePanel>
 * </Frame>
 * ```
 */
function Frame({
  className,
  variant,
  spacing,
  stacked = false,
  dense = false,
  ...props
}: FrameProps) {
  return (
    <div
      className={cn(
        frameVariants({ variant, spacing }),
        stacked && "gap-0 overflow-hidden",
        className
      )}
      data-dense={dense ? "true" : undefined}
      data-slot="frame"
      data-stacked={stacked ? "true" : undefined}
      data-variant={variant ?? "default"}
      {...props}
    />
  );
}

/**
 * A single content section inside a {@link Frame}. When the parent frame is
 * `stacked`, sibling panels share borders; otherwise each panel is a
 * standalone bordered block (only when the parent is `ghost`).
 */
function FramePanel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        // Base — full radius unless the parent is stacked.
        "flex w-full flex-col gap-3 in-data-[dense=true]/frame:p-0 p-5 [border-radius:var(--frame-radius)]",
        // Inside a stacked frame: drop inner radius for middle panels and
        // share borders. First/last panels retain only their outer corners.
        "group-data-[stacked=true]/frame:rounded-none group-data-[stacked=true]/frame:border-border group-data-[stacked=true]/frame:not-last:border-b last:group-data-[stacked=true]/frame:[border-bottom-left-radius:var(--frame-radius)] last:group-data-[stacked=true]/frame:[border-bottom-right-radius:var(--frame-radius)] first:group-data-[stacked=true]/frame:[border-top-left-radius:var(--frame-radius)] first:group-data-[stacked=true]/frame:[border-top-right-radius:var(--frame-radius)]",
        // Inside a ghost (border-less) frame, panels carry the border.
        "group-data-[variant=ghost]/frame:border",
        className
      )}
      data-slot="frame-panel"
      {...props}
    />
  );
}

/**
 * Top section of a {@link FramePanel}; groups a {@link FrameTitle} and an
 * optional {@link FrameDescription}.
 */
function FrameHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1", className)}
      data-slot="frame-header"
      {...props}
    />
  );
}

/** Title text inside a {@link FrameHeader}. Rendered as a `<div>` by default. */
function FrameTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-foreground text-sm", className)}
      data-slot="frame-title"
      {...props}
    />
  );
}

/** Muted supporting copy beneath a {@link FrameTitle}. */
function FrameDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="frame-description"
      {...props}
    />
  );
}

/**
 * Bottom-aligned footer slot inside a {@link FramePanel}; reveals a top
 * border to separate footer actions from the panel body.
 */
function FrameFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-border border-t pt-3",
        className
      )}
      data-slot="frame-footer"
      {...props}
    />
  );
}

export {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
};
