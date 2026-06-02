import { CalendarDate } from "@internationalized/date";
import type { RangeValue } from "@react-types/shared";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateValue } from "react-aria-components";

import { Calendar, RangeCalendar } from "./calendar-rac";

// Fixed CalendarDate so snapshots are deterministic
const FIXED = new CalendarDate(2025, 5, 15);

const meta: Meta<typeof Calendar> = {
  title: "Patterns/Calendar RAC",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Two calendar primitives built on **react-aria-components** (Adobe RAC):",
          "- `Calendar` — single-value selection.",
          "- `RangeCalendar` — start/end range selection with highlighted range cells.",
          "",
          "Navigation buttons and day-of-week header are rendered as custom sub-components. Today is marked with a small dot indicator.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Single-date calendar — controlled with a `CalendarDate` value. */
export const Playground: Story = {
  render: () => {
    function SingleCalendarRAC() {
      const [date, setDate] = useState<DateValue | null>(FIXED);
      return (
        <div className="flex flex-col items-center gap-3">
          <Calendar
            aria-label="Select a date"
            onChange={(value) => setDate(value as DateValue)}
            value={date}
          />
          <p className="text-muted-foreground text-sm">
            {date ? date.toString() : "No date selected"}
          </p>
        </div>
      );
    }
    return <SingleCalendarRAC />;
  },
};

/** Single-date calendar — no pre-selected value. */
export const SingleEmpty: Story = {
  render: () => <Calendar aria-label="Pick a date" defaultValue={undefined} />,
};

/** Range calendar — controlled start/end selection. */
export const RangeSelect: Story = {
  render: () => {
    function RangeCalendarRAC() {
      const [range, setRange] = useState<RangeValue<DateValue> | null>({
        start: new CalendarDate(2025, 5, 5),
        end: new CalendarDate(2025, 5, 20),
      });
      return (
        <div className="flex flex-col items-center gap-3">
          <RangeCalendar
            aria-label="Select date range"
            onChange={setRange}
            value={range}
          />
          <p className="text-muted-foreground text-sm">
            {range
              ? `${range.start.toString()} → ${range.end.toString()}`
              : "No range selected"}
          </p>
        </div>
      );
    }
    return <RangeCalendarRAC />;
  },
};

/** Disabled calendar — no interaction. */
export const SingleDisabled: Story = {
  render: () => (
    <Calendar aria-label="Disabled calendar" isDisabled value={FIXED} />
  ),
};
