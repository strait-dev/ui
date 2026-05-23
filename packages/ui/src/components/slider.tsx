"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for the {@link Slider} track thickness.
 *
 * Controls `data-horizontal:h-*` / `data-vertical:w-*` on the track element.
 */
const sliderTrackVariants = cva(
  "relative grow select-none overflow-hidden rounded-full bg-muted data-vertical:h-full",
  {
    variants: {
      size: {
        sm: "data-horizontal:h-0.5 data-horizontal:w-full data-vertical:w-0.5",
        default: "data-horizontal:h-1 data-horizontal:w-full data-vertical:w-1",
        lg: "data-horizontal:h-1.5 data-horizontal:w-full data-vertical:w-1.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Class-variance-authority recipe for the {@link Slider} filled range indicator.
 *
 * Colors the filled portion of the track with the appropriate intent token.
 */
const sliderRangeVariants = cva(
  "select-none data-horizontal:h-full data-vertical:w-full",
  {
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
  }
);

/**
 * Class-variance-authority recipe for the {@link Slider} thumb element.
 *
 * Controls thumb size and the ring/border colour used on hover/focus/active.
 */
const sliderThumbVariants = cva(
  "relative block shrink-0 select-none rounded-full border bg-background transition-[color,box-shadow] after:absolute after:-inset-2 hover:ring-3 focus-visible:outline-hidden focus-visible:ring-3 active:ring-3 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "size-2.5",
        default: "size-3",
        lg: "size-4",
      },
      intent: {
        default: "border-ring ring-ring/50",
        success: "border-success ring-success/50",
        warning: "border-warning ring-warning/50",
        info: "border-info ring-info/50",
        destructive: "border-destructive ring-destructive/50",
      },
    },
    defaultVariants: {
      size: "default",
      intent: "default",
    },
  }
);

/**
 * Props for {@link Slider}.
 *
 * Extends Base UI's slider root props with `size` and `intent` variant axes.
 */
export type SliderProps = SliderPrimitive.Root.Props &
  VariantProps<typeof sliderTrackVariants> &
  VariantProps<typeof sliderRangeVariants> & {
    "aria-label"?: string;
  };

/**
 * A range-input control for selecting a numeric value (or range of
 * values) by dragging one or more thumbs along a track.
 *
 * Built on Base UI's `Slider` primitive. Supports both single-value
 * and multi-thumb range modes depending on whether a scalar or array
 * is passed to `value` / `defaultValue`.
 *
 * @remarks
 * - Pass an array to `defaultValue` (e.g. `[20, 80]`) to enable a
 *   two-thumb range slider; a single number produces one thumb.
 * - The `min` / `max` props default to `0` / `100` and control the
 *   allowed range. `step` (from Base UI) controls granularity.
 * - Pass `aria-label` at the root to have the same accessible name
 *   forwarded to every thumb. Omit it when wrapping the slider in a
 *   `<Field>` with a `<FieldLabel>` — Base UI will wire the label
 *   association automatically.
 * - Supports `orientation="vertical"` via Base UI; the component
 *   responds to `data-vertical` / `data-horizontal` on the root.
 * - `size` controls track thickness and thumb size: `"sm"`, `"default"`, `"lg"`.
 * - `intent` colors the filled range and thumb: `"default"` (primary),
 *   `"success"`, `"warning"`, `"info"`, `"destructive"`.
 *
 * @example
 * ```tsx
 * // Single thumb (uncontrolled)
 * <Slider defaultValue={[40]} aria-label="Volume" />
 *
 * // Range slider (controlled) with success intent
 * <Slider
 *   value={[20, 80]}
 *   onValueChange={([lo, hi]) => setRange([lo, hi])}
 *   intent="success"
 *   size="lg"
 * />
 * ```
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  size = "default",
  intent = "default",
  "aria-label": ariaLabel,
  ...props
}: SliderProps) {
  const _values = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value;
    }
    if (Array.isArray(defaultValue)) {
      return defaultValue;
    }
    return [min, max];
  }, [value, defaultValue, min, max]);

  return (
    <SliderPrimitive.Root
      className={cn("data-vertical:h-full data-horizontal:w-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      thumbAlignment="edge"
      value={value}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col data-disabled:opacity-50">
        <SliderPrimitive.Track
          className={cn(sliderTrackVariants({ size }))}
          data-slot="slider-track"
        >
          <SliderPrimitive.Indicator
            className={cn(sliderRangeVariants({ intent }))}
            data-slot="slider-range"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            // Forward the root-level aria-label to each thumb (Base UI puts the
            // accessible name on the thumb input, not the root). Omitted when
            // undefined so a Field/FieldLabel association still works.
            aria-label={ariaLabel}
            className={cn(sliderThumbVariants({ size, intent }))}
            data-slot="slider-thumb"
            // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are positional and identically rendered; index is the stable identity.
            key={index}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export {
  Slider,
  sliderRangeVariants,
  sliderThumbVariants,
  sliderTrackVariants,
};
