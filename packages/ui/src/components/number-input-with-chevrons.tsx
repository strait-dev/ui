"use client";

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { Button, Group, Input, NumberField } from "react-aria-components";
import { cn } from "../utils/index";

/**
 * CVA recipe for the `Group` container height in
 * {@link NumberInputWithChevrons}. Mirrors the `inputVariants` height tokens
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

/** Props for {@link NumberInputWithChevrons}. */
export type NumberInputWithChevronsProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "defaultValue" | "size"
> & {
  /** Uncontrolled initial value passed to the underlying `NumberField`. */
  defaultValue?: number;
  /** `name` attribute of the hidden input; also used as the aria-label base. */
  name: string;
  /** Controlled value passed to the underlying `NumberField`. */
  value?: number;
  /** Called with the new numeric value whenever it changes. */
  onChange?: (value: number) => void;
  /** Minimum allowed value; forwarded to `NumberField` as `minValue`. */
  min?: number;
  /** Maximum allowed value; forwarded to `NumberField` as `maxValue`. */
  max?: number;
  /** Amount to increment/decrement per step. Defaults to `1`. */
  step?: number;
  /** Disables the entire field when `true`. */
  disabled?: boolean;
  /** Accessible label; used as `aria-label` on both the field and the input. */
  label?: string;
  /**
   * `Intl.NumberFormatOptions` forwarded to React Aria's formatter
   * (e.g. `{ style: "currency", currency: "USD" }`).
   */
  formatOptions?: Intl.NumberFormatOptions;
  /** Extra classes merged onto the `<Group>` wrapper element. */
  containerClassName?: string;
  /** Controls the height of the input group. Defaults to `"default"` (h-8). */
  size?: VariantProps<typeof numberInputGroupVariants>["size"];
};

/**
 * A number input with stacked up/down chevron buttons in a trailing
 * column, supporting arbitrary `Intl.NumberFormatOptions` formatting.
 *
 * @remarks
 * Built on React Aria Components `NumberField` + `Group` + `Input`.
 * Unlike {@link NumberInputWithButtons} — which flanks the input —
 * the chevrons here live in a dedicated right-hand column separated
 * by a left border, matching a compact spinner layout.
 *
 * Pass `formatOptions` to apply any `Intl.NumberFormat` style (e.g.
 * currency, unit, percent) directly through React Aria's formatter.
 * Min/max clamping and keyboard stepping are handled by the
 * underlying `NumberField`.
 *
 * Use `size` (`"sm"` | `"default"` | `"lg"`) to control height. The default
 * matches the previous `h-8` appearance so existing usage is unaffected.
 *
 * @example
 * ```tsx
 * <NumberInputWithChevrons
 *   name="price"
 *   label="Price"
 *   min={0}
 *   step={0.01}
 *   formatOptions={{ style: "currency", currency: "USD" }}
 *   value={price}
 *   onChange={setPrice}
 * />
 * ```
 */
function NumberInputWithChevrons({
  defaultValue,
  name,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  label,
  formatOptions,
  className,
  containerClassName,
  size = "default",
  ...props
}: NumberInputWithChevronsProps) {
  return (
    <NumberField
      aria-label={label || `${name} input`}
      data-slot="number-input-with-chevrons"
      defaultValue={defaultValue}
      formatOptions={formatOptions}
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
        <Input
          aria-label={label || `${name} input`}
          className={cn(
            "min-w-0 flex-1 bg-transparent px-3 py-1 text-foreground tabular-nums focus:outline-hidden",
            className
          )}
          data-slot="input"
          {...props}
        />
        <div
          className="flex h-full w-8 shrink-0 flex-col border-input border-l"
          data-slot="chevrons-container"
        >
          <Button
            aria-label="Increase value"
            className="flex h-1/2 w-8 items-center justify-center bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
            aria-label="Decrease value"
            className="flex h-1/2 w-8 items-center justify-center border-input border-t bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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

NumberInputWithChevrons.displayName = "NumberInputWithChevrons";

export { NumberInputWithChevrons };
