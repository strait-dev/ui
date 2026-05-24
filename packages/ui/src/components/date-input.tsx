"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "../utils/index";

// Bounds used by validateDate to reject out-of-range field values.
const MIN_DAY = 1;
const MAX_DAY = 31;
const MIN_MONTH = 1;
const MAX_MONTH = 12;
const MIN_YEAR = 1000;
const MAX_YEAR = 9999;
const DESKTOP_BREAKPOINT = 1024;

// Matches a single digit keystroke; used to allow/block key events.
const NUMERIC_REGEX = /^[0-9]$/;

/** Props for {@link DateInput}. */
export type DateInputProps = {
  /** Currently selected date; the component mirrors this into its internal
   *  segment state on each render cycle. */
  value?: Date;
  /** Called with a fully valid `Date` whenever the user commits a change;
   *  not fired for partial or out-of-range inputs. */
  onChange: (date: Date) => void;
  /** Additional classes merged onto the outermost wrapper `<div>` that
   *  provides the border, background, and flex layout. */
  className?: string;
};

/** Internal representation of the three editable date segments. */
type DateParts = {
  day: number;
  month: number;
  year: number;
};

/**
 * A three-segment MM/DD/YYYY inline date editor with keyboard navigation.
 *
 * Renders three individual `<input type="text">` elements styled as a single
 * field. Users can type digits, increment/decrement with arrow keys, and move
 * between segments using the left/right arrow keys.
 *
 * @remarks
 * - The component is fully controlled via `value`; internal state mirrors the
 *   prop and is reset on blur when the entry would be invalid.
 * - `onChange` is only called when all three parts form a valid calendar date
 *   (e.g. Feb 30 is rejected by constructing a `Date` and comparing it back).
 * - Arrow-up on the last day of a month rolls over to the 1st of the next
 *   month; arrow-down on the 1st rolls back to the last day of the previous
 *   month. The year advances/decrements accordingly.
 * - On desktop (viewport width > 1024 px) focusing a segment selects all its
 *   text so the user can immediately type a replacement value.
 *
 * @example
 * ```tsx
 * const [date, setDate] = React.useState(new Date());
 *
 * <DateInput value={date} onChange={setDate} />
 * ```
 */
const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const [date, setDate] = React.useState<DateParts>(() => {
    const d = value ? new Date(value) : new Date();
    return {
      day: d.getDate(),
      month: d.getMonth() + 1, // JavaScript months are 0-indexed
      year: d.getFullYear(),
    };
  });

  const monthRef = useRef<HTMLInputElement | null>(null);
  const dayRef = useRef<HTMLInputElement | null>(null);
  const yearRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const d = value ? new Date(value) : new Date();
    setDate({
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
  }, [value]);

  const validateDate = (
    field: keyof DateParts,
    inputValue: number
  ): boolean => {
    if (
      (field === "day" && (inputValue < MIN_DAY || inputValue > MAX_DAY)) ||
      (field === "month" &&
        (inputValue < MIN_MONTH || inputValue > MAX_MONTH)) ||
      (field === "year" && (inputValue < MIN_YEAR || inputValue > MAX_YEAR))
    ) {
      return false;
    }

    // Validate the day of the month
    const newDate = { ...date, [field]: inputValue };
    const d = new Date(newDate.year, newDate.month - 1, newDate.day);
    return (
      d.getFullYear() === newDate.year &&
      d.getMonth() + 1 === newDate.month &&
      d.getDate() === newDate.day
    );
  };

  const handleInputChange =
    (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value ? Number(e.target.value) : "";
      const isValid =
        typeof newValue === "number" && validateDate(field, newValue);

      // If the new value is valid, update the date
      const newDate = { ...date, [field]: newValue };
      setDate(newDate);

      // only call onChange when the entry is valid
      if (isValid) {
        onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
      }
    };

  const initialDate = useRef<DateParts>(date);

  const handleBlur =
    (field: keyof DateParts) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      if (!e.target.value) {
        setDate(initialDate.current);
        return;
      }

      const newValue = Number(e.target.value);
      const isValid = validateDate(field, newValue);

      if (isValid) {
        // If the new value is valid, update the initial value
        initialDate.current = { ...date, [field]: newValue };
      } else {
        setDate(initialDate.current);
      }
    };

  const handleArrowUp = (field: keyof DateParts) => {
    let newDate = { ...date };

    if (field === "day") {
      if (date[field] === new Date(date.year, date.month, 0).getDate()) {
        newDate = {
          ...newDate,
          day: MIN_DAY,
          month: (date.month % MAX_MONTH) + 1,
        };
        if (newDate.month === MIN_MONTH) {
          newDate.year += 1;
        }
      } else {
        newDate.day += 1;
      }
    }

    if (field === "month") {
      if (date[field] === MAX_MONTH) {
        newDate = { ...newDate, month: MIN_MONTH, year: date.year + 1 };
      } else {
        newDate.month += 1;
      }
    }

    if (field === "year") {
      newDate.year += 1;
    }

    setDate(newDate);
    onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
  };

  const handleArrowDown = (field: keyof DateParts) => {
    let newDate = { ...date };

    if (field === "day") {
      if (date[field] === MIN_DAY) {
        newDate.month -= 1;
        if (newDate.month === 0) {
          newDate.month = MAX_MONTH;
          newDate.year -= 1;
        }
        newDate.day = new Date(newDate.year, newDate.month, 0).getDate();
      } else {
        newDate.day -= 1;
      }
    }

    if (field === "month") {
      if (date[field] === MIN_MONTH) {
        newDate = { ...newDate, month: MAX_MONTH, year: date.year - 1 };
      } else {
        newDate.month -= 1;
      }
    }

    if (field === "year") {
      newDate.year -= 1;
    }

    setDate(newDate);
    onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
  };

  const isAtEndOfInput = (target: HTMLInputElement) =>
    target.selectionStart === target.value.length ||
    (target.selectionStart === 0 &&
      target.selectionEnd === target.value.length);

  const isAtStartOfInput = (target: HTMLInputElement) =>
    target.selectionStart === 0 ||
    (target.selectionStart === 0 &&
      target.selectionEnd === target.value.length);

  const handleArrowRight = (
    field: keyof DateParts,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (isAtEndOfInput(e.currentTarget)) {
      e.preventDefault();
      if (field === "month") {
        dayRef.current?.focus();
      }
      if (field === "day") {
        yearRef.current?.focus();
      }
    }
  };

  const handleArrowLeft = (
    field: keyof DateParts,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (isAtStartOfInput(e.currentTarget)) {
      e.preventDefault();
      if (field === "day") {
        monthRef.current?.focus();
      }
      if (field === "year") {
        dayRef.current?.focus();
      }
    }
  };

  const handleArrowNavigation = (
    field: keyof DateParts,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "ArrowRight") {
      handleArrowRight(field, e);
    } else if (e.key === "ArrowLeft") {
      handleArrowLeft(field, e);
    }
  };

  const handleKeyDown =
    (field: keyof DateParts) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow command (or control) combinations
      if (e.metaKey || e.ctrlKey) {
        return;
      }

      // Prevent non-numeric characters, excluding allowed keys
      if (
        !(
          NUMERIC_REGEX.test(e.key) ||
          [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "Delete",
            "Tab",
            "Backspace",
            "Enter",
          ].includes(e.key)
        )
      ) {
        e.preventDefault();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleArrowUp(field);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleArrowDown(field);
      }

      handleArrowNavigation(field, e);
    };

  return (
    <div
      className={cn(
        "flex h-8 items-center rounded-lg border border-input bg-input/20 px-2 text-sm dark:bg-input/30",
        className
      )}
      data-slot="date-input"
    >
      <input
        className="w-6 border-none p-0 text-center outline-hidden"
        max={12}
        maxLength={2}
        onBlur={handleBlur("month")}
        onChange={handleInputChange("month")}
        onFocus={(e) => {
          if (window.innerWidth > DESKTOP_BREAKPOINT) {
            e.target.select();
          }
        }}
        onKeyDown={handleKeyDown("month")}
        placeholder="M"
        ref={monthRef}
        type="text"
        value={date.month.toString()}
      />
      <span className="-mx-px opacity-20">/</span>
      <input
        className="w-7 border-none p-0 text-center outline-hidden"
        max={31}
        maxLength={2}
        onBlur={handleBlur("day")}
        onChange={handleInputChange("day")}
        onFocus={(e) => {
          if (window.innerWidth > DESKTOP_BREAKPOINT) {
            e.target.select();
          }
        }}
        onKeyDown={handleKeyDown("day")}
        placeholder="D"
        ref={dayRef}
        type="text"
        value={date.day.toString()}
      />
      <span className="-mx-px opacity-20">/</span>
      <input
        className="w-12 border-none p-0 text-center outline-hidden"
        max={9999}
        maxLength={4}
        onBlur={handleBlur("year")}
        onChange={handleInputChange("year")}
        onFocus={(e) => {
          if (window.innerWidth > DESKTOP_BREAKPOINT) {
            e.target.select();
          }
        }}
        onKeyDown={handleKeyDown("year")}
        placeholder="YYYY"
        ref={yearRef}
        type="text"
        value={date.year.toString()}
      />
    </div>
  );
};

DateInput.displayName = "DateInput";

export { DateInput };
