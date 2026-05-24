"use client";

import { Add01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { Button, Group, Input, NumberField } from "react-aria-components";
import { cn } from "../utils/index";

/**
 * CVA recipe for the `Group` container height in
 * {@link NumberInputWithButtons}. Mirrors the `inputVariants` height tokens
 * so this component stays visually in rhythm with `Input` and similar fields.
 */
const numberInputGroupVariants = cva("", {
  variants: {
    size: {
      sm: "h-7",
      default: "h-8",
      lg: "h-9",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/** Props for {@link NumberInputWithButtons}. */
export type NumberInputWithButtonsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "defaultValue" | "size"
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
  /** Controls the height of the input group. Defaults to `"default"` (h-8). */
  size?: VariantProps<typeof numberInputGroupVariants>["size"];
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
 * Use `size` (`"sm"` | `"default"` | `"lg"`) to control height. The default
 * matches the previous `h-8` appearance so existing usage is unaffected.
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
  size = "default",
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
          "relative inline-flex w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-input/20 text-sm shadow-xs transition-[color,box-shadow] data-focus-within:border-ring data-disabled:opacity-50 data-focus-within:outline-hidden data-focus-within:ring-3 data-focus-within:ring-ring/50 dark:bg-input/30",
          numberInputGroupVariants({ size }),
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
