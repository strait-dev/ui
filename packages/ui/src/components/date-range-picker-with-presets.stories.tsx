import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangePickerWithPresets } from "./date-range-picker-with-presets";

const FIXED_FROM = new Date(2025, 4, 1); // 1 May 2025
const FIXED_TO = new Date(2025, 4, 31); // 31 May 2025

const meta: Meta<typeof DateRangePickerWithPresets> = {
  title: "Patterns/Date Range Picker With Presets",
  component: DateRangePickerWithPresets,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An extended date-range picker that wraps RAC `DateRangePicker` + our `RangeCalendarWithPresets` in a popover.",
          "",
          "- The inline segment inputs mirror the selected range; the calendar icon opens a popover with preset buttons and a two-month calendar.",
          "- Presets are built into `RangeCalendarWithPresets`; an **Apply** / **Reset** footer is shown (`showFooter`).",
          "- Locale is `pt-BR`. Controlled via `value` + `onChange`; also accepts `defaultValue` for uncontrolled use.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    label: {
      control: "text",
      description: "Label rendered above the group.",
    },
  },
  args: {
    label: "Date range",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledPickerWithPresets(props: {
  label?: string;
  initialValue?: DateRange;
  defaultValue?: DateRange;
}) {
  const [range, setRange] = useState<DateRange | undefined>(props.initialValue);
  return (
    <div className="w-80">
      <DateRangePickerWithPresets
        defaultValue={props.defaultValue}
        label={props.label}
        onChange={setRange}
        value={range}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} →{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <ControlledPickerWithPresets
        initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
        label={args.label}
      />
    </div>
  ),
};

/** Empty — no range pre-selected. */
export const Empty: Story = {
  render: () => (
    <div className="w-80">
      <ControlledPickerWithPresets label="Select period" />
    </div>
  ),
};

/** Pre-selected range. */
export const WithPreselectedRange: Story = {
  render: () => (
    <div className="w-80">
      <ControlledPickerWithPresets
        initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
        label="Reporting period"
      />
    </div>
  ),
};
