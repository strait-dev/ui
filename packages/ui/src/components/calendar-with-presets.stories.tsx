import type { Meta, StoryObj } from "@storybook/react-vite";
import { subDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { CalendarWithPresets } from "./calendar-with-presets";

const FIXED_DATE = new Date(2025, 4, 15); // 15 May 2025

const meta: Meta<typeof CalendarWithPresets> = {
  title: "Patterns/Calendar With Presets",
  component: CalendarWithPresets,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A calendar panel with a preset sidebar built on **react-day-picker** v9.",
          "",
          "- `mode='single'` renders a single-month calendar; `mode='range'` renders two months.",
          "- The sidebar shows preset buttons (e.g. Hoje, Ontem, Últimos 7 dias…) that jump the selection.",
          "- `disableFutureDates` (default `true`) blocks selecting future dates.",
          "- Pass custom `presets` to override the built-in list.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    mode: {
      control: "select",
      options: ["single", "range"],
      description: "Selection mode.",
      table: { defaultValue: { summary: "single" } },
    },
    disableFutureDates: {
      control: "boolean",
      description: "Disables dates after today.",
      table: { defaultValue: { summary: "true" } },
    },
  },
  args: {
    mode: "single",
    disableFutureDates: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function SinglePresetCalendar() {
  const [date, setDate] = useState<Date | undefined>(FIXED_DATE);
  return (
    <div className="flex flex-col items-center gap-3">
      <CalendarWithPresets
        mode="single"
        onSelect={(d: Date | undefined) => setDate(d)}
        selected={date}
      />
      <p className="text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}

function RangePresetCalendar() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(FIXED_DATE, 6),
    to: FIXED_DATE,
  });
  return (
    <div className="flex flex-col items-center gap-3">
      <CalendarWithPresets
        mode="range"
        onSelect={(r: DateRange | undefined) => setRange(r)}
        selected={range}
      />
      <p className="text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} →{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => {
    function PlaygroundCalendar() {
      const [date, setDate] = useState<Date | undefined>(FIXED_DATE);
      return (
        <CalendarWithPresets
          disableFutureDates={args.disableFutureDates}
          mode={args.mode ?? "single"}
          onSelect={(d: Date | undefined) => setDate(d)}
          selected={date}
        />
      );
    }
    return <PlaygroundCalendar />;
  },
};

/** Single-date selection with presets. */
export const SingleMode: Story = {
  render: () => <SinglePresetCalendar />,
};

/** Date-range selection with presets. */
export const RangeMode: Story = {
  render: () => <RangePresetCalendar />,
};

/** Future dates enabled. */
export const FutureDatesEnabled: Story = {
  render: () => {
    function FutureCalendar() {
      const [date, setDate] = useState<Date | undefined>(FIXED_DATE);
      return (
        <CalendarWithPresets
          disableFutureDates={false}
          mode="single"
          onSelect={(d: Date | undefined) => setDate(d)}
          selected={date}
        />
      );
    }
    return <FutureCalendar />;
  },
};
