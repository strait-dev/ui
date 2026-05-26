"use client";

import {
  ArrowLeft01Icon,
  ArrowMoveUpLeftIcon,
  ArrowMoveUpRightIcon,
  ArrowRight01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  addMonths,
  format,
  isBefore,
  isSameMonth,
  parse,
  subMonths,
} from "date-fns";
import {
  type ChangeEvent,
  type ComponentProps,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DateRange, DayButton } from "react-day-picker";

import { useIsMobile } from "../hooks/use-mobile";
import { cn } from "../utils/index";
import { Button } from "./button";
import { Calendar, CalendarDayButton } from "./calendar";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

/* ------------------------------------------------------------------ */
/* i18n                                                               */
/* ------------------------------------------------------------------ */

/** Localisable labels for every part of {@link DateSelector}. */
export interface DateSelectorI18nConfig {
  /** Label for the apply action. */
  apply: string;
  /** Label for the cancel action. */
  cancel: string;
  /** Label for the clear action. */
  clear: string;
  /** Labels for the operator tabs (`is` / `before` / `after` / `between`). */
  filterTypes: {
    is: string;
    before: string;
    after: string;
    between: string;
  };
  /** Half-year labels, H1 first. */
  halfYears: string[];
  /** Full month names, January first. */
  months: string[];
  /** Abbreviated month names, Jan first. */
  monthsShort: string[];
  /** Labels for the period tabs (`day` / `month` / … / `year`). */
  periodTypes: {
    day: string;
    month: string;
    quarter: string;
    halfYear: string;
    year: string;
  };
  /** Placeholder shown in the text input. */
  placeholder: string;
  /** Quarter labels, Q1 first. */
  quarters: string[];
  /** Placeholder shown in the text input while picking a range. */
  rangePlaceholder: string;
  /** Accessible label for the selector as a whole. */
  selectDate: string;
  /** Label for the "jump to today" navigation button. */
  today: string;
  /** Full weekday names, Sunday first. */
  weekdays: string[];
  /** Abbreviated weekday names, Su first. */
  weekdaysShort: string[];
}

/** Default English {@link DateSelectorI18nConfig}. */
export const DEFAULT_DATE_SELECTOR_I18N: DateSelectorI18nConfig = {
  selectDate: "Select date",
  apply: "Apply",
  cancel: "Cancel",
  clear: "Clear",
  today: "Today",
  filterTypes: {
    is: "is",
    before: "before",
    after: "after",
    between: "between",
  },
  periodTypes: {
    day: "Day",
    month: "Month",
    quarter: "Quarter",
    halfYear: "Half-year",
    year: "Year",
  },
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthsShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  quarters: ["Q1", "Q2", "Q3", "Q4"],
  halfYears: ["H1", "H2"],
  weekdays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  placeholder: "Select date...",
  rangePlaceholder: "Select date range...",
};

/* ------------------------------------------------------------------ */
/* Value model                                                        */
/* ------------------------------------------------------------------ */

/** The granularity a {@link DateSelector} is currently selecting. */
export type DateSelectorPeriodType =
  | "day"
  | "month"
  | "quarter"
  | "half-year"
  | "year";

/** The comparison operator a {@link DateSelector} is currently applying. */
export type DateSelectorFilterType = "is" | "before" | "after" | "between";

/** A single point within a period range (e.g. a `{ year, month }` cell). */
export interface DateSelectorRangePoint {
  /** The zero-based index within the period (month/quarter/half-year). */
  value: number;
  /** The calendar year of the point. */
  year: number;
}

/** The full controlled value of a {@link DateSelector}. */
export interface DateSelectorValue {
  /** End day (day period, `between` operator). */
  endDate?: Date;
  /** Selected zero-based half-year index (half-year period). */
  halfYear?: number;
  /** Selected zero-based month index (month period). */
  month?: number;
  /** The active comparison operator. */
  operator: DateSelectorFilterType;
  /** The active granularity. */
  period: DateSelectorPeriodType;
  /** Selected zero-based quarter index (quarter period). */
  quarter?: number;
  /** Range end cell (non-day periods, `between` operator). */
  rangeEnd?: DateSelectorRangePoint;
  /** Range start cell (non-day periods, `between` operator). */
  rangeStart?: DateSelectorRangePoint;
  /** Start day (day period). */
  startDate?: Date;
  /** Selected year (month/quarter/half-year/year periods). */
  year?: number;
}

/* ------------------------------------------------------------------ */
/* Context                                                            */
/* ------------------------------------------------------------------ */

interface DateSelectorContextValue {
  i18n: DateSelectorI18nConfig;
}

const DateSelectorContext = createContext<DateSelectorContextValue>({
  i18n: DEFAULT_DATE_SELECTOR_I18N,
});

/** Reads the resolved i18n config from the nearest {@link DateSelector}. */
export const useDateSelectorContext = () => useContext(DateSelectorContext);

/* ------------------------------------------------------------------ */
/* Formatting                                                         */
/* ------------------------------------------------------------------ */

function formatDay(value: DateSelectorValue, dayDateFormat: string): string {
  const { startDate, endDate } = value;
  if (startDate && endDate) {
    return `${format(startDate, dayDateFormat)} - ${format(endDate, dayDateFormat)}`;
  }
  if (startDate) {
    return format(startDate, dayDateFormat);
  }
  return "";
}

function formatIndexed(
  value: DateSelectorValue,
  items: string[],
  singleValue: number | undefined
): string {
  const { year, rangeStart, rangeEnd } = value;
  if (rangeStart && rangeEnd) {
    return `${items[rangeStart.value]} ${rangeStart.year} - ${items[rangeEnd.value]} ${rangeEnd.year}`;
  }
  if (year !== undefined && singleValue !== undefined) {
    return `${items[singleValue]} ${year}`;
  }
  return "";
}

function formatYear(value: DateSelectorValue): string {
  const { year, rangeStart, rangeEnd } = value;
  if (rangeStart && rangeEnd) {
    return `${rangeStart.year} - ${rangeEnd.year}`;
  }
  if (year !== undefined) {
    return `${year}`;
  }
  return "";
}

/** Renders a {@link DateSelectorValue} as a human-readable string. */
export function formatDateValue(
  value: DateSelectorValue,
  i18n: DateSelectorI18nConfig = DEFAULT_DATE_SELECTOR_I18N,
  dayDateFormat = "MM/dd/yyyy"
): string {
  switch (value.period) {
    case "day":
      return formatDay(value, dayDateFormat);
    case "month":
      return formatIndexed(value, i18n.monthsShort, value.month);
    case "quarter":
      return formatIndexed(value, i18n.quarters, value.quarter);
    case "half-year":
      return formatIndexed(value, i18n.halfYears, value.halfYear);
    case "year":
      return formatYear(value);
    default:
      return "";
  }
}

/* ------------------------------------------------------------------ */
/* useDateSelector                                                    */
/* ------------------------------------------------------------------ */

interface UseDateSelectorOptions {
  allowRange?: boolean;
  baseYear?: number;
  defaultFilterType?: DateSelectorFilterType;
  defaultPeriodType?: DateSelectorPeriodType;
  maxYear?: number;
  minYear?: number;
  onChange?: (value: DateSelectorValue) => void;
  periodTypes?: DateSelectorPeriodType[];
  presetMode?: DateSelectorFilterType;
  value?: DateSelectorValue;
  yearRange?: number;
}

/**
 * Headless state machine powering {@link DateSelector}. Returns the current
 * selection, derived helpers (year list, range tests), and the action handlers
 * that the presentational parts call. Use it directly to build a custom layout.
 */
export function useDateSelector({
  value,
  onChange,
  defaultPeriodType = "day",
  defaultFilterType = "is",
  presetMode,
  allowRange = true,
  yearRange = 11,
  baseYear,
  minYear,
  maxYear,
  periodTypes,
}: UseDateSelectorOptions) {
  const currentYear = baseYear ?? new Date().getFullYear();

  const validDefaultPeriodType = useMemo(() => {
    if (!periodTypes || periodTypes.length === 0) {
      return defaultPeriodType;
    }
    if (periodTypes.includes(defaultPeriodType)) {
      return defaultPeriodType;
    }
    return periodTypes[0] ?? defaultPeriodType;
  }, [periodTypes, defaultPeriodType]);

  const effectiveFilterType =
    presetMode ?? value?.operator ?? defaultFilterType;

  const [periodType, setPeriodType] = useState<DateSelectorPeriodType>(
    value?.period || validDefaultPeriodType
  );
  const [filterType, setFilterType] =
    useState<DateSelectorFilterType>(effectiveFilterType);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value?.startDate
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    value?.endDate
  );
  const [calendarMonth, setCalendarMonth] = useState(
    value?.startDate || new Date()
  );
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    value?.year
  );
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    value?.month
  );
  const [selectedQuarter, setSelectedQuarter] = useState<number | undefined>(
    value?.quarter
  );
  const [selectedHalfYear, setSelectedHalfYear] = useState<number | undefined>(
    value?.halfYear
  );
  const [rangeStart, setRangeStart] = useState<
    DateSelectorRangePoint | undefined
  >(value?.rangeStart);
  const [rangeEnd, setRangeEnd] = useState<DateSelectorRangePoint | undefined>(
    value?.rangeEnd
  );
  const [hoverDate, setHoverDate] = useState<Date | undefined>();

  const years = useMemo(() => {
    if (minYear !== undefined && maxYear !== undefined) {
      return Array.from(
        { length: maxYear - minYear + 1 },
        (_, i) => minYear + i
      );
    }
    return Array.from(
      { length: yearRange },
      (_, i) => currentYear - Math.floor(yearRange / 2) + i
    );
  }, [currentYear, yearRange, minYear, maxYear]);

  const currentValue = useMemo<DateSelectorValue>(
    () => ({
      period: periodType,
      operator: presetMode ?? filterType,
      startDate: selectedDate,
      endDate: selectedEndDate,
      year: selectedYear,
      month: selectedMonth,
      quarter: selectedQuarter,
      halfYear: selectedHalfYear,
      rangeStart,
      rangeEnd,
    }),
    [
      periodType,
      presetMode,
      filterType,
      selectedDate,
      selectedEndDate,
      selectedYear,
      selectedMonth,
      selectedQuarter,
      selectedHalfYear,
      rangeStart,
      rangeEnd,
    ]
  );

  const clearSelection = useCallback(() => {
    setSelectedDate(undefined);
    setSelectedEndDate(undefined);
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
    setSelectedQuarter(undefined);
    setSelectedHalfYear(undefined);
    setRangeStart(undefined);
    setRangeEnd(undefined);
  }, []);

  const handleDayClick = useCallback(
    (day: Date) => {
      if (!(filterType === "between" && allowRange)) {
        setSelectedDate(day);
        setSelectedEndDate(undefined);
        return;
      }
      if (!selectedDate || (selectedDate && selectedEndDate)) {
        setSelectedDate(day);
        setSelectedEndDate(undefined);
      } else if (isBefore(day, selectedDate)) {
        setSelectedEndDate(selectedDate);
        setSelectedDate(day);
      } else {
        setSelectedEndDate(day);
      }
    },
    [filterType, allowRange, selectedDate, selectedEndDate]
  );

  const setSinglePeriodValue = useCallback(
    (type: DateSelectorPeriodType, periodValue: number) => {
      if (type === "month") {
        setSelectedMonth(periodValue);
      }
      if (type === "quarter") {
        setSelectedQuarter(periodValue);
      }
      if (type === "half-year") {
        setSelectedHalfYear(periodValue);
      }
    },
    []
  );

  const handlePeriodSelect = useCallback(
    (year: number, periodValue: number) => {
      if (!(filterType === "between" && allowRange)) {
        setSelectedYear(year);
        setSinglePeriodValue(periodType, periodValue);
        setRangeStart(undefined);
        setRangeEnd(undefined);
        return;
      }
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart({ year, value: periodValue });
        setRangeEnd(undefined);
        setSelectedYear(year);
        setSinglePeriodValue(periodType, periodValue);
        return;
      }
      const startKey = rangeStart.year * 100 + rangeStart.value;
      const endKey = year * 100 + periodValue;
      if (endKey < startKey) {
        setRangeEnd(rangeStart);
        setRangeStart({ year, value: periodValue });
      } else {
        setRangeEnd({ year, value: periodValue });
      }
    },
    [
      filterType,
      allowRange,
      rangeStart,
      rangeEnd,
      periodType,
      setSinglePeriodValue,
    ]
  );

  const handleYearSelect = useCallback(
    (year: number) => {
      if (!(filterType === "between" && allowRange)) {
        setSelectedYear(year);
        setRangeStart(undefined);
        setRangeEnd(undefined);
        return;
      }
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart({ year, value: 0 });
        setRangeEnd(undefined);
        setSelectedYear(year);
      } else if (year < rangeStart.year) {
        setRangeEnd(rangeStart);
        setRangeStart({ year, value: 0 });
      } else {
        setRangeEnd({ year, value: 0 });
      }
    },
    [filterType, allowRange, rangeStart, rangeEnd]
  );

  const handlePeriodTypeChange = useCallback(
    (type: DateSelectorPeriodType) => {
      setPeriodType(type);
      clearSelection();
    },
    [clearSelection]
  );

  const handleFilterTypeChange = useCallback(
    (type: DateSelectorFilterType) => {
      if (presetMode !== undefined) {
        return;
      }
      setFilterType(type);
      clearSelection();
    },
    [clearSelection, presetMode]
  );

  const isInRange = useCallback(
    (year: number, periodValue: number) => {
      if (!(rangeStart && rangeEnd)) {
        return false;
      }
      const key = year * 100 + periodValue;
      const startKey = rangeStart.year * 100 + rangeStart.value;
      const endKey = rangeEnd.year * 100 + rangeEnd.value;
      return key >= startKey && key <= endKey;
    },
    [rangeStart, rangeEnd]
  );

  const isYearInRange = useCallback(
    (year: number) => {
      if (!(rangeStart && rangeEnd)) {
        return false;
      }
      return year >= rangeStart.year && year <= rangeEnd.year;
    },
    [rangeStart, rangeEnd]
  );

  useEffect(() => {
    if (!value) {
      return;
    }
    setPeriodType(value.period || validDefaultPeriodType);
    setFilterType(presetMode ?? value.operator ?? defaultFilterType);
    setSelectedDate(value.startDate);
    setSelectedEndDate(value.endDate);
    setSelectedYear(value.year);
    setSelectedMonth(value.month);
    setSelectedQuarter(value.quarter);
    setSelectedHalfYear(value.halfYear);
    setRangeStart(value.rangeStart);
    setRangeEnd(value.rangeEnd);
  }, [value, validDefaultPeriodType, defaultFilterType, presetMode]);

  useEffect(() => {
    if (presetMode !== undefined) {
      setFilterType(presetMode);
    }
  }, [presetMode]);

  useEffect(() => {
    onChange?.(currentValue);
  }, [currentValue, onChange]);

  return {
    periodType,
    filterType,
    selectedDate,
    selectedEndDate,
    calendarMonth,
    selectedYear,
    selectedMonth,
    selectedQuarter,
    selectedHalfYear,
    rangeStart,
    rangeEnd,
    hoverDate,
    years,
    currentValue,
    allowRange,
    setPeriodType: handlePeriodTypeChange,
    setFilterType: handleFilterTypeChange,
    setSelectedDate,
    setSelectedEndDate,
    setCalendarMonth,
    setHoverDate,
    clearSelection,
    handleDayClick,
    handlePeriodSelect,
    handleYearSelect,
    isInRange,
    isYearInRange,
  };
}

/* ------------------------------------------------------------------ */
/* Operator tabs                                                      */
/* ------------------------------------------------------------------ */

function DateSelectorFilterToggle({
  value,
  onChange,
  showBetween = true,
  className,
}: {
  value: DateSelectorFilterType;
  onChange: (value: DateSelectorFilterType) => void;
  showBetween?: boolean;
  className?: string;
}) {
  const { i18n } = useDateSelectorContext();

  return (
    <Tabs
      className={className}
      data-slot="date-selector-operators"
      onValueChange={(newValue) => {
        if (newValue) {
          onChange(newValue as DateSelectorFilterType);
        }
      }}
      value={value}
    >
      <TabsList>
        <TabsTrigger
          aria-label={i18n.filterTypes.is}
          className="py-1 font-normal"
          value="is"
        >
          {i18n.filterTypes.is}
        </TabsTrigger>
        <TabsTrigger
          aria-label={i18n.filterTypes.before}
          className="py-1 font-normal"
          value="before"
        >
          {i18n.filterTypes.before}
        </TabsTrigger>
        <TabsTrigger
          aria-label={i18n.filterTypes.after}
          className="py-1 font-normal"
          value="after"
        >
          {i18n.filterTypes.after}
        </TabsTrigger>
        {showBetween && (
          <TabsTrigger
            aria-label={i18n.filterTypes.between}
            className="py-1 font-normal"
            value="between"
          >
            {i18n.filterTypes.between}
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
}

/* ------------------------------------------------------------------ */
/* Period tabs + day navigation                                       */
/* ------------------------------------------------------------------ */

function DayMonthNav({
  calendarMonth,
  onMonthChange,
}: {
  calendarMonth: Date;
  onMonthChange: (date: Date) => void;
}) {
  const { i18n } = useDateSelectorContext();
  const today = new Date();
  const isCurrentMonth = isSameMonth(calendarMonth, today);
  const isFuture = calendarMonth > today;

  return (
    <div className="flex items-center">
      {!isCurrentMonth && (
        <Button
          onClick={() => onMonthChange(new Date())}
          size="icon-sm"
          title={i18n.today}
          variant="ghost"
        >
          <HugeiconsIcon
            icon={isFuture ? ArrowMoveUpLeftIcon : ArrowMoveUpRightIcon}
            strokeWidth={2}
          />
        </Button>
      )}
      <Button
        aria-label="Previous month"
        onClick={() => onMonthChange(subMonths(calendarMonth, 1))}
        size="icon-sm"
        variant="ghost"
      >
        <HugeiconsIcon
          className="size-4"
          icon={ArrowLeft01Icon}
          strokeWidth={2}
        />
      </Button>
      <Button
        aria-label="Next month"
        onClick={() => onMonthChange(addMonths(calendarMonth, 1))}
        size="icon-sm"
        variant="ghost"
      >
        <HugeiconsIcon
          className="size-4"
          icon={ArrowRight01Icon}
          strokeWidth={2}
        />
      </Button>
    </div>
  );
}

function DateSelectorPeriodTabs({
  value,
  onChange,
  periodTypes,
  className,
  calendarMonth,
  onMonthChange,
  showNavigationButtons = false,
}: {
  value: DateSelectorPeriodType;
  onChange: (value: DateSelectorPeriodType) => void;
  periodTypes?: DateSelectorPeriodType[];
  className?: string;
  calendarMonth?: Date;
  onMonthChange?: (date: Date) => void;
  showNavigationButtons?: boolean;
}) {
  const { i18n } = useDateSelectorContext();

  const tabs: { value: DateSelectorPeriodType; label: string }[] = [
    { value: "day", label: i18n.periodTypes.day },
    { value: "month", label: i18n.periodTypes.month },
    { value: "quarter", label: i18n.periodTypes.quarter },
    { value: "half-year", label: i18n.periodTypes.halfYear },
    { value: "year", label: i18n.periodTypes.year },
  ];

  const filteredTabs = periodTypes
    ? tabs.filter((tab) => periodTypes.includes(tab.value))
    : tabs;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        className
      )}
      data-slot="date-selector-periods"
    >
      <Tabs
        onValueChange={(newValue) => {
          if (newValue) {
            onChange(newValue as DateSelectorPeriodType);
          }
        }}
        value={value}
      >
        <TabsList>
          {filteredTabs.map((tab) => (
            <TabsTrigger
              aria-label={tab.label}
              className="px-1 py-1 font-normal sm:px-2.5"
              key={tab.value}
              value={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {showNavigationButtons &&
        value === "day" &&
        calendarMonth &&
        onMonthChange && (
          <DayMonthNav
            calendarMonth={calendarMonth}
            onMonthChange={onMonthChange}
          />
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Day picker                                                         */
/* ------------------------------------------------------------------ */

function DateSelectorDayPicker({
  currentMonth,
  selectedDate,
  selectedEndDate,
  onDayClick,
  isRange,
  onDayHover,
  hoverDate,
  showTwoMonths = true,
  weekStartsOn,
  className,
}: {
  currentMonth: Date;
  selectedDate?: Date;
  selectedEndDate?: Date;
  onDayClick: (day: Date) => void;
  isRange: boolean;
  onDayHover?: (day: Date | undefined) => void;
  hoverDate?: Date;
  showTwoMonths?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}) {
  const { i18n } = useDateSelectorContext();
  const isMobile = useIsMobile();

  let selected: Date | DateRange | undefined;
  if (isRange) {
    if (selectedDate && selectedEndDate) {
      selected = { from: selectedDate, to: selectedEndDate };
    } else if (selectedDate) {
      selected = { from: selectedDate, to: hoverDate || selectedDate };
    }
  } else {
    selected = selectedDate;
  }

  const handleSelect = (date: Date | DateRange | undefined) => {
    if (!date) {
      return;
    }
    if (isRange && "from" in date) {
      if (date.from && !date.to) {
        onDayClick(date.from);
      } else if (date.from && date.to) {
        onDayClick(date.to);
      }
    } else if (!isRange && date instanceof Date) {
      onDayClick(date);
    }
  };

  const CustomDayButton = useCallback(
    (props: ComponentProps<typeof DayButton>) => (
      <CalendarDayButton
        {...props}
        onMouseEnter={() => {
          if (isRange && onDayHover && props.day) {
            onDayHover(props.day.date);
          }
        }}
        onMouseLeave={() => {
          if (isRange && onDayHover) {
            onDayHover(undefined);
          }
        }}
      />
    ),
    [isRange, onDayHover]
  );

  const formatters = {
    formatWeekdayName: (date: Date) => {
      const dayIndex = date.getDay();
      return i18n.weekdaysShort[dayIndex] ?? i18n.weekdays[dayIndex] ?? "";
    },
    formatMonthCaption: (date: Date) =>
      `${i18n.months[date.getMonth()]} ${date.getFullYear()}`,
  };

  const numberOfMonths = !isMobile && showTwoMonths ? 2 : 1;
  const calendarClassNames = {
    months: "flex flex-wrap items-start justify-between gap-5 w-full",
    month: "flex flex-col items-center min-w-0 flex-1",
    nav: "hidden",
  };

  return (
    <div
      className={cn("flex w-full items-center justify-between", className)}
      data-slot="date-selector-days"
    >
      {isRange ? (
        <Calendar
          className="w-full shrink-0 p-0"
          classNames={calendarClassNames}
          components={{ DayButton: CustomDayButton }}
          formatters={formatters}
          mode="range"
          month={currentMonth}
          numberOfMonths={numberOfMonths}
          onSelect={handleSelect as (range: DateRange | undefined) => void}
          selected={selected as DateRange | undefined}
          showOutsideDays={true}
          weekStartsOn={weekStartsOn}
        />
      ) : (
        <Calendar
          className="w-full shrink-0 p-0"
          classNames={calendarClassNames}
          components={{ DayButton: CustomDayButton }}
          formatters={formatters}
          mode="single"
          month={currentMonth}
          numberOfMonths={numberOfMonths}
          onSelect={handleSelect as (date: Date | undefined) => void}
          selected={selected as Date | undefined}
          showOutsideDays={true}
          weekStartsOn={weekStartsOn}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Period grid + year list                                            */
/* ------------------------------------------------------------------ */

function DateSelectorPeriodGrid({
  years,
  items,
  selectedYear,
  selectedValue,
  rangeStart,
  rangeEnd,
  isInRange,
  onSelect,
  columns,
  className,
}: {
  years: number[];
  items: string[];
  selectedYear?: number;
  selectedValue?: number;
  rangeStart?: DateSelectorRangePoint;
  rangeEnd?: DateSelectorRangePoint;
  isInRange: (year: number, value: number) => boolean;
  onSelect: (year: number, value: number) => void;
  columns: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full space-y-6", className)}>
      {years.map((year) => (
        <div key={year}>
          <div className="mb-3 font-medium text-muted-foreground text-sm">
            {year}
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item, index) => {
              const isSelected =
                selectedYear === year && selectedValue === index;
              const isRangeStart =
                rangeStart?.year === year && rangeStart?.value === index;
              const isRangeEnd =
                rangeEnd?.year === year && rangeEnd?.value === index;
              const inRange = isInRange(year, index);
              const isEdge = isSelected || isRangeStart || isRangeEnd;

              return (
                <Button
                  className={cn(
                    inRange && !isEdge && "bg-accent"
                  )}
                  key={item}
                  onClick={() => onSelect(year, index)}
                  size="sm"
                  variant={isEdge ? "default" : "outline"}
                >
                  {item}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function DateSelectorYearList({
  years,
  selectedYear,
  rangeStart,
  rangeEnd,
  isYearInRange,
  onSelect,
  className,
}: {
  years: number[];
  selectedYear?: number;
  rangeStart?: DateSelectorRangePoint;
  rangeEnd?: DateSelectorRangePoint;
  isYearInRange: (year: number) => boolean;
  onSelect: (year: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {years.map((year) => {
        const isSelected = selectedYear === year && !rangeStart && !rangeEnd;
        const isRangeStart = rangeStart?.year === year;
        const isRangeEnd = rangeEnd?.year === year;
        const inRange = isYearInRange(year);
        const isEdge = isSelected || isRangeStart || isRangeEnd;

        return (
          <Button
            className={cn(inRange && !isEdge && "bg-accent")}
            key={year}
            onClick={() => onSelect(year)}
            size="sm"
            variant={isEdge ? "default" : "outline"}
          >
            {year}
          </Button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DateSelector                                                       */
/* ------------------------------------------------------------------ */

/** Props for {@link DateSelector}. */
export interface DateSelectorProps {
  /** When `true` (default), enables the `between` range operator. */
  allowRange?: boolean;
  /** Centre year for the generated year list. Defaults to the current year. */
  baseYear?: number;
  /** Additional classes for the root element. */
  className?: string;
  /** `date-fns` format used to render and parse day values. */
  dayDateFormat?: string;
  /** Extra `date-fns` formats accepted when parsing typed input. */
  dayDateFormats?: string[];
  /** The operator selected on first render. Defaults to `"is"`. */
  defaultFilterType?: DateSelectorFilterType;
  /** The period selected on first render. Defaults to `"day"`. */
  defaultPeriodType?: DateSelectorPeriodType;
  /** Partial i18n overrides merged over the English defaults. */
  i18n?: Partial<DateSelectorI18nConfig>;
  /** When set, the input becomes editable and shows this hint while focused. */
  inputHint?: string;
  /** Optional heading rendered beside the operator tabs. */
  label?: string;
  /** Upper bound (inclusive) of the year list. */
  maxYear?: number;
  /** Lower bound (inclusive) of the year list. */
  minYear?: number;
  /** Called whenever the selection changes. */
  onChange?: (value: DateSelectorValue) => void;
  /** Restricts which period tabs are shown, in order. */
  periodTypes?: DateSelectorPeriodType[];
  /** Locks the operator to a fixed value and disables the operator tabs. */
  presetMode?: DateSelectorFilterType;
  /** When `true` (default), renders the text input above the picker. */
  showInput?: boolean;
  /** When `true` (default), the day view shows two months on desktop. */
  showTwoMonths?: boolean;
  /** The controlled selection. */
  value?: DateSelectorValue;
  /** First day of the week (0 = Sunday … 6 = Saturday). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Number of years listed when `minYear`/`maxYear` are not set. */
  yearRange?: number;
}

const YEAR_PATTERN = /^\d{4}$/;
const QUARTER_PATTERN = /^Q([1-4])(?:\s+(\d{4}))?$/i;
const MIN_PARSE_YEAR = 1900;
const MAX_PARSE_YEAR = 2100;

const inYearBounds = (year: number) =>
  year >= MIN_PARSE_YEAR && year <= MAX_PARSE_YEAR;

function parseYearInput(
  trimmed: string,
  operator: DateSelectorFilterType
): DateSelectorValue | null {
  const match = trimmed.match(YEAR_PATTERN);
  if (!match?.[0]) {
    return null;
  }
  const year = Number.parseInt(match[0], 10);
  return inYearBounds(year) ? { period: "year", operator, year } : null;
}

function parseQuarterInput(
  trimmed: string,
  operator: DateSelectorFilterType
): DateSelectorValue | null {
  const match = trimmed.match(QUARTER_PATTERN);
  if (!match?.[1]) {
    return null;
  }
  const quarter = Number.parseInt(match[1], 10) - 1;
  const year = match[2]
    ? Number.parseInt(match[2], 10)
    : new Date().getFullYear();
  return inYearBounds(year)
    ? { period: "quarter", operator, year, quarter }
    : null;
}

function parseDayInput(
  trimmed: string,
  operator: DateSelectorFilterType,
  dateFormats: string[]
): DateSelectorValue | null {
  for (const dateFormat of dateFormats) {
    const parsed = parse(trimmed, dateFormat, new Date());
    if (!Number.isNaN(parsed.getTime())) {
      return { period: "day", operator, startDate: parsed };
    }
  }
  return null;
}

/**
 * A compact date filter that selects by day, month, quarter, half-year, or year
 * with `is` / `before` / `after` / `between` operators. Reorders into a popover
 * or dialog by wrapping it; the day view reuses {@link Calendar} and the coarser
 * periods render their own grids.
 *
 * Selection is controlled — pass `value` and `onChange`. Drive a custom layout
 * with {@link useDateSelector} and render {@link formatDateValue} for display.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState<DateSelectorValue>();
 * <DateSelector onChange={setValue} value={value} />
 * ```
 */
export function DateSelector({
  value,
  onChange,
  allowRange = true,
  periodTypes,
  defaultPeriodType = "day",
  defaultFilterType = "is",
  presetMode,
  showInput = true,
  showTwoMonths = true,
  label,
  className,
  yearRange = 10,
  baseYear,
  minYear = 2015,
  maxYear = 2026,
  i18n: i18nOverride,
  inputHint,
  dayDateFormat = "MM/dd/yyyy",
  dayDateFormats,
  weekStartsOn,
}: DateSelectorProps) {
  const mergedI18n = useMemo(
    () => ({ ...DEFAULT_DATE_SELECTOR_I18N, ...i18nOverride }),
    [i18nOverride]
  );

  const {
    periodType,
    filterType,
    selectedDate,
    selectedEndDate,
    calendarMonth,
    selectedYear,
    selectedMonth,
    selectedQuarter,
    selectedHalfYear,
    rangeStart,
    rangeEnd,
    hoverDate,
    years,
    currentValue,
    setPeriodType,
    setFilterType,
    setCalendarMonth,
    setHoverDate,
    clearSelection,
    handleDayClick,
    handlePeriodSelect,
    handleYearSelect,
    isInRange,
    isYearInRange,
  } = useDateSelector({
    value,
    onChange,
    defaultPeriodType,
    defaultFilterType,
    presetMode,
    allowRange,
    yearRange,
    baseYear,
    minYear,
    maxYear,
    periodTypes,
  });

  const displayValue = formatDateValue(currentValue, mergedI18n, dayDateFormat);
  const [inputValue, setInputValue] = useState(displayValue);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (!isInputFocused) {
      setInputValue(displayValue);
    }
  }, [displayValue, isInputFocused]);

  const dateFormats = useMemo(() => {
    if (dayDateFormats && dayDateFormats.length > 0) {
      const formats = [...dayDateFormats];
      if (!formats.includes(dayDateFormat)) {
        formats.unshift(dayDateFormat);
      }
      return formats;
    }
    return Array.from(
      new Set([
        dayDateFormat,
        "dd/MM/yyyy",
        "yyyy-MM-dd",
        "MM-dd-yyyy",
        "dd-MM-yyyy",
      ])
    );
  }, [dayDateFormat, dayDateFormats]);

  const parseInputValue = useCallback(
    (text: string): DateSelectorValue | null => {
      const trimmed = text.trim();
      if (!trimmed) {
        return null;
      }
      const operator = presetMode ?? filterType;
      return (
        parseYearInput(trimmed, operator) ??
        parseQuarterInput(trimmed, operator) ??
        parseDayInput(trimmed, operator, dateFormats)
      );
    },
    [filterType, presetMode, dateFormats]
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);
      const parsed = parseInputValue(newValue);
      if (parsed) {
        onChange?.(parsed);
      }
    },
    [onChange, parseInputValue]
  );

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
    if (!parseInputValue(inputValue)) {
      setInputValue(displayValue);
    }
  }, [inputValue, displayValue, parseInputValue]);

  const inputDisplay = inputHint ? inputValue : displayValue;

  return (
    <DateSelectorContext.Provider value={{ i18n: mergedI18n }}>
      <div
        className={cn("w-full space-y-4 sm:w-[470px]", className)}
        data-slot="date-selector"
      >
        <div className="flex flex-wrap items-center gap-3">
          {label && (
            <h3 className="font-medium text-sm" data-slot="date-selector-label">
              {label}
            </h3>
          )}
          {presetMode === undefined && (
            <DateSelectorFilterToggle
              onChange={setFilterType}
              showBetween={allowRange}
              value={filterType}
            />
          )}
        </div>
        {showInput && (
          <div className="relative" data-slot="date-selector-input">
            <Input
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              onFocus={() => setIsInputFocused(true)}
              placeholder={
                isInputFocused && inputHint ? inputHint : mergedI18n.placeholder
              }
              readOnly={!inputHint}
              type="text"
              value={inputDisplay}
            />
            {inputDisplay && (
              <Button
                aria-label={mergedI18n.clear}
                className="-translate-y-1/2 absolute end-1 top-1/2"
                onClick={clearSelection}
                size="icon-xs"
                type="button"
                variant="ghost"
              >
                <HugeiconsIcon
                  aria-hidden="true"
                  icon={Cancel01Icon}
                  strokeWidth={2}
                />
              </Button>
            )}
          </div>
        )}
        <DateSelectorPeriodTabs
          calendarMonth={calendarMonth}
          onChange={setPeriodType}
          onMonthChange={setCalendarMonth}
          periodTypes={periodTypes}
          showNavigationButtons={periodType === "day"}
          value={periodType}
        />

        {periodType === "day" ? (
          <div className="w-full pb-1">
            <DateSelectorDayPicker
              currentMonth={calendarMonth}
              hoverDate={hoverDate}
              isRange={filterType === "between" && allowRange}
              onDayClick={handleDayClick}
              onDayHover={setHoverDate}
              selectedDate={selectedDate}
              selectedEndDate={selectedEndDate}
              showTwoMonths={showTwoMonths}
              weekStartsOn={weekStartsOn}
            />
          </div>
        ) : (
          <div className="-mr-3 w-full">
            <ScrollArea className="h-[200px] w-full pe-3" key={periodType}>
              {periodType === "month" && (
                <DateSelectorPeriodGrid
                  columns={3}
                  isInRange={isInRange}
                  items={mergedI18n.monthsShort}
                  onSelect={handlePeriodSelect}
                  rangeEnd={rangeEnd}
                  rangeStart={rangeStart}
                  selectedValue={selectedMonth}
                  selectedYear={selectedYear}
                  years={years}
                />
              )}
              {periodType === "quarter" && (
                <DateSelectorPeriodGrid
                  columns={4}
                  isInRange={isInRange}
                  items={mergedI18n.quarters}
                  onSelect={handlePeriodSelect}
                  rangeEnd={rangeEnd}
                  rangeStart={rangeStart}
                  selectedValue={selectedQuarter}
                  selectedYear={selectedYear}
                  years={years}
                />
              )}
              {periodType === "half-year" && (
                <DateSelectorPeriodGrid
                  columns={2}
                  isInRange={isInRange}
                  items={mergedI18n.halfYears}
                  onSelect={handlePeriodSelect}
                  rangeEnd={rangeEnd}
                  rangeStart={rangeStart}
                  selectedValue={selectedHalfYear}
                  selectedYear={selectedYear}
                  years={years}
                />
              )}
              {periodType === "year" && (
                <DateSelectorYearList
                  isYearInRange={isYearInRange}
                  onSelect={handleYearSelect}
                  rangeEnd={rangeEnd}
                  rangeStart={rangeStart}
                  selectedYear={selectedYear}
                  years={years}
                />
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </DateSelectorContext.Provider>
  );
}
