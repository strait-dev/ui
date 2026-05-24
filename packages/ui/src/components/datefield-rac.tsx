"use client";

import {
  composeRenderProps,
  type DateFieldProps,
  DateField as DateFieldRac,
  type DateInputProps as DateInputPropsRac,
  DateInput as DateInputRac,
  type DateSegmentProps,
  DateSegment as DateSegmentRac,
  type DateValue as DateValueRac,
  type TimeFieldProps,
  TimeField as TimeFieldRac,
  type TimeValue as TimeValueRac,
} from "react-aria-components";
import { cn } from "../utils/index";

/**
 * An accessible date field that renders each date part (year, month,
 * day) as individually focusable, spinnable segments.
 *
 * @remarks
 * A thin wrapper around React Aria Components `DateField`. Wraps the
 * primitive in a `<div data-slot="date-field">` for slot-based
 * styling and forwards all `DateFieldProps`. Compose with
 * {@link DateInput} (which renders the segments via
 * {@link DateSegment}) and optionally a `<Label>` / `<FieldError>`
 * from React Aria.
 *
 * @example
 * ```tsx
 * <DateField value={date} onChange={setDate}>
 *   <Label>Start date</Label>
 *   <DateInput />
 * </DateField>
 * ```
 */
function DateField<T extends DateValueRac>({
  className,
  children,
  ...props
}: DateFieldProps<T>) {
  return (
    <div data-slot="date-field">
      <DateFieldRac
        className={composeRenderProps(className, (clssname) => cn(clssname))}
        {...props}
      >
        {children}
      </DateFieldRac>
    </div>
  );
}

/**
 * An accessible time field that renders hour, minute, second, and
 * AM/PM as individually focusable, spinnable segments.
 *
 * @remarks
 * Mirrors the structure of {@link DateField} but wraps React Aria's
 * `TimeField`. Compose with {@link DateInput} for the segment
 * display.
 *
 * @example
 * ```tsx
 * <TimeField value={time} onChange={setTime}>
 *   <Label>Meeting time</Label>
 *   <DateInput />
 * </TimeField>
 * ```
 */
function TimeField<T extends TimeValueRac>({
  className,
  children,
  ...props
}: TimeFieldProps<T>) {
  return (
    <div data-slot="time-field">
      <TimeFieldRac
        className={composeRenderProps(className, (clssname) => cn(clssname))}
        {...props}
      >
        {children}
      </TimeFieldRac>
    </div>
  );
}

/**
 * A single editable segment (e.g. month, day, year, hour) inside a
 * {@link DateInput}; handles focus, placeholder, and validation
 * highlight styles.
 *
 * @remarks
 * Literal segments such as `/` or `:` receive `data-[type=literal]`
 * which removes padding and dims the colour so only the editable
 * parts stand out.
 */
function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <DateSegmentRac
      className={composeRenderProps(className, (clssname) =>
        cn(
          "inline rounded-md p-0.5 text-foreground caret-transparent outline-hidden data-invalid:data-focused:bg-destructive data-focused:data-placeholder:text-foreground data-invalid:data-focused:text-destructive-foreground data-invalid:data-placeholder:text-destructive data-disabled:cursor-not-allowed data-focused:bg-accent data-[type=literal]:px-0 data-[type=literal]:text-muted-foreground/70 data-focused:text-foreground data-invalid:data-focused:data-placeholder:text-destructive-foreground data-invalid:text-destructive data-placeholder:text-muted-foreground/70 data-disabled:opacity-50",
          clssname
        )
      )}
      {...props}
      data-slot="date-segment"
    />
  );
}

/**
 * Shared Tailwind class string for the date/time input container.
 *
 * Exported so consumers can apply the same look to a custom wrapper
 * without re-deriving the class list.
 */
const dateInputStyle =
  "relative inline-flex h-8 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:ring-3 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40";

/** Props for {@link DateInput}. */
type DateInputProps = DateInputPropsRac & {
  className?: string;
  unstyled?: boolean;
};

/**
 * The styled segment container for a {@link DateField} or
 * {@link TimeField}; renders each date/time part via
 * {@link DateSegment}.
 *
 * @remarks
 * Automatically maps over every segment provided by React Aria and
 * renders a {@link DateSegment} for each. Pass `unstyled` to opt out
 * of the default {@link dateInputStyle} base classes when embedding
 * the input inside a custom container.
 *
 * @example
 * ```tsx
 * <DateField>
 *   <DateInput />
 * </DateField>
 * ```
 */
function DateInput({
  className,
  unstyled = false,
  ...props
}: Omit<DateInputProps, "children">) {
  return (
    <div data-slot="date-input">
      <DateInputRac
        className={composeRenderProps(className, (clssname) =>
          cn(!unstyled && dateInputStyle, clssname)
        )}
        {...props}
      >
        {(segment) => <DateSegment segment={segment} />}
      </DateInputRac>
    </div>
  );
}

export type { DateInputProps };
export { DateField, DateInput, DateSegment, dateInputStyle, TimeField };
