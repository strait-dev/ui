"use client";

import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import copy from "copy-to-clipboard";
import * as React from "react";

import { cn } from "../utils/index";
import { Button } from "./button";

/**
 * Props for {@link CopyButton}.
 *
 * Extends every {@link Button} prop (so `variant`, `size`, `disabled`, etc.
 * pass straight through) and adds the clipboard payload plus feedback knobs.
 */
type CopyButtonProps = React.ComponentProps<typeof Button> & {
  /** The string written to the clipboard when the button is pressed. */
  text: string;
  /** How long, in ms, the "copied" state persists before reverting. */
  timeout?: number;
  /** Called after a successful copy, useful for analytics or toasts. */
  onCopied?: (text: string) => void;
};

/**
 * Icon button that copies a string to the clipboard and shows a transient
 * checkmark as confirmation.
 *
 * Composes the design-system {@link Button}, so it inherits the full
 * `variant`/`size` matrix — defaulting to a low-emphasis `ghost` `icon-sm`
 * button suited to sitting beside code, IDs, secrets, and table cells. Pass
 * `children` to render a labelled button instead of the icon-only default.
 *
 * @remarks
 * - Copying uses the `copy-to-clipboard` package, which works without the
 *   async Clipboard API and degrades gracefully in insecure contexts.
 * - The `aria-label` flips between "Copy" and "Copied" so screen-reader users
 *   hear the state change; override it via the `aria-label` prop when the
 *   payload has a more specific name (e.g. "Copy API key").
 * - The revert timer is cleared on unmount to avoid setting state on an
 *   unmounted component.
 *
 * @example
 * ```tsx
 * <CopyButton text={apiKey} aria-label="Copy API key" />
 *
 * <CopyButton text={runId} variant="outline" size="sm">
 *   Copy ID
 * </CopyButton>
 * ```
 */
function CopyButton({
  text,
  timeout = 1500,
  onCopied,
  variant = "ghost",
  size = "icon-sm",
  className,
  children,
  "aria-label": ariaLabel,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  const handleClick: NonNullable<
    React.ComponentProps<typeof Button>["onClick"]
  > = (event) => {
    onClick?.(event);
    copy(text);
    setCopied(true);
    onCopied?.(text);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => setCopied(false), timeout);
  };

  // Only synthesise a label for the icon-only case; visible children already
  // provide the accessible name and an aria-label would shadow it.
  const iconOnlyLabel = copied ? "Copied" : "Copy";
  const resolvedLabel = ariaLabel ?? (children ? undefined : iconOnlyLabel);

  return (
    <Button
      aria-label={resolvedLabel}
      className={cn(className)}
      data-copied={copied}
      data-slot="copy-button"
      onClick={handleClick}
      size={size}
      variant={variant}
      {...props}
    >
      <HugeiconsIcon
        className={cn(copied && "text-success-accent")}
        icon={copied ? Tick01Icon : Copy01Icon}
      />
      {children}
    </Button>
  );
}

export { CopyButton, type CopyButtonProps };
