import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "./calendar";

// Use a fixed date so snapshots are deterministic
const FIXED_DATE = new Date(2025, 4, 15); // 15 May 2025

const meta = {
  title: "Forms/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A date-picker calendar built on **react-day-picker** v9.",
          "",
          "Pass `mode` to choose the selection behaviour:",
          "- `'single'` — pick one date.",
          "- `'range'` — pick a start and end date.",
          "- `'multiple'` — pick any number of dates.",
          "",
          "Use `captionLayout` to control the header:",
          "- `'label'` (default) — static month/year text.",
          "- `'dropdown'` — dropdown menus for month and year.",
          "",
          "`buttonVariant` is forwarded to the prev/next navigation buttons.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    captionLayout: {
      control: "select",
      options: ["label", "dropdown"],
      description: "Controls how the month/year caption is rendered.",
      table: { defaultValue: { summary: "label" } },
    },
    showOutsideDays: {
      control: "boolean",
      description: "Show days from adjacent months.",
      table: { defaultValue: { summary: "true" } },
    },
    buttonVariant: {
      control: "select",
      options: ["ghost", "outline", "secondary"],
      description: "Visual variant of the prev/next navigation buttons.",
      table: { defaultValue: { summary: "ghost" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables all days when set to `true`.",
    },
  },
  args: {
    captionLayout: "label",
    showOutsideDays: true,
    buttonVariant: "ghost",
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Single selection                                                    */
/* ------------------------------------------------------------------ */

function SingleCalendar() {
  const [date, setDate] = useState<Date | undefined>(FIXED_DATE);

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar mode="single" onSelect={setDate} selected={date} />
      <p className="text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}

/** Single date selection (the most common usage). */
export const Playground: Story = {
  args: { mode: "single", defaultMonth: FIXED_DATE, selected: FIXED_DATE },
  render: (args) => (
    <div className="flex flex-col items-center gap-3">
      <Calendar {...args} />
    </div>
  ),
};

/** Controlled single-date picker with live display. */
export const SingleSelect: Story = {
  render: () => <SingleCalendar />,
};

/* ------------------------------------------------------------------ */
/* Range selection                                                     */
/* ------------------------------------------------------------------ */

function RangeCalendar() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2025, 4, 10),
    to: new Date(2025, 4, 20),
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        defaultMonth={new Date(2025, 4, 1)}
        mode="range"
        onSelect={setRange}
        selected={range}
      />
      <p className="text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} →{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}

/** Date range selection — click start and end dates. */
export const RangeSelect: Story = {
  render: () => <RangeCalendar />,
};

/* ------------------------------------------------------------------ */
/* Multiple selection                                                  */
/* ------------------------------------------------------------------ */

function MultipleCalendar() {
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(2025, 4, 5),
    new Date(2025, 4, 12),
    new Date(2025, 4, 19),
  ]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        defaultMonth={new Date(2025, 4, 1)}
        mode="multiple"
        onSelect={setDates}
        selected={dates}
      />
      <p className="text-muted-foreground text-sm">
        {dates?.length ?? 0} date(s) selected
      </p>
    </div>
  );
}

/** Multiple non-contiguous date selection. */
export const MultipleSelect: Story = {
  render: () => <MultipleCalendar />,
};

/* ------------------------------------------------------------------ */
/* Caption layouts                                                     */
/* ------------------------------------------------------------------ */

/** `label` vs `dropdown` caption layouts side by side. */
export const CaptionLayouts: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <div className="flex flex-col items-center gap-2">
        <p className="font-medium text-muted-foreground text-xs">label</p>
        <Calendar
          captionLayout="label"
          defaultMonth={FIXED_DATE}
          mode="single"
        />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="font-medium text-muted-foreground text-xs">dropdown</p>
        <Calendar
          captionLayout="dropdown"
          defaultMonth={FIXED_DATE}
          endMonth={new Date(2030, 11)}
          mode="single"
          startMonth={new Date(2020, 0)}
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Disabled dates                                                      */
/* ------------------------------------------------------------------ */

/** Past dates disabled — only future dates are selectable. */
export const DisabledDates: Story = {
  render: () => (
    <Calendar
      defaultMonth={FIXED_DATE}
      disabled={{ before: FIXED_DATE }}
      mode="single"
    />
  ),
};

/* ------------------------------------------------------------------ */
/* Two months                                                          */
/* ------------------------------------------------------------------ */

/** Show two months at once for range picking. */
export const TwoMonths: Story = {
  render: () => (
    <Calendar
      defaultMonth={new Date(2025, 4, 1)}
      mode="range"
      numberOfMonths={2}
    />
  ),
};
