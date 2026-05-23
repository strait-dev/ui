"use client";

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { Button, Group, Input, NumberField } from "react-aria-components";
import { cn } from "../utils/index";

const MINIMUM_VALUE = 0;
const MAX_VALUE = 100;

/**
 * CVA recipe for the `Group` container height in
 * {@link NumberInputPercentageWithChevrons}. Mirrors the `inputVariants`
 * height tokens so this component stays visually in rhythm with `Input` and
 * similar fields.
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

/**
 * Props for {@link NumberInputPercentageWithChevrons}.
 *
 * `value` and `onChange` operate on the raw percentage integer
 * (0–100). The component internally converts to the 0–1 fraction
 * that React Aria's `NumberField` expects.
 */
export type NumberInputPercentageWithChevronsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "defaultValue" | "size"
> & {
  defaultValue?: number;
  name: string;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  label?: string;
  containerClassName?: string;
  /** Controls the height of the input group. Defaults to `"default"` (h-8). */
  size?: VariantProps<typeof numberInputGroupVariants>["size"];
};

/**
 * A percentage number input (0–100 %) with stacked up/down chevron
 * buttons, formatted with React Aria's `NumberField`.
 *
 * @remarks
 * Built on React Aria Components `NumberField` + `Group` + `Input`.
 * The `value` and `onChange` contract uses the raw integer percentage
 * (e.g. `42` for 42 %), while the underlying `NumberField` works with
 * the 0–1 fraction required by the `"percent"` format style — the
 * conversion is handled internally.
 *
 * Chevrons are wired to React Aria's `"increment"` / `"decrement"`
 * slots and step by 0.01 (1 percentage point). Values are clamped
 * between 0 and 100 by `minValue` / `maxValue`.
 *
 * Use `size` (`"sm"` | `"default"` | `"lg"`) to control height. The default
 * matches the previous `h-8` appearance so existing usage is unaffected.
 *
 * @example
 * ```tsx
 * <NumberInputPercentageWithChevrons
 *   name="discount"
 *   label="Discount"
 *   value={discount}
 *   onChange={setDiscount}
 * />
 * ```
 */
function NumberInputPercentageWithChevrons({
  defaultValue = 0,
  name,
  value,
  onChange,
  disabled,
  label,
  className,
  containerClassName,
  size = "default",
  ...props
}: NumberInputPercentageWithChevronsProps) {
  // Convert integer % (0–100) to the 0–1 fraction NumberField expects.
  const displayValue = value ? value / MAX_VALUE : 0;

  const handleChange = (newValue: number) => {
    if (onChange) {
      // Convert fraction back to integer percentage for the caller.
      onChange(newValue * MAX_VALUE);
    }
  };

  return (
    <NumberField
      aria-label={label || `${name} input`}
      data-slot="number-input-percentage-with-chevrons"
      defaultValue={defaultValue}
      formatOptions={{
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }}
      isDisabled={disabled}
      maxValue={MAX_VALUE}
      minValue={MINIMUM_VALUE}
      onChange={handleChange}
      step={0.01}
      value={displayValue}
    >
      <Group
        className={cn(
          "relative inline-flex w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-input/20 text-sm shadow-black/5 shadow-xs ring-offset-background transition-shadow data-focus-within:border-ring data-disabled:opacity-50 data-focus-within:outline-hidden data-focus-within:ring-[3px] data-focus-within:ring-ring/50 data-focus-within:ring-offset-2 dark:bg-input/30",
          numberInputGroupVariants({ size }),
          containerClassName
        )}
        data-slot="input-group"
      >
        <Input
          aria-label={label || `${name} percentage input`}
          className={cn(
            "flex-1 bg-transparent px-3 py-1 text-foreground tabular-nums focus:outline-hidden",
            className
          )}
          data-slot="input"
          {...props}
        />
        <div
          className="flex h-[calc(100%+2px)] flex-col"
          data-slot="chevrons-container"
        >
          <Button
            aria-label="Increase percentage"
            className="-me-px flex h-1/2 w-8 flex-1 items-center justify-center border border-input bg-transparent text-muted-foreground/80 text-sm ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            data-slot="increment-button"
            slot="increment"
          >
            <HugeiconsIcon
              aria-hidden="true"
              className="size-4"
              icon={ArrowUp01Icon}
            />
          </Button>
          <Button
            aria-label="Decrease percentage"
            className="-me-px -mt-px flex h-1/2 w-8 flex-1 items-center justify-center border border-input bg-transparent text-muted-foreground/80 text-sm ring-offset-background transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            data-slot="decrement-button"
            slot="decrement"
          >
            <HugeiconsIcon
              aria-hidden="true"
              className="size-4"
              icon={ArrowDown01Icon}
            />
          </Button>
        </div>
      </Group>
    </NumberField>
  );
}

NumberInputPercentageWithChevrons.displayName =
  "NumberInputPercentageWithChevrons";

export { NumberInputPercentageWithChevrons };
