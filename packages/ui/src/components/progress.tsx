"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for {@link ProgressTrack} height.
 *
 * Exposes one axis:
 * - `size` — height of the track rail. `"xs"` is barely visible (2 px);
 *   `"sm"` is compact (4 px); `"default"` is the standard height (6 px);
 *   `"lg"` is prominent (10 px).
 *
 * Exported so consumers can derive the same look on standalone
 * {@link ProgressTrack} elements without re-implementing the class list.
 */
const progressTrackVariants = cva(
  "relative flex w-full items-center overflow-x-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        xs: "h-0.5",
        sm: "h-1",
        default: "h-1.5",
        lg: "h-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Class-variance-authority recipe for {@link ProgressIndicator} color.
 *
 * Exposes one axis:
 * - `intent` — semantic color of the filled bar. `"default"` uses the primary
 *   brand color; `"success"`, `"warning"`, `"info"`, and `"destructive"` map to
 *   the matching semantic tokens.
 *
 * Exported so consumers can derive the same look on standalone
 * {@link ProgressIndicator} elements without re-implementing the class list.
 */
const progressIndicatorVariants = cva("h-full transition-all", {
  variants: {
    intent: {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      info: "bg-info",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    intent: "default",
  },
});

/** Props for {@link Progress}. */
export type ProgressProps = ProgressPrimitive.Root.Props &
  VariantProps<typeof progressTrackVariants> &
  VariantProps<typeof progressIndicatorVariants>;

/**
 * Determinate progress bar that displays a numeric completion percentage.
 *
 * Built on Base UI's `Progress` primitive. The root component wires `value`
 * to the ARIA attributes and auto-renders the {@link ProgressTrack} /
 * {@link ProgressIndicator} pair, so the minimal usage requires only a
 * `value` prop. Add {@link ProgressLabel} and {@link ProgressValue} as
 * children to include a text label and a numeric readout that share the same
 * `flex-wrap` row.
 *
 * @remarks
 * - `value` is a number between 0 and 100 (or `null` for indeterminate).
 *   Base UI maps it to `aria-valuenow`/`aria-valuemin`/`aria-valuemax`
 *   automatically.
 * - The indicator width is driven by the primitive's CSS custom property
 *   (`--progress-value`) so no JavaScript width calculation is needed.
 * - Label and value children are laid out via `flex-wrap gap-3`; they
 *   appear above the track when provided.
 * - Pass `size` to control the track height (`"xs" | "sm" | "default" | "lg"`).
 * - Pass `intent` to tint the indicator with a semantic color
 *   (`"default" | "success" | "warning" | "info" | "destructive"`).
 *
 * @example
 * ```tsx
 * <Progress value={60} size="lg" intent="success">
 *   <ProgressLabel>Uploading…</ProgressLabel>
 *   <ProgressValue />
 * </Progress>
 * ```
 */
function Progress({
  className,
  children,
  value,
  size,
  intent,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn("flex flex-wrap gap-3", className)}
      data-slot="progress"
      value={value}
      {...props}
    >
      {children}
      <ProgressTrack size={size}>
        <ProgressIndicator intent={intent} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
}

/**
 * Muted full-width rail that contains the {@link ProgressIndicator}.
 *
 * Accepts a `size` prop (from {@link progressTrackVariants}) to control its
 * height. When used inside {@link Progress} the size is forwarded automatically;
 * pass it explicitly only when composing {@link ProgressTrack} on its own.
 *
 * @link progressTrackVariants
 */
function ProgressTrack({
  className,
  size,
  ...props
}: ProgressPrimitive.Track.Props & VariantProps<typeof progressTrackVariants>) {
  return (
    <ProgressPrimitive.Track
      className={cn(progressTrackVariants({ size }), className)}
      data-slot="progress-track"
      {...props}
    />
  );
}

/**
 * Filled bar inside a {@link ProgressTrack} whose width reflects the current
 * `value` passed to {@link Progress}.
 *
 * Accepts an `intent` prop (from {@link progressIndicatorVariants}) to control
 * the fill color. When used inside {@link Progress} the intent is forwarded
 * automatically; pass it explicitly only when composing
 * {@link ProgressIndicator} on its own.
 *
 * @link progressIndicatorVariants
 */
function ProgressIndicator({
  className,
  intent,
  ...props
}: ProgressPrimitive.Indicator.Props &
  VariantProps<typeof progressIndicatorVariants>) {
  return (
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ intent }), className)}
      data-slot="progress-indicator"
      {...props}
    />
  );
}

/**
 * Text label displayed in the header row of a {@link Progress}; placed as a
 * direct child of the root.
 */
function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn("font-medium text-sm", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

/**
 * Numeric readout of the current percentage, right-aligned via `ml-auto`
 * within the header row of a {@link Progress}.
 */
function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-muted-foreground text-sm tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  );
}

export {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
  progressIndicatorVariants,
  progressTrackVariants,
};
