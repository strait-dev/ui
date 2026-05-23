"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "../utils/index";

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
 *
 * @example
 * ```tsx
 * <Progress value={60}>
 *   <ProgressLabel>Uploading…</ProgressLabel>
 *   <ProgressValue />
 * </Progress>
 * ```
 */
function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      className={cn("flex flex-wrap gap-3", className)}
      data-slot="progress"
      value={value}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
}

/** Muted full-width rail that contains the {@link ProgressIndicator}. */
function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

/**
 * Filled bar inside a {@link ProgressTrack} whose width reflects the current
 * `value` passed to {@link Progress}.
 */
function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      className={cn("h-full bg-primary transition-all", className)}
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
};
