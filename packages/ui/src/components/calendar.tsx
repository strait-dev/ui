"use client";

import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
  type Locale,
} from "react-day-picker";
import { cn } from "../utils/index";
import { Button, buttonVariants } from "./button";

/** Props for {@link Calendar}. */
export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  /**
   * {@link Button} `variant` applied to the previous/next navigation
   * buttons. Defaults to `"ghost"`.
   */
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};

/**
 * A styled date-picker calendar built on top of `react-day-picker`'s
 * `DayPicker`.
 *
 * Supports single-date, range, and multi-date selection modes (via
 * the `mode` prop passed through to `DayPicker`).
 *
 * @remarks
 * - `captionLayout` (`"label"` | `"dropdown"` | `"dropdown-months"`
 *   | `"dropdown-years"`) controls whether the month/year caption
 *   renders as plain text or native `<select>` dropdowns.
 * - `buttonVariant` customises the appearance of the previous/next
 *   navigation buttons (any {@link Button} `variant` is valid).
 * - `locale` accepts a `react-day-picker` `Partial<Locale>` object;
 *   it is also forwarded to `CalendarDayButton` so day cells display
 *   the correct locale-formatted date attribute.
 * - Day cells are rendered by {@link CalendarDayButton}; pass a
 *   custom `components.DayButton` to override them.
 * - Range selection applies `range_start`, `range_middle`, and
 *   `range_end` modifier classes; the pseudo-element
 *   `after:` fills the gap between edge cells and the track.
 * - RTL: previous/next chevrons are automatically flipped via Tailwind
 *   `rtl:` variants so no extra work is needed for RTL locales.
 *
 * @example
 * ```tsx
 * // Single date (uncontrolled)
 * <Calendar mode="single" />
 *
 * // Date range (controlled)
 * <Calendar
 *   mode="range"
 *   selected={range}
 *   onSelect={setRange}
 *   numberOfMonths={2}
 * />
 * ```
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      captionLayout={captionLayout}
      className={cn(
        // CSS custom properties shared by all sub-parts for consistent
        // sizing without prop drilling.
        "group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)]",
        // String.raw preserves the backslash-escaped class name that
        // Tailwind needs to target the rdp-button elements in RTL mode.
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-medium text-sm",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
          defaultClassNames.caption_label
        ),
        month_grid: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-(--cell-radius) font-normal text-[0.8rem] text-muted-foreground",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "select-none text-[0.8rem] text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none rounded-(--cell-radius) p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div
            className={cn(className)}
            data-slot="calendar"
            ref={rootRef}
            {...props}
          />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <HugeiconsIcon
                className={cn("size-4", className)}
                icon={ArrowLeftIcon}
                strokeWidth={2}
                {...props}
              />
            );
          }

          if (orientation === "right") {
            return (
              <HugeiconsIcon
                className={cn("size-4", className)}
                icon={ArrowRightIcon}
                strokeWidth={2}
                {...props}
              />
            );
          }

          return (
            <HugeiconsIcon
              className={cn("size-4", className)}
              icon={ArrowDownIcon}
              strokeWidth={2}
              {...props}
            />
          );
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      locale={locale}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

/**
 * Individual day cell rendered inside {@link Calendar}.
 *
 * Wraps a {@link Button} and bridges `react-day-picker`'s `modifiers`
 * to `data-*` attributes so Tailwind variant selectors apply the
 * correct range / selected / focused styles.
 *
 * @remarks
 * - `data-range-start`, `data-range-middle`, and `data-range-end` are
 *   set from `modifiers` to drive range-highlight styles.
 * - `data-selected-single` is `true` when the day is selected but is
 *   not part of a range (single-date mode or endpoints coincide).
 * - When `modifiers.focused` is `true`, the button is imperatively
 *   focused via a ref so keyboard navigation inside the month grid
 *   works correctly — `react-day-picker` manages focus state, but the
 *   DOM focus must follow.
 * - `locale` is forwarded to format the `data-day` attribute for
 *   screen readers.
 *
 * Export this component to override only the day-button rendering
 * while keeping all other {@link Calendar} structure intact.
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  // react-day-picker sets modifiers.focused when keyboard focus should
  // move to this cell; we imperative-focus to keep DOM focus in sync.
  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <Button
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-normal leading-none data-[range-end=true]:rounded-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-end=true]:bg-primary data-[range-middle=true]:bg-muted data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:text-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-3 group-data-[focused=true]/day:ring-ring/50 dark:hover:text-foreground [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      size="icon"
      variant="ghost"
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
