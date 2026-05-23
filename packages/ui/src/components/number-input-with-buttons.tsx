"use client";

import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";
import { Button, Group, Input, NumberField } from "react-aria-components";
import { cn } from "../utils/index";

/** Props for {@link NumberInputWithButtons}. */
export type NumberInputWithButtonsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "defaultValue"
> & {
  defaultValue?: number;
  name: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  className?: string;
  containerClassName?: string;
};

/**
 * A stepper-style number input with flanking decrement (−) and
 * increment (+) buttons rendered on the left and right edges.
 *
 * @remarks
 * Built on React Aria Components `NumberField` + `Group` + `Input`.
 * The decrement button uses the minus/cancel icon on the leading
 * edge and the add icon on the trailing edge; both are wired to
 * React Aria's `"decrement"` / `"increment"` slots so keyboard
 * stepping, aria attributes, and min/max clamping work
 * automatically.
 *
 * The text input is center-aligned to balance the two side buttons.
 *
 * @example
 * ```tsx
 * <NumberInputWithButtons
 *   name="quantity"
 *   label="Quantity"
 *   min={1}
 *   max={99}
 *   value={qty}
 *   onChange={setQty}
 * />
 * ```
 */
function NumberInputWithButtons({
  defaultValue,
  name,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  label,
  placeholder,
  className,
  containerClassName,
  ...props
}: NumberInputWithButtonsProps) {
  return (
    <NumberField
      aria-label={label || `${name} input`}
      data-slot="number-input-with-buttons"
      defaultValue={defaultValue}
      isDisabled={disabled}
      maxValue={max}
      minValue={min}
      onChange={onChange}
      step={step}
      value={value}
    >
      <Group
        className={cn(
          "relative inline-flex h-8 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-input/20 text-sm shadow-black/5 shadow-xs ring-offset-background transition-shadow data-focus-within:border-ring data-disabled:opacity-50 data-focus-within:outline-hidden data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:ring-offset-2 dark:bg-input/30",
          containerClassName
        )}
        data-slot="input-group"
      >
        <Button
          aria-label="Decrease value"
          className={cn(
            "-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-md border border-input bg-transparent text-muted-foreground/80 text-sm ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          )}
          data-slot="decrement-button"
          slot="decrement"
        >
          <HugeiconsIcon
            aria-hidden="true"
            className="size-4"
            icon={Cancel01Icon}
          />
        </Button>
        <Input
          aria-label={label || `${name} input`}
          className={cn(
            "w-full grow bg-transparent px-3 py-1 text-center text-foreground tabular-nums focus:outline-hidden",
            className
          )}
          data-slot="input"
          placeholder={placeholder}
          {...props}
        />
        <Button
          aria-label="Increase value"
          className={cn(
            "-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-md border border-input bg-transparent text-muted-foreground/80 text-sm ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          )}
          data-slot="increment-button"
          slot="increment"
        >
          <HugeiconsIcon
            aria-hidden="true"
            className="size-4"
            icon={Add01Icon}
          />
        </Button>
      </Group>
    </NumberField>
  );
}

NumberInputWithButtons.displayName = "NumberInputWithButtons";

export { NumberInputWithButtons };
