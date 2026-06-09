import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangePicker } from "./date-range-picker";

const FIXED_FROM = new Date(2025, 4, 5); // 5 May 2025
const FIXED_TO = new Date(2025, 4, 20); // 20 May 2025

const meta: Meta<typeof DateRangePicker> = {
  title: "Patterns/Date Range Picker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A hybrid date-range picker that combines **react-aria-components** `DateRangePicker` (for the inline date inputs + popover trigger) with our `Calendar` (react-day-picker v9) rendered inside a RAC `Popover`/`Dialog`.",
          "",
          "- Shows two `DateInput` segment fields (start / end) with a calendar icon button that opens a two-month calendar.",
          "- Locale is configurable via `locale` and defaults to `en-US`.",
          "- Supports disabled and invalid states with inline `errorMessage`.",
          "- Controlled via `value: DateRange | undefined` + `onChange`.",
          "- Compose quick-select preset buttons around this base component instead of using a separate preset export.",
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

function ControlledRangePicker(props: {
  label?: string;
  initialValue?: DateRange;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  locale?: string;
}) {
  const [range, setRange] = useState<DateRange | undefined>(props.initialValue);
  return (
    <div className="w-80">
      <DateRangePicker
        disabled={props.disabled}
        error={props.error}
        errorMessage={props.errorMessage}
        label={props.label}
        locale={props.locale}
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
      <ControlledRangePicker
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
      <ControlledRangePicker label="Select period" />
    </div>
  ),
};

/** Pre-selected range. */
export const WithPreselectedRange: Story = {
  render: () => (
    <div className="w-80">
      <ControlledRangePicker
        initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
        label="Billing period"
      />
    </div>
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <ControlledRangePicker
        disabled
        initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
        label="Locked period"
      />
    </div>
  ),
};

/** Invalid state with inline recovery copy. */
export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <ControlledRangePicker
        error
        errorMessage="Select both a start and end date."
        label="Billing period"
      />
    </div>
  ),
};

/** Localized range segments without a specialized component variant. */
export const Localized: Story = {
  render: () => (
    <div className="w-80">
      <ControlledRangePicker
        initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
        label="Localized period"
        locale="en-GB"
      />
    </div>
  ),
};

/** No label. */
export const WithoutLabel: Story = {
  render: () => (
    <div className="w-80">
      <ControlledRangePicker
        initialValue={{ from: FIXED_FROM, to: FIXED_TO }}
      />
    </div>
  ),
};
