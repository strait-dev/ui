"use client";

import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Input, type InputProps } from "../components/input";
import { cn } from "../utils/index";

/**
 * Props for {@link PasswordInput}.
 *
 * @remarks
 * `type` is omitted because the component manages `"password"` / `"text"`
 * internally via the show/hide toggle. `size` is forwarded to the underlying
 * `Input` — use `"sm"` | `"default"` | `"lg"` to control field height.
 */
export type PasswordInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "size"
> &
  Pick<InputProps, "size"> & {
    label?: string;
    showPasswordLabel?: string;
    hidePasswordLabel?: string;
    containerClassName?: string;
  };

/**
 * A password field with an inline toggle button that reveals or masks the
 * entered text.
 *
 * @remarks
 * Composes the `Input` primitive with an absolutely-positioned `<button>` at
 * the trailing end. The toggle button carries `aria-pressed` to reflect the
 * current visibility state, and its `aria-label` switches between
 * `showPasswordLabel` / `hidePasswordLabel` so screen readers announce the
 * action correctly.
 *
 * - Renders an optional `<label>` element when the `label` prop is supplied;
 *   the label is linked to the input via `htmlFor={props.id}`, so `id` must
 *   be set when using `label`.
 * - The `type` prop is intentionally omitted — the component manages
 *   `"password"` vs `"text"` itself.
 *
 * @example
 * ```tsx
 * <PasswordInput
 *   id="current-password"
 *   label="Password"
 *   placeholder="Enter your password"
 * />
 * ```
 */
function PasswordInput({
  className,
  label,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  containerClassName,
  size = "default",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="flex flex-col gap-2" data-slot="password-input">
      {label ? (
        <label
          className="font-medium text-foreground text-sm"
          data-slot="label"
          htmlFor={props.id}
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn("relative", containerClassName)}
        data-slot="input-container"
      >
        <Input
          className={cn("pe-9", className)}
          data-slot="input"
          size={size}
          type={isVisible ? "text" : "password"}
          {...props}
        />
        <button
          aria-label={
            isVisible ? (hidePasswordLabel ?? "") : (showPasswordLabel ?? "")
          }
          aria-pressed={isVisible}
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          data-slot="visibility-toggle"
          onClick={toggleVisibility}
          type="button"
        >
          {isVisible ? (
            <HugeiconsIcon
              aria-hidden="true"
              className="size-4"
              icon={ViewOffIcon}
            />
          ) : (
            <HugeiconsIcon
              aria-hidden="true"
              className="size-4"
              icon={ViewIcon}
            />
          )}
        </button>
      </div>
    </div>
  );
}

export { PasswordInput };
