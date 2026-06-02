"use client";

import { Loading01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../utils/index";
import { Button } from "./button";
import { Input, type InputProps } from "./input";

/**
 * Props for {@link InputWithLoader}.
 *
 * @remarks
 * When `loading` is `true` the `icon` slot is replaced by a spinning
 * indicator; the original icon reappears once loading resolves. The
 * `endIcon` is always interactive — wrap it with `endIconAriaLabel` for
 * accessibility when using icon-only affordances (e.g. a clear button).
 */
export type InputWithLoaderProps = InputProps & {
  /** When `true`, replaces the {@link icon} slot with an animated spinner. */
  loading?: boolean;
  /** Decorative node rendered at the leading edge; replaced by the spinner
   *  while `loading` is `true`. */
  icon?: React.ReactNode;
  /** Node rendered as a clickable button at the trailing edge of the input
   *  (e.g. a clear or submit icon). Requires {@link endIconAriaLabel}. */
  endIcon?: React.ReactNode;
  /** Click handler forwarded to the trailing-edge button wrapping
   *  {@link endIcon}. */
  onEndIconClick?: () => void;
  /** Accessible label for the trailing-edge {@link endIcon} button;
   *  required by screen readers when using an icon-only affordance. */
  endIconAriaLabel?: string;
};

/**
 * A text input that swaps its leading icon for an animated loading spinner
 * while an async operation is in progress.
 *
 * @remarks
 * Wraps the `Input` primitive in a relative container and overlays up to
 * two absolutely-positioned icon slots:
 * - **Start slot** — shows `icon` normally; replaced by a spinning
 *   `Loading01Icon` when `loading` is `true`. Pointer events are
 *   disabled on this slot.
 * - **End slot** — renders `endIcon` as a clickable `<button>` when
 *   provided; useful for clear or action affordances. Always supply
 *   `endIconAriaLabel` for screen readers when using this slot.
 *
 * Padding on the `Input` adjusts automatically (`ps-9` / `pe-9`) based on
 * which slots are active.
 *
 * @example
 * ```tsx
 * <InputWithLoader
 *   icon={<SearchIcon />}
 *   loading={isFetching}
 *   placeholder="Search…"
 * />
 * ```
 */
function InputWithLoader({
  className,
  loading = false,
  icon,
  endIcon,
  onEndIconClick,
  endIconAriaLabel,
  ...props
}: InputWithLoaderProps) {
  return (
    <div className="relative" data-slot="input-with-loader">
      <Input
        aria-busy={loading}
        className={cn(endIcon ? "pe-9" : "", icon ? "ps-9" : "", className)}
        data-slot="input"
        {...props}
      />
      {/* Show start slot when an icon is provided or loading is active. */}
      {icon || loading ? (
        <div
          className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50"
          data-slot="start-icon"
        >
          {/* Loading state takes priority over the static icon. */}
          {loading ? (
            <HugeiconsIcon
              aria-hidden="true"
              className="size-4 animate-spin"
              icon={Loading01Icon}
            />
          ) : (
            icon
          )}
        </div>
      ) : null}
      {endIcon ? (
        <Button
          aria-label={endIconAriaLabel}
          className="absolute inset-y-0 end-0 rounded-e-md"
          data-slot="end-icon"
          onClick={onEndIconClick}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          {endIcon}
        </Button>
      ) : null}
    </div>
  );
}

export { InputWithLoader };
