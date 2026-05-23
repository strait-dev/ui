"use client";

import { Loading01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../utils/index";
import { Input } from "./input";

/**
 * Props for {@link InputWithLoader}.
 *
 * @remarks
 * When `isLoading` is `true` the `icon` slot is replaced by a spinning
 * indicator; the original icon reappears once loading resolves. The
 * `endIcon` is always interactive — wrap it with `endIconAriaLabel` for
 * accessibility when using icon-only affordances (e.g. a clear button).
 */
export type InputWithLoaderProps = React.ComponentProps<"input"> & {
  isLoading?: boolean;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onEndIconClick?: () => void;
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
 *   `Loading01Icon` when `isLoading` is `true`. Pointer events are
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
 *   isLoading={isFetching}
 *   placeholder="Search…"
 * />
 * ```
 */
function InputWithLoader({
  className,
  isLoading = false,
  icon,
  endIcon,
  onEndIconClick,
  endIconAriaLabel,
  ...props
}: InputWithLoaderProps) {
  return (
    <div className="relative" data-slot="input-with-loader">
      <Input
        className={cn(endIcon ? "pe-9" : "", icon ? "ps-9" : "", className)}
        data-slot="input"
        {...props}
      />
      {/* Show start slot when an icon is provided or loading is active. */}
      {icon || isLoading ? (
        <div
          className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50"
          data-slot="start-icon"
        >
          {/* Loading state takes priority over the static icon. */}
          {isLoading ? (
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
        <button
          aria-label={endIconAriaLabel}
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-colors hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          data-slot="end-icon"
          onClick={onEndIconClick}
          type="button"
        >
          {endIcon}
        </button>
      ) : null}
    </div>
  );
}

export { InputWithLoader };
