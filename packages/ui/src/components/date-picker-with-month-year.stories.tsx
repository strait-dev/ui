import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { DatePickerWithMonthYear } from "./date-picker-with-month-year";

const FIXED_DATE = new Date(2025, 4, 15); // 15 May 2025

const meta: Meta<typeof DatePickerWithMonthYear> = {
  title: "Patterns/Date Picker With Month Year",
  component: DatePickerWithMonthYear,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A popover date picker with month/year dropdown navigation built on **react-day-picker** v9 + `date-fns` (pt-BR locale).",
          "",
          "- Caption is rendered as two `Select` dropdowns (month + year) via custom `DropdownNav`/`Dropdown` components.",
          "- Supports both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) modes.",
          "- `minValue`/`maxValue` constrain the visible year/month range in the dropdowns (`startMonth`/`endMonth` in v9 API).",
          "- `error` applies a destructive border; `disabled` makes the trigger non-interactive.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the trigger button.",
    },
    error: {
      control: "boolean",
      description: "Applies destructive border styling.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder when no date is selected.",
    },
  },
  args: {
    disabled: false,
    error: false,
    placeholder: "Selecione uma data",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledPicker(props: {
  initialValue?: Date;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  minValue?: Date;
  maxValue?: Date;
}) {
  const [date, setDate] = useState<Date | undefined>(props.initialValue);
  return (
    <div className="w-64">
      <DatePickerWithMonthYear
        disabled={props.disabled}
        error={props.error}
        maxValue={props.maxValue}
        minValue={props.minValue}
        onChange={setDate}
        placeholder={props.placeholder}
        value={date}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-64">
      <ControlledPicker {...args} initialValue={FIXED_DATE} />
    </div>
  ),
};

/** Empty — no pre-selected date. */
export const Empty: Story = {
  render: () => (
    <div className="w-64">
      <ControlledPicker />
    </div>
  ),
};

/** Pre-selected date. */
export const WithPreselectedDate: Story = {
  render: () => (
    <div className="w-64">
      <ControlledPicker initialValue={FIXED_DATE} />
    </div>
  ),
};

/** Constrained to a specific year range. */
export const ConstrainedRange: Story = {
  render: () => (
    <div className="w-64">
      <ControlledPicker
        initialValue={FIXED_DATE}
        maxValue={new Date(2027, 11)}
        minValue={new Date(2023, 0)}
      />
    </div>
  ),
};

/** Disabled trigger. */
export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <ControlledPicker disabled initialValue={FIXED_DATE} />
    </div>
  ),
};

/** Error state. */
export const WithError: Story = {
  render: () => (
    <div className="w-64">
      <ControlledPicker error />
    </div>
  ),
};
