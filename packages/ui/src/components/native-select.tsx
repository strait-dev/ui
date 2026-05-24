import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import { cn } from "../utils/index";

/**
 * Props for {@link NativeSelect}.
 *
 * `size` is omitted from the native `<select>` props to prevent the type
 * collapsing to `never` (HTML's numeric `size` attribute vs. the design
 * token string union). The design-token `size` is added back below.
 */
export type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  /**
   * Height preset for the select control.
   * - `sm`      — 28 px tall, tighter border radius.
   * - `default` — 32 px tall (unchanged default).
   * - `lg`      — 40 px tall, slightly larger text.
   *
   * This does NOT map to the native HTML `size` attribute.
   * @defaultValue "default"
   */
  size?: "sm" | "default" | "lg";
};

/**
 * A styled wrapper around the native `<select>` element.
 *
 * Composed with {@link NativeSelectOption} and
 * {@link NativeSelectOptGroup} to build the option list. Renders the
 * browser's native dropdown — ideal when rich keyboard/accessibility
 * support for the OS picker is required.
 *
 * @remarks
 * - The chevron icon is purely decorative (`aria-hidden`) and is
 *   absolutely-positioned over the right side of the wrapper `<div>`,
 *   so `appearance-none` can be used to hide the OS-default arrow.
 * - The `size` prop (`"sm"` | `"default"` | `"lg"`) adjusts height and
 *   border radius via `data-size` — it does NOT map to the HTML `size`
 *   attribute. `Omit<…, "size">` removes the native numeric `size` prop to
 *   prevent the type collapsing to `never`.
 * - Pair with a `<Label>` for accessible forms.
 * - For a fully custom-styled JS dropdown, use {@link Select} instead.
 *   For the alternative styled native wrapper, see {@link SelectNative}.
 *
 * @example
 * ```tsx
 * <NativeSelect size="lg" defaultValue="">
 *   <NativeSelectOption value="" disabled>
 *     Pick a colour
 *   </NativeSelectOption>
 *   <NativeSelectOption value="red">Red</NativeSelectOption>
 *   <NativeSelectOption value="blue">Blue</NativeSelectOption>
 * </NativeSelect>
 * ```
 */
function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div
      className={cn(
        "group/native-select relative w-fit has-[select:disabled]:opacity-50",
        className
      )}
      data-size={size}
      data-slot="native-select-wrapper"
    >
      <select
        className={cn(
          "w-full min-w-0 select-none appearance-none rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-sm outline-none transition-colors",
          "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:cursor-not-allowed",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          "dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50",
          // Size axis — height and border-radius
          "data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[size=sm]:py-0.5",
          "data-[size=default]:h-8",
          "data-[size=lg]:h-10 data-[size=lg]:rounded-xl data-[size=lg]:py-2 data-[size=lg]:text-base"
        )}
        data-size={size}
        data-slot="native-select"
        {...props}
      />
      <HugeiconsIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 select-none text-muted-foreground"
        data-slot="native-select-icon"
        icon={UnfoldMoreIcon}
        strokeWidth={2}
      />
    </div>
  );
}

/** A single `<option>` element used inside {@link NativeSelect}. */
function NativeSelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" {...props} />;
}

/**
 * An `<optgroup>` wrapper for labelling sections of
 * {@link NativeSelectOption}s inside {@link NativeSelect}.
 */
function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      className={cn(className)}
      data-slot="native-select-optgroup"
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
