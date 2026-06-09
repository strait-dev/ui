"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";
import { CopyButton } from "./copy-button";

/** CVA recipe for the {@link CopyField} value container. */
const copyFieldVariants = cva(
  "flex w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      /** Height preset matching the form-control size scale. */
      size: {
        sm: "h-7",
        default: "h-8",
        lg: "h-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/** Props for {@link CopyField}. */
type CopyFieldProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof copyFieldVariants> & {
    /** String displayed in the field and copied by the button. */
    value: string;
    /** Optional visible label above the copyable value. */
    label?: React.ReactNode;
    /** Optional helper text below the copyable value. */
    description?: React.ReactNode;
    /** Whether to use monospace styling for the displayed value. */
    monospace?: boolean;
    /** Whether to show the copy button. */
    copyable?: boolean;
  };

/**
 * Read-only field for tokens, IDs, commands, environment variables, and other
 * exact values that users commonly need to copy.
 *
 * `CopyField` pairs a form-control-height value surface with a clipboard button
 * and optional label/description text. It is intentionally read-only: use
 * `Input` for editable values and `CopyField` when the value should be copied
 * exactly as displayed.
 *
 * @remarks
 * - The value surface uses the same `h-8`/`rounded-lg` baseline as form
 *   controls and mirrors focus with `focus-within:*` when the copy button is
 *   focused.
 * - `monospace` defaults to `true` because most copied values are identifiers,
 *   commands, or tokens. Set it to `false` for prose-like values.
 * - The copy button receives a value-specific accessible label, so screen
 *   readers announce the action even when the value is visually truncated.
 *
 * @example
 * ```tsx
 * <CopyField label="Environment variable" value="NEXT_PUBLIC_API_URL" />
 * <CopyField label="Run ID" value="run_8f3a91c2e7" size="sm" />
 * ```
 */
function CopyField({
  value,
  label,
  description,
  monospace = true,
  copyable = true,
  size = "default",
  className,
  id,
  ...props
}: CopyFieldProps) {
  const generatedId = React.useId();
  const valueId = id ?? generatedId;

  return (
    <div
      className={cn("grid w-full gap-1.5", className)}
      data-slot="copy-field"
      {...props}
    >
      {label && (
        <div
          className="font-medium text-foreground text-sm"
          data-slot="copy-field-label"
          id={`${valueId}-label`}
        >
          {label}
        </div>
      )}
      <div
        className={cn(copyFieldVariants({ size }))}
        data-slot="copy-field-control"
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-foreground",
            monospace && "font-mono"
          )}
          data-slot="copy-field-value"
          id={valueId}
          title={value}
        >
          {value}
        </span>
        {copyable && (
          <CopyButton
            aria-label={label ? "Copy value" : "Copy field value"}
            className="shrink-0"
            text={value}
          />
        )}
      </div>
      {description && (
        <div
          className="text-muted-foreground text-xs"
          data-slot="copy-field-description"
        >
          {description}
        </div>
      )}
    </div>
  );
}

export { CopyField, type CopyFieldProps, copyFieldVariants };
