import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";
import { cn } from "../utils/index";

/** Props for {@link SelectNative}. */
export type SelectNativeProps = React.ComponentProps<"select">;

/**
 * Styled wrapper around the browser's native `<select>` element.
 *
 * Accepts raw `<option>` / `<optgroup>` children and all standard
 * `<select>` attributes including `multiple`. In single-select mode a
 * down-chevron icon is absolutely-positioned to the right; in multi-select
 * mode (`multiple={true}`) the chevron is omitted and selected options
 * receive accent highlighting. For a fully custom JS-driven dropdown use
 * {@link Select}; for an accessible form always pair with a `<Label>`.
 *
 * @example
 * ```tsx
 * <SelectNative defaultValue="">
 *   <option value="" disabled>Choose…</option>
 *   <option value="apple">Apple</option>
 *   <option value="banana">Banana</option>
 * </SelectNative>
 * ```
 */
const SelectNative = ({ className, children, ...props }: SelectNativeProps) => (
  <div className="relative flex">
    <select
      className={cn(
        "peer inline-flex w-full appearance-none items-center rounded-lg border border-input text-foreground text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 has-[option[disabled]:checked]:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        props.multiple
          ? "py-1 *:px-3 *:py-1 [&_option:checked]:bg-accent"
          : "h-8 ps-3 pe-8",
        className
      )}
      data-slot="select-native"
      {...props}
    >
      {children}
    </select>
    {!props.multiple && (
      <span className="pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 peer-disabled:opacity-50 peer-aria-invalid:text-destructive/80">
        <HugeiconsIcon
          aria-hidden="true"
          className="size-4"
          icon={ArrowDown01Icon}
        />
      </span>
    )}
  </div>
);

export { SelectNative };
