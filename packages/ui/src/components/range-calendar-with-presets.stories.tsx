import type { Meta, StoryObj } from "@storybook/react-vite";
import { subDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { RangeCalendarWithPresets } from "./range-calendar-with-presets";

const FIXED_FROM = new Date(2025, 4, 5); // 5 May 2025
const FIXED_TO = new Date(2025, 4, 15); // 15 May 2025

const meta: Meta<typeof RangeCalendarWithPresets> = {
  title: "Patterns/Range Calendar With Presets",
  component: RangeCalendarWithPresets,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A range calendar with a row of preset chips and an optional Apply/Reset footer, built on **react-day-picker** v9.",
          "",
          "- Presets are arranged in a 4-column grid above the calendar.",
          "- Active preset is highlighted with `bg-accent`.",
          "- `showFooter` adds Apply (calls `onApply`) and Reset (calls `onReset`) buttons.",
          "- `numberOfMonths` defaults to 2; future dates are disabled.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    showFooter: {
      control: "boolean",
      description: "Shows the Apply / Reset action buttons.",
      table: { defaultValue: { summary: "false" } },
    },
    numberOfMonths: {
      control: "number",
      description: "Number of calendar months to display.",
      table: { defaultValue: { summary: "2" } },
    },
  },
  args: {
    showFooter: false,
    numberOfMonths: 2,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledRangeCalendar(props: {
  showFooter?: boolean;
  numberOfMonths?: number;
  initialValue?: DateRange;
}) {
  const [range, setRange] = useState<DateRange | undefined>(props.initialValue);
  return (
    <div className="flex flex-col items-center gap-3">
      <RangeCalendarWithPresets
        numberOfMonths={props.numberOfMonths}
        onApply={() => {}}
        onReset={() => setRange(undefined)}
        onSelect={setRange}
        selected={range}
        showFooter={props.showFooter}
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
  render: (args) => (
    <ControlledRangeCalendar
      initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
      numberOfMonths={args.numberOfMonths}
      showFooter={args.showFooter}
    />
  ),
};

/** Default — two months, no footer. */
export const Default: Story = {
  render: () => (
    <ControlledRangeCalendar
      initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
    />
  ),
};

/** With Apply / Reset footer. */
export const WithFooter: Story = {
  render: () => (
    <ControlledRangeCalendar
      initialValue={{ from: subDays(new Date(), 7), to: new Date() }}
      showFooter
    />
  ),
};

/** Single-month display. */
export const SingleMonth: Story = {
  render: () => (
    <ControlledRangeCalendar
      initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
      numberOfMonths={1}
    />
  ),
};

/** Empty — no pre-selected range. */
export const Empty: Story = {
  render: () => <ControlledRangeCalendar />,
};
