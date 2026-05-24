"use client";

import { addDays, format, subDays, subMonths, subYears } from "date-fns";
import { useCallback, useMemo } from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "../utils/index";
import { Button } from "./button";
import { Calendar } from "./calendar";

// Named day-count constants to make preset offsets self-documenting.
const ONE_DAY = 1;
const SEVEN_DAYS = 7;
const THIRTY_DAYS = 30;
const NINETY_DAYS = 90;

/** A single preset entry shown in the sidebar. */
type CalendarPreset = {
  name: string;
  value: Date | DateRange;
};

/** Props for {@link CalendarWithPresets}. */
export type CalendarWithPresetsProps = {
  /**
   * The mode of the calendar.
   * @default "single"
   */
  mode?: "single" | "range";

  /**
   * The selected date or date range.
   */
  selected?: Date | DateRange | undefined;

  /**
   * Callback fired when the date or date range changes.
   */
  onSelect?:
    | ((date: Date | undefined) => void)
    | ((range: DateRange | undefined) => void);

  /**
   * The class name for the root element.
   */
  className?: string;

  /**
   * Custom presets to show in the sidebar.
   * If not provided, default presets will be used.
   */
  presets?: CalendarPreset[];

  /**
   * Whether to disable future dates.
   * @default true
   */
  disableFutureDates?: boolean;
};

/**
 * A day-picker calendar with a sidebar of quick-select presets.
 *
 * Combines the react-day-picker `Calendar` with a vertical list of preset
 * buttons so users can jump to common relative dates (today, last 7 days,
 * last month, etc.) in a single click.
 *
 * @remarks
 * - `mode="single"` shows one calendar month and single-date presets
 *   (today, yesterday, last week, last month, last year).
 * - `mode="range"` shows two calendar months side-by-side and range presets
 *   (last 7 / 30 / 90 days, last month, last year).
 * - Supply `presets` to replace the built-in list entirely; both `Date` and
 *   `DateRange` (react-day-picker) values are accepted.
 * - `disableFutureDates` (default `true`) blocks dates after tomorrow via
 *   react-day-picker's `disabled` prop.
 * - `onSelect` is a union type; the caller is responsible for passing the
 *   correct overload that matches the current `mode`.
 * - Preset labels are in Brazilian Portuguese; replace `presets` to localise.
 *
 * @example
 * ```tsx
 * // Single-date picker with default presets
 * <CalendarWithPresets
 *   mode="single"
 *   selected={date}
 *   onSelect={(d) => setDate(d as Date)}
 * />
 *
 * // Range picker with custom presets
 * <CalendarWithPresets
 *   mode="range"
 *   selected={range}
 *   onSelect={(r) => setRange(r as DateRange)}
 *   presets={[
 *     { name: "This week", value: { from: monday, to: today } },
 *   ]}
 * />
 * ```
 */
export function CalendarWithPresets({
  mode = "single",
  selected,
  onSelect,
  className,
  presets,
  disableFutureDates = true,
}: CalendarWithPresetsProps) {
  const today = useMemo(() => new Date(), []);

  const defaultSinglePresets = useMemo(
    () => [
      {
        name: "Hoje",
        value: today,
      },
      {
        name: "Ontem",
        value: subDays(today, ONE_DAY),
      },
      {
        name: "Última semana",
        value: subDays(today, SEVEN_DAYS),
      },
      {
        name: "Último mês",
        value: subMonths(today, 1),
      },
      {
        name: "Último ano",
        value: subYears(today, 1),
      },
    ],
    [today]
  );

  const defaultRangePresets = useMemo(
    () => [
      {
        name: "Hoje",
        value: {
          from: today,
          to: today,
        },
      },
      {
        name: "Ontem",
        value: {
          from: subDays(today, 1),
          to: subDays(today, 1),
        },
      },
      {
        name: "Últimos 7 dias",
        value: {
          from: subDays(today, SEVEN_DAYS),
          to: today,
        },
      },
      {
        name: "Últimos 30 dias",
        value: {
          from: subDays(today, THIRTY_DAYS),
          to: today,
        },
      },
      {
        name: "Últimos 90 dias",
        value: {
          from: subDays(today, NINETY_DAYS),
          to: today,
        },
      },
      {
        name: "Último mês",
        value: {
          from: subMonths(today, 1),
          to: today,
        },
      },
      {
        name: "Último ano",
        value: {
          from: subYears(today, 1),
          to: today,
        },
      },
    ],
    [today]
  );

  const currentPresets = useMemo(
    () =>
      presets ??
      (mode === "single" ? defaultSinglePresets : defaultRangePresets),
    [presets, mode, defaultSinglePresets, defaultRangePresets]
  );

  const handlePresetClick = useCallback(
    (preset: CalendarPreset) => {
      if (onSelect) {
        // TypeScript cannot call a union of function types directly; cast to the
        // common denominator (Date | DateRange | undefined) which both branches accept.
        (onSelect as (value: Date | DateRange | undefined) => void)(
          preset.value
        );
      }
    },
    [onSelect]
  );

  const formatPresetDate = useCallback((preset: CalendarPreset) => {
    if ("from" in preset.value) {
      const { from, to } = preset.value;
      if (!from) {
        return "";
      }
      return `${format(from, "dd/MM/yy")} - ${format(to ?? from, "dd/MM/yy")}`;
    }
    return format(preset.value, "dd/MM/yy");
  }, []);

  const disabledDates = useMemo(
    () =>
      disableFutureDates
        ? [
            {
              after: addDays(today, 1),
            },
          ]
        : undefined,
    [disableFutureDates, today]
  );

  return (
    <div className={cn(className)} data-slot="calendar-with-presets">
      <div className="rounded-md border border-border">
        <div className="flex max-sm:flex-col">
          <div className="relative border-border py-4 max-sm:order-1 max-sm:border-t sm:w-48">
            <div className="h-full border-border sm:border-e">
              <div className="flex flex-col gap-1 px-3">
                {currentPresets.map((preset) => (
                  <Button
                    className="justify-start font-normal"
                    key={preset.name}
                    onClick={() => handlePresetClick(preset)}
                    size="sm"
                    variant="ghost"
                  >
                    <span className="flex flex-col items-start">
                      <span className="text-sm">{preset.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {formatPresetDate(preset)}
                      </span>
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          {mode === "single" ? (
            <Calendar
              className="p-3"
              disabled={disabledDates}
              mode="single"
              numberOfMonths={1}
              onSelect={onSelect as (date: Date | undefined) => void}
              selected={selected as Date | undefined}
            />
          ) : (
            <Calendar
              className="p-3"
              disabled={disabledDates}
              mode="range"
              numberOfMonths={2}
              onSelect={onSelect as (range: DateRange | undefined) => void}
              selected={selected as DateRange | undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
