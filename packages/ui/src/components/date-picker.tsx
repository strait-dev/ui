"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId } from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/** Props for the {@link DatePicker} component. */
type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  isRequired?: boolean;
  label?: string;
  className?: string;
  error?: boolean;
};

/**
 * A single-date picker that reveals a calendar in a popover.
 *
 * Composes the design-system {@link Popover} with the react-day-picker
 * `Calendar` (single mode). The trigger button displays the formatted date
 * or a "Select a date" placeholder when no value is set.
 *
 * @remarks
 * - An optional `label` renders above the trigger with an associated `htmlFor`
 *   link; pass `isRequired` to append a red asterisk.
 * - `error=true` applies a destructive border to the trigger.
 * - The component is purely controlled — manage `value` and `onChange` in the
 *   parent. To clear the selection pass `undefined` to `onChange`.
 *
 * @example
 * ```tsx
 * const [date, setDate] = React.useState<Date | undefined>();
 *
 * <DatePicker
 *   label="Due date"
 *   isRequired
 *   value={date}
 *   onChange={setDate}
 * />
 * ```
 */
function DatePicker({
  value,
  onChange,
  disabled,
  isRequired,
  label,
  className,
  error,
}: DatePickerProps) {
  const datePickerId = useId();
  return (
    <div
      className={cn("grid w-full items-center gap-1.5", className)}
      data-slot="date-picker"
    >
      {label ? (
        <label
          className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor={datePickerId}
        >
          {label}
          {isRequired ? <span className="text-destructive">*</span> : null}
        </label>
      ) : null}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              className={cn(
                "h-8 w-full justify-start rounded-lg! bg-transparent px-3 text-left font-normal text-sm shadow-xs hover:bg-transparent",
                !value && "text-muted-foreground/70",
                error ? "border-destructive" : null
              )}
              disabled={disabled}
              id={datePickerId}
              variant="outline"
            />
          }
        >
          <HugeiconsIcon
            className="mr-2 size-4 opacity-60"
            icon={Calendar03Icon}
          />
          {value ? (
            value.toLocaleDateString()
          ) : (
            <span className="font-normal">Select a date</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            autoFocus
            mode="single"
            onSelect={onChange}
            selected={value}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

DatePicker.displayName = "DatePicker";

export { DatePicker, type DatePickerProps };
