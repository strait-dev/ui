import { cn } from "../utils/index";

/**
 * Props for {@link InputWithAddons}.
 *
 * @remarks
 * `leading` and `trailing` accept any React node — typically a short text
 * label (e.g. `"https://"`, `".com"`) or an icon. Both are optional;
 * omitting both renders a plain bordered input.
 */
export type InputWithAddonsProps = React.ComponentProps<"input"> & {
  /** Content rendered in the muted panel before the input (e.g. `"https://"`
   *  or a currency symbol). Omit to suppress the leading addon. */
  leading?: React.ReactNode;
  /** Content rendered in the muted panel after the input (e.g. `".com"` or a
   *  unit label). Omit to suppress the trailing addon. */
  trailing?: React.ReactNode;
  /** Additional classes merged onto the outer bordered wrapper `<div>`. */
  containerClassName?: string;
};

/**
 * A text input flanked by optional muted addon panels for contextual prefix
 * or suffix labels (e.g. protocol, domain extension, or unit).
 *
 * @remarks
 * Renders a single bordered container (`group`) that holds up to three
 * children in a horizontal row:
 * - An optional `leading` addon — a muted panel separated from the input by
 *   a right border.
 * - The `<input>` element itself — transparent background, full remaining
 *   width.
 * - An optional `trailing` addon — a muted panel separated from the input
 *   by a left border.
 *
 * Focus ring and border styling are applied to the outer wrapper via
 * `focus-within`, so only a single ring appears regardless of which child
 * has focus.
 *
 * @example
 * ```tsx
 * <InputWithAddons
 *   leading="https://"
 *   trailing=".com"
 *   placeholder="yoursite"
 * />
 * ```
 */
function InputWithAddons({
  leading,
  trailing,
  containerClassName,
  className,
  ...props
}: InputWithAddonsProps) {
  return (
    <div
      className={cn(
        "group flex h-8 w-full overflow-hidden rounded-lg border border-input bg-input/20 text-sm transition-[color,box-shadow] focus-within:border-ring focus-within:outline-hidden focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
        containerClassName
      )}
      data-slot="input-with-addons"
    >
      {leading ? (
        <div
          className="border-input border-r bg-muted px-3 py-2"
          data-slot="leading-addon"
        >
          {leading}
        </div>
      ) : null}
      <input
        className={cn(
          "w-full rounded-md bg-transparent px-3 py-2 placeholder:text-muted-foreground focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        data-slot="input"
        {...props}
      />
      {trailing ? (
        <div
          className="border-input border-l bg-muted px-3 py-2"
          data-slot="trailing-addon"
        >
          {trailing}
        </div>
      ) : null}
    </div>
  );
}

export { InputWithAddons };
