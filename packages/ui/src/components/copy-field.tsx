"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import { CopyButton } from "./copy-button";

/** CVA recipe for the {@link CopyField} root layout. */
const copyFieldRootVariants = cva("w-full", {
  variants: {
    /** Label/control arrangement. */
    layout: {
      stacked: "grid gap-1.5",
      inline:
        "grid gap-1.5 sm:grid-cols-[minmax(8rem,auto)_1fr] sm:items-center",
    },
  },
  defaultVariants: {
    layout: "stacked",
  },
});

/** CVA recipe for the {@link CopyField} value container. */
const copyFieldVariants = cva(
  "flex w-full min-w-0 items-center gap-2 rounded-lg border px-2.5 text-sm outline-none transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      /** Surface treatment for the copyable value. */
      variant: {
        default: "border-input bg-background dark:bg-input/30",
        muted: "border-input bg-muted/50",
        ghost: "border-transparent bg-transparent px-0",
        terminal:
          "border-transparent bg-surface-terminal text-surface-terminal-foreground",
      },
      /** Height preset matching the form-control size scale. */
      size: {
        xs: "h-6 text-xs",
        sm: "h-7 text-xs",
        default: "h-8",
        lg: "h-9",
      },
      /** Optional semantic state for the value being copied. */
      status: {
        default: "",
        success:
          "border-success/40 focus-within:border-success/50 focus-within:ring-success/20",
        warning:
          "border-warning/40 focus-within:border-warning/40 focus-within:ring-warning/20",
        destructive:
          "border-destructive/40 focus-within:border-destructive/50 focus-within:ring-destructive/20",
        info: "border-info/40 focus-within:border-info/50 focus-within:ring-info/20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      status: "default",
    },
  }
);

/** Props for {@link CopyField}. */
type CopyFieldProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof copyFieldRootVariants> &
  VariantProps<typeof copyFieldVariants> & {
    /** String displayed in the field and copied by the button. */
    value: string;
    /** Optional visible label above or beside the copyable value. */
    label?: React.ReactNode;
    /** Optional helper text below the copyable value. */
    description?: React.ReactNode;
    /** Content rendered before the value inside the control. */
    prefix?: React.ReactNode;
    /** Content rendered after the value and before actions inside the control. */
    suffix?: React.ReactNode;
    /** Whether to use monospace styling for the displayed value. */
    monospace?: boolean;
    /** Whether to truncate the displayed value on one line. */
    truncate?: boolean;
    /** Whether to treat the value as sensitive and mask it by default. */
    sensitive?: boolean;
    /** Controlled reveal state for sensitive values. */
    revealed?: boolean;
    /** Initial reveal state for uncontrolled sensitive values. */
    defaultRevealed?: boolean;
    /** Called when the reveal state changes. */
    onRevealChange?: (revealed: boolean) => void;
    /** Character used when masking sensitive values. */
    maskCharacter?: string;
    /** Accessible and visible label for the reveal action. */
    revealLabel?: string;
    /** Accessible and visible label for the hide action. */
    hideLabel?: string;
    /** Whether to show the copy button. */
    copyable?: boolean;
    /** Accessible label for the copy button. */
    copyLabel?: string;
    /** Called after the value is copied. */
    onCopy?: (value: string) => void;
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
 *   controls and mirrors focus with `focus-within:*` when an inner action is
 *   focused.
 * - Set `sensitive` for API keys or secrets. The visible value is masked until
 *   revealed, but the copy button always copies the original value.
 * - Use `status` for validation-like context around the copied value without
 *   changing the copied payload.
 *
 * @example
 * ```tsx
 * <CopyField label="Environment variable" value="NEXT_PUBLIC_API_URL" />
 * <CopyField label="API key" sensitive value="sk_live_..." status="warning" />
 * ```
 */
function CopyField({
  value,
  label,
  description,
  prefix,
  suffix,
  monospace = true,
  truncate = true,
  sensitive = false,
  revealed,
  defaultRevealed = false,
  onRevealChange,
  maskCharacter = "•",
  revealLabel = "Show",
  hideLabel = "Hide",
  copyable = true,
  copyLabel,
  onCopy,
  layout = "stacked",
  variant = "default",
  size = "default",
  status = "default",
  className,
  id,
  ...props
}: CopyFieldProps) {
  const generatedId = React.useId();
  const valueId = id ?? generatedId;
  const revealState = useRevealState({
    defaultRevealed,
    onRevealChange,
    revealed,
  });
  const resolvedCopyLabel =
    copyLabel ?? (label ? "Copy value" : "Copy field value");

  return (
    <div
      className={cn(copyFieldRootVariants({ layout }), className)}
      data-slot="copy-field"
      {...props}
    >
      {label && (
        <div
          className={cn(
            "font-medium text-foreground text-sm",
            layout === "inline" && "sm:pt-0"
          )}
          data-slot="copy-field-label"
          id={`${valueId}-label`}
        >
          {label}
        </div>
      )}
      <CopyFieldControl
        copyable={copyable}
        copyLabel={resolvedCopyLabel}
        description={description}
        displayOptions={{
          hideLabel,
          maskCharacter,
          monospace,
          prefix,
          revealLabel,
          sensitive,
          suffix,
          truncate,
        }}
        onCopy={onCopy}
        revealState={revealState}
        size={size}
        status={status}
        value={value}
        valueId={valueId}
        variant={variant}
      />
    </div>
  );
}

type CopyFieldDisplayOptions = Pick<
  CopyFieldProps,
  | "hideLabel"
  | "maskCharacter"
  | "monospace"
  | "prefix"
  | "revealLabel"
  | "sensitive"
  | "suffix"
  | "truncate"
>;

type CopyFieldControlProps = {
  copyLabel: string;
  copyable: boolean;
  description: CopyFieldProps["description"];
  displayOptions: CopyFieldDisplayOptions;
  onCopy: CopyFieldProps["onCopy"];
  revealState: ReturnType<typeof useRevealState>;
  size: CopyFieldProps["size"];
  status: CopyFieldProps["status"];
  value: string;
  valueId: string;
  variant: CopyFieldProps["variant"];
};

function CopyFieldControl({
  copyLabel,
  copyable,
  description,
  displayOptions,
  onCopy,
  revealState,
  size,
  status,
  value,
  valueId,
  variant,
}: CopyFieldControlProps) {
  const {
    hideLabel = "Hide",
    maskCharacter = "•",
    monospace,
    prefix,
    revealLabel = "Show",
    sensitive,
    suffix,
    truncate,
  } = displayOptions;
  const isRevealed = !sensitive || revealState.value;
  const displayValue = isRevealed ? value : maskValue(value, maskCharacter);

  return (
    <div className="grid min-w-0 gap-1.5" data-slot="copy-field-main">
      <div
        className={cn(copyFieldVariants({ size, status, variant }))}
        data-slot="copy-field-control"
      >
        <CopyFieldAffix slot="prefix" value={prefix} variant={variant} />
        <span
          className={cn(
            "min-w-0 flex-1 text-foreground",
            variant === "terminal" && "text-surface-terminal-foreground",
            monospace && "font-mono",
            truncate ? "truncate" : "break-all"
          )}
          data-sensitive={sensitive ? "true" : undefined}
          data-slot="copy-field-value"
          id={valueId}
          title={isRevealed ? value : undefined}
        >
          {displayValue}
        </span>
        <CopyFieldAffix slot="suffix" value={suffix} variant={variant} />
        {sensitive && (
          <Button
            aria-label={isRevealed ? hideLabel : revealLabel}
            className={cn(
              "h-6 shrink-0 px-2 text-xs",
              variant === "terminal" &&
                "text-surface-terminal-foreground/75 hover:bg-surface-terminal-foreground/10 hover:text-surface-terminal-foreground"
            )}
            data-slot="copy-field-reveal"
            onClick={() => revealState.set(!isRevealed)}
            size="sm"
            type="button"
            variant="ghost"
          >
            {isRevealed ? hideLabel : revealLabel}
          </Button>
        )}
        {copyable && (
          <CopyButton
            aria-label={copyLabel}
            className={cn(
              "shrink-0",
              variant === "terminal" &&
                "text-surface-terminal-foreground/75 hover:bg-surface-terminal-foreground/10 hover:text-surface-terminal-foreground"
            )}
            onCopied={onCopy}
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

type CopyFieldAffixProps = {
  slot: "prefix" | "suffix";
  value: React.ReactNode;
  variant: CopyFieldProps["variant"];
};

function CopyFieldAffix({ slot, value, variant }: CopyFieldAffixProps) {
  if (!value) {
    return null;
  }

  return (
    <span
      className={cn(
        "shrink-0 text-muted-foreground",
        variant === "terminal" && "text-surface-terminal-foreground/60"
      )}
      data-slot={`copy-field-${slot}`}
    >
      {value}
    </span>
  );
}

type RevealStateInput = {
  defaultRevealed: boolean;
  onRevealChange: CopyFieldProps["onRevealChange"];
  revealed: boolean | undefined;
};

function useRevealState({
  defaultRevealed,
  onRevealChange,
  revealed,
}: RevealStateInput) {
  const [uncontrolledRevealed, setUncontrolledRevealed] =
    React.useState(defaultRevealed);
  const value = revealed ?? uncontrolledRevealed;

  const set = React.useCallback(
    (nextValue: boolean) => {
      if (revealed === undefined) {
        setUncontrolledRevealed(nextValue);
      }
      onRevealChange?.(nextValue);
    },
    [onRevealChange, revealed]
  );

  return { set, value };
}

function maskValue(value: string, maskCharacter: string) {
  const length = Math.min(Math.max(value.length, 8), 16);
  return maskCharacter.repeat(length);
}

export {
  CopyField,
  type CopyFieldProps,
  copyFieldRootVariants,
  copyFieldVariants,
};
