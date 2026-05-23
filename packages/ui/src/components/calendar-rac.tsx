"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { ComponentProps } from "react";
import {
  Button,
  CalendarCell as CalendarCellRac,
  CalendarGridBody as CalendarGridBodyRac,
  CalendarGridHeader as CalendarGridHeaderRac,
  CalendarGrid as CalendarGridRac,
  CalendarHeaderCell as CalendarHeaderCellRac,
  Calendar as CalendarRac,
  composeRenderProps,
  Heading as HeadingRac,
  RangeCalendar as RangeCalendarRac,
} from "react-aria-components";
import { cn } from "../utils/index";

type BaseCalendarProps = {
  className?: string;
};

// These types merge the full RAC prop surface with the local className override.
type CalendarProps = ComponentProps<typeof CalendarRac> & BaseCalendarProps;
type RangeCalendarProps = ComponentProps<typeof RangeCalendarRac> &
  BaseCalendarProps;

/** Prev/next navigation header shared by {@link Calendar} and {@link RangeCalendar}. */
function CalendarHeader() {
  return (
    <header className="flex w-full items-center gap-1 pb-1">
      <Button
        className="flex size-9 items-center justify-center rounded-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        slot="previous"
      >
        <HugeiconsIcon className="size-4" icon={ArrowLeft01Icon} />
      </Button>
      <HeadingRac className="grow text-center font-medium text-sm" />
      <Button
        className="flex size-9 items-center justify-center rounded-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        slot="next"
      >
        <HugeiconsIcon className="size-4" icon={ArrowRight01Icon} />
      </Button>
    </header>
  );
}

/**
 * Renders the weekday header row and the day-cell grid.
 *
 * The `isRange` flag switches to range-selection styles: interior cells lose
 * individual rounding, and start/end caps keep rounded corners. An `::after`
 * dot marks today's date; its color inverts when today is selected.
 */
function CalendarGridComponent({ isRange = false }: { isRange?: boolean }) {
  const now = today(getLocalTimeZone());

  return (
    <CalendarGridRac>
      <CalendarGridHeaderRac>
        {(day) => (
          <CalendarHeaderCellRac className="size-9 rounded-md p-0 font-medium text-muted-foreground/80 text-xs">
            {day}
          </CalendarHeaderCellRac>
        )}
      </CalendarGridHeaderRac>
      <CalendarGridBodyRac className="[&_td]:px-0 [&_td]:py-px">
        {(date) => (
          <CalendarCellRac
            className={cn(
              "relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 font-normal text-foreground text-sm outline-none duration-150 [transition-property:color,background-color,border-radius,box-shadow] data-disabled:pointer-events-none data-unavailable:pointer-events-none data-focus-visible:z-10 data-hovered:bg-accent data-selected:bg-primary data-hovered:text-foreground data-selected:text-primary-foreground data-unavailable:line-through data-disabled:opacity-30 data-unavailable:opacity-30 data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50",
              // Range-specific styles
              isRange
                ? "data-invalid:data-selection-end:bg-destructive data-invalid:data-selection-start:bg-destructive data-invalid:data-selection-end:text-destructive-foreground data-invalid:data-selection-start:text-destructive-foreground data-selected:rounded-none data-selection-start:rounded-s-md data-selection-end:rounded-e-md data-invalid:bg-destructive/10 data-selected:bg-accent data-selection-end:bg-primary data-selection-start:bg-primary data-selected:text-foreground data-selection-end:text-primary-foreground data-selection-start:text-primary-foreground"
                : null,
              // Today indicator styles
              date.compare(now) === 0
                ? cn(
                    "after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[3px] after:-translate-x-1/2 after:rounded-md after:bg-primary",
                    isRange
                      ? "data-selection-end:after:bg-background data-selection-start:after:bg-background"
                      : "data-selected:after:bg-background"
                  )
                : null
            )}
            date={date}
          />
        )}
      </CalendarGridBodyRac>
    </CalendarGridRac>
  );
}

/**
 * Single-date calendar built on React Aria Components.
 *
 * Wraps RAC's `Calendar` primitive with a shared {@link CalendarHeader} and
 * {@link CalendarGridComponent}. All RAC `Calendar` props (value, onChange,
 * minValue, maxValue, isDisabled, etc.) are forwarded.
 *
 * @remarks
 * - Uses `@internationalized/date` value types (`CalendarDate`, `ZonedDateTime`,
 *   etc.) rather than native `Date`. Pair with `parseDate` / `toCalendarDate`
 *   to convert.
 * - Keyboard navigation, ARIA roles, and focus management are handled
 *   automatically by RAC.
 * - For range selection use {@link RangeCalendar} instead.
 *
 * @example
 * ```tsx
 * import { parseDate } from "@internationalized/date";
 *
 * <Calendar
 *   value={parseDate("2025-06-01")}
 *   onChange={(d) => console.log(d.toString())}
 * />
 * ```
 */
function Calendar({ className, ...props }: CalendarProps) {
  return (
    <div data-slot="calendar">
      <CalendarRac
        {...props}
        className={composeRenderProps(className, (clsss) => cn("w-fit", clsss))}
      >
        <CalendarHeader />
        <CalendarGridComponent />
      </CalendarRac>
    </div>
  );
}

/**
 * Range-selection calendar built on React Aria Components.
 *
 * Wraps RAC's `RangeCalendar` with the shared {@link CalendarHeader} and
 * enables range-specific cell styles in {@link CalendarGridComponent}
 * (rounded caps on start/end dates, flat background for interior cells,
 * destructive highlight when the selection is invalid).
 *
 * @remarks
 * - Accepts RAC `RangeValue<DateValue>` for `value`/`defaultValue`; use
 *   `parseDate` to create `CalendarDate` values from ISO strings.
 * - Use {@link Calendar} for single-date selection.
 *
 * @example
 * ```tsx
 * import { parseDate } from "@internationalized/date";
 *
 * <RangeCalendar
 *   value={{
 *     start: parseDate("2025-06-01"),
 *     end: parseDate("2025-06-15"),
 *   }}
 *   onChange={({ start, end }) => console.log(start, end)}
 * />
 * ```
 */
function RangeCalendar({ className, ...props }: RangeCalendarProps) {
  return (
    <div data-slot="range-calendar">
      <RangeCalendarRac
        {...props}
        className={composeRenderProps(className, (clsss) => cn("w-fit", clsss))}
      >
        <CalendarHeader />
        <CalendarGridComponent isRange />
      </RangeCalendarRac>
    </div>
  );
}

export { Calendar, RangeCalendar };
