"use client";

import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import { CopyButton } from "./copy-button";
import { Input } from "./input";

/**
 * Props for {@link SecretInput}.
 *
 * Extends every {@link Input} prop except `type`, which is managed
 * internally to toggle between `"password"` and `"text"`.
 */
type SecretInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  /** The controlled secret value written to the input. */
  value: string;
  /**
   * When `true` (default), a ghost icon button on the trailing edge lets the
   * user flip between masked and plain-text display.
   */
  revealable?: boolean;
  /**
   * When `true` (default), a {@link CopyButton} is rendered on the trailing
   * edge so the user can copy the secret without revealing it.
   */
  copyable?: boolean;
};

/**
 * A controlled text input purpose-built for secrets and API keys.
 *
 * Renders as a `type="password"` input by default (browser-masked). When
 * `revealable` is enabled the user can toggle to plain text via the eye
 * icon button. When `copyable` is enabled the {@link CopyButton} lets the
 * user copy the value without revealing it on-screen.
 *
 * @remarks
 * - Both trailing action buttons are ghost `icon-sm` and fully keyboard
 *   accessible (`aria-label="Reveal"` / `aria-label="Hide"`,
 *   `aria-label="Copy"`).
 * - Because the component uses `useState` for the reveal toggle it is
 *   marked `"use client"` and must be rendered in a client component tree.
 * - The input is uncontrolled for the `type` attribute — if you need to
 *   respond to value changes wire `onChange` through `value` + `onChange`
 *   as usual.
 *
 * @example
 * ```tsx
 * <SecretInput
 *   value={apiKey}
 *   onChange={(e) => setApiKey(e.target.value)}
 *   placeholder="sk_live_…"
 * />
 *
 * <SecretInput value={token} revealable={false} />
 * ```
 */
function SecretInput({
  value,
  revealable = true,
  copyable = true,
  className,
  ...props
}: SecretInputProps) {
  const [revealed, setRevealed] = React.useState(false);

  const inputType = revealed ? "text" : "password";

  const trailingButtonCount = (revealable ? 1 : 0) + (copyable ? 1 : 0);
  let trailingPaddingClass: string | undefined;
  if (trailingButtonCount === 2) {
    trailingPaddingClass = "pr-16";
  } else if (trailingButtonCount === 1) {
    trailingPaddingClass = "pr-9";
  }

  const handleRevealClick: NonNullable<
    React.ComponentProps<typeof Button>["onClick"]
  > = () => {
    setRevealed((r) => !r);
  };

  return (
    <div className="relative w-full">
      <Input
        className={cn(trailingPaddingClass, className)}
        type={inputType}
        value={value}
        {...props}
      />
      {(revealable || copyable) && (
        <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-0.5">
          {revealable && (
            <Button
              aria-label={revealed ? "Hide" : "Reveal"}
              onClick={handleRevealClick}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <HugeiconsIcon icon={revealed ? ViewOffIcon : ViewIcon} />
            </Button>
          )}
          {copyable && <CopyButton text={value} />}
        </div>
      )}
    </div>
  );
}

export { SecretInput, type SecretInputProps };
