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
      data-invalid
      data-slot="date-segment"
    />
  );
}

const dateInputStyle =
  "relative inline-flex h-8 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:ring-[3px] has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40";

type DateInputProps = DateInputPropsRac & {
  className?: string;
  unstyled?: boolean;
};

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
