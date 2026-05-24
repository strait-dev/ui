"use client";

import { Input, type InputProps } from "../components/input";
import { cn } from "../utils/index";

/**
 * Props for {@link InputWithStartIcon}.
 *
 * @remarks
 * `icon` accepts any React node; it is rendered in a non-interactive,
 * pointer-events-disabled overlay at the leading edge.
 */
export type InputWithStartIconProps = InputProps & {
  icon?: React.ReactNode;
  label?: string;
  containerClassName?: string;
};

/**
 * A text input with a decorative, non-interactive icon pinned to the
 * leading edge — the standard pattern for search bars and filtered inputs.
 *
 * @remarks
 * Composes the `Input` primitive in a relative container with an absolutely-
 * positioned icon overlay. The icon container is `pointer-events-none` so it
 * never intercepts clicks or focus, and it fades via `peer-disabled:opacity-50`
 * when the sibling input is disabled.
 *
 * An optional `label` prop renders a `<label>` linked via `htmlFor={id}`;
 * when `label` is omitted, callers should provide an `aria-label` or
 * associate a separate label element to maintain accessibility.
 *
 * @example
 * ```tsx
 * <InputWithStartIcon
 *   id="search"
 *   icon={<SearchIcon />}
 *   label="Search"
 *   placeholder="Search…"
 * />
 * ```
 */
function InputWithStartIcon({
  className,
  icon,
  label,
  containerClassName,
  ...props
}: InputWithStartIconProps) {
  return (
    <div className="flex flex-col gap-2" data-slot="input-with-start-icon">
      {label ? (
        <label
          className="font-medium text-foreground text-sm"
          data-slot="label"
          htmlFor={props.id}
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn("relative", containerClassName)}
        data-slot="input-container"
      >
        <Input
          className={cn("peer ps-9", className)}
          data-slot="input"
          {...props}
        />
        <div
          className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50"
          data-slot="icon"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export { InputWithStartIcon };
