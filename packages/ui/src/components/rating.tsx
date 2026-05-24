"use client";

import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for the {@link Rating} star gap.
 *
 * Controls spacing between stars for `sm`, `default`, and `lg` sizes.
 * Exported so consumers can reference variant metadata if needed.
 */
const ratingVariants = cva("inline-flex items-center", {
  variants: {
    size: {
      sm: "gap-0.5",
      default: "gap-1",
      lg: "gap-1.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/** Maps the `size` prop to a pixel integer for `<HugeiconsIcon size={…}>`. */
function starPixelSize(size: "sm" | "default" | "lg"): number {
  if (size === "sm") {
    return 14;
  }
  if (size === "lg") {
    return 24;
  }
  return 18;
}

/** Props for the {@link Rating} component. */
export interface RatingProps extends VariantProps<typeof ratingVariants> {
  /**
   * Accessible name for the root element (`role="radiogroup"` or `role="img"`).
   */
  "aria-label"?: string;

  /** Additional CSS classes forwarded to the root element. */
  className?: string;

  /**
   * Initial rating value for uncontrolled usage.
   * @defaultValue 0
   */
  defaultValue?: number;

  /**
   * When `true` the component is non-interactive and visually dimmed.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Total number of stars rendered.
   * @defaultValue 5
   */
  max?: number;

  /**
   * Callback fired whenever the selected rating changes.
   * Receives the newly selected star index (1‥max).
   */
  onValueChange?: (value: number) => void;

  /**
   * When `true` the component renders as a non-interactive display element
   * with `role="img"`.
   * @defaultValue false
   */
  readOnly?: boolean;

  /**
   * Controlled current rating value.
   * When provided the component is fully controlled; pair with
   * `onValueChange` to track changes.
   */
  value?: number;
}

// ---------------------------------------------------------------------------
// Internal helpers — extracted to avoid nested ternaries
// ---------------------------------------------------------------------------

interface StarIconDisplayProps {
  filled: boolean;
  pixelSize: number;
}

function StarIconDisplay({ filled, pixelSize }: StarIconDisplayProps) {
  return (
    <HugeiconsIcon
      aria-hidden="true"
      className={cn(
        filled
          ? "fill-warning text-warning"
          : "fill-transparent text-muted-foreground/40"
      )}
      icon={StarIcon}
      size={pixelSize}
    />
  );
}

interface InteractiveRatingProps {
  ariaLabel: string;
  className: string;
  currentValue: number;
  groupName: string;
  hovered: number | null;
  max: number;
  onRootKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onRootMouseLeave: () => void;
  onStarChange: (n: number) => void;
  onStarMouseEnter: (n: number) => void;
  pixelSize: number;
}

function InteractiveRating({
  currentValue,
  hovered,
  max,
  pixelSize,
  onStarChange,
  onStarMouseEnter,
  onRootMouseLeave,
  onRootKeyDown,
  ariaLabel,
  className,
  groupName,
}: InteractiveRatingProps) {
  const effectiveValue = hovered ?? currentValue;

  return (
    <div
      aria-label={ariaLabel}
      className={className}
      data-slot="rating"
      onKeyDown={onRootKeyDown}
      onMouseLeave={onRootMouseLeave}
      role="radiogroup"
      tabIndex={-1}
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= effectiveValue;
        const checked = n === currentValue;
        const starLabel = `${n} ${n === 1 ? "star" : "stars"}`;
        const inputId = `${groupName}-star-${n}`;

        return (
          <label
            className="cursor-pointer"
            data-slot="rating-star"
            htmlFor={inputId}
            // biome-ignore lint/suspicious/noArrayIndexKey: stars are positional and index is stable
            key={i}
          >
            <input
              aria-label={starLabel}
              checked={checked}
              className="sr-only"
              id={inputId}
              name={groupName}
              onChange={() => onStarChange(n)}
              onMouseEnter={() => onStarMouseEnter(n)}
              type="radio"
              value={n}
            />
            <span className="block rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
              <StarIconDisplay filled={filled} pixelSize={pixelSize} />
            </span>
          </label>
        );
      })}
    </div>
  );
}

interface ReadOnlyRatingProps {
  ariaLabel: string;
  className: string;
  currentValue: number;
  disabled: boolean;
  max: number;
  pixelSize: number;
}

function ReadOnlyRating({
  currentValue,
  max,
  pixelSize,
  disabled,
  ariaLabel,
  className,
}: ReadOnlyRatingProps) {
  return (
    <span
      aria-label={ariaLabel}
      className={cn(className, disabled && "pointer-events-none opacity-50")}
      data-slot="rating"
      role="img"
    >
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= currentValue;

        return (
          <span
            data-slot="rating-star"
            // biome-ignore lint/suspicious/noArrayIndexKey: stars are positional and index is stable
            key={i}
          >
            <StarIconDisplay filled={filled} pixelSize={pixelSize} />
          </span>
        );
      })}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * A star rating input that supports controlled, uncontrolled, read-only,
 * and disabled modes.
 *
 * @remarks
 * - **Interactive mode** (default): renders a `role="radiogroup"` with one
 *   `<input type="radio">` per star (inside a `<label>`). Hovering previews
 *   the rating; clicking/selecting commits it. Full keyboard support:
 *   `ArrowRight`/`ArrowUp` increment, `ArrowLeft`/`ArrowDown` decrement
 *   (clamped to 1‥max), `Home`=1, `End`=max. Keyboard events are handled
 *   on the root `radiogroup` div.
 * - **Read-only mode** (`readOnly`): renders non-interactive `<span>` elements
 *   wrapped in a `role="img"` container. No hover/keyboard interactions.
 * - **Disabled mode** (`disabled`): same as read-only but adds `opacity-50`
 *   and `pointer-events-none` to the root.
 * - **Controlled**: pass `value` + `onValueChange`. Internal state is
 *   bypassed when `value` is defined.
 * - **Uncontrolled**: pass `defaultValue` (defaults to `0`). Internal state
 *   tracks changes; `onValueChange` is still called on every change.
 * - Icons are from `@hugeicons/core-free-icons` via `@hugeicons/react`. A
 *   filled star uses `fill-warning text-warning`; an empty star uses
 *   `fill-transparent text-muted-foreground/40` — both are semantic tokens.
 *
 * @example
 * ```tsx
 * // Uncontrolled with a default value
 * <Rating defaultValue={3} aria-label="Rate this product" />
 *
 * // Controlled
 * const [rating, setRating] = React.useState(0);
 * <Rating value={rating} onValueChange={setRating} aria-label="Your rating" />
 *
 * // Read-only display
 * <Rating value={4} max={5} readOnly aria-label="Average rating: 4 out of 5" />
 *
 * // Larger stars with disabled state
 * <Rating value={2} size="lg" disabled aria-label="Rating" />
 * ```
 */
function Rating({
  value,
  defaultValue = 0,
  onValueChange,
  max = 5,
  readOnly = false,
  disabled = false,
  size = "default",
  className,
  "aria-label": ariaLabel,
}: RatingProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const groupName = React.useId();

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const resolvedSize = size ?? "default";
  const pixelSize = starPixelSize(resolvedSize);

  const rootClassName = cn(ratingVariants({ size: resolvedSize }), className);

  function commitValue(next: number) {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  function handleStarChange(n: number) {
    commitValue(n);
  }

  function handleStarMouseEnter(n: number) {
    setHovered(n);
  }

  function handleRootMouseLeave() {
    setHovered(null);
  }

  function handleRootKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const clamp = (v: number) => Math.min(max, Math.max(1, v));

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      commitValue(clamp(currentValue + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      commitValue(clamp(currentValue - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      commitValue(1);
    } else if (e.key === "End") {
      e.preventDefault();
      commitValue(max);
    }
  }

  const isPassive = readOnly || disabled;

  if (isPassive) {
    const readOnlyLabel = ariaLabel ?? `Rated ${currentValue} out of ${max}`;

    return (
      <ReadOnlyRating
        ariaLabel={readOnlyLabel}
        className={cn(ratingVariants({ size: resolvedSize }), className)}
        currentValue={currentValue}
        disabled={disabled}
        max={max}
        pixelSize={pixelSize}
      />
    );
  }

  const resolvedAriaLabel = ariaLabel ?? "Rating";

  return (
    <InteractiveRating
      ariaLabel={resolvedAriaLabel}
      className={rootClassName}
      currentValue={currentValue}
      groupName={groupName}
      hovered={hovered}
      max={max}
      onRootKeyDown={handleRootKeyDown}
      onRootMouseLeave={handleRootMouseLeave}
      onStarChange={handleStarChange}
      onStarMouseEnter={handleStarMouseEnter}
      pixelSize={pixelSize}
    />
  );
}

export { Rating, ratingVariants };
