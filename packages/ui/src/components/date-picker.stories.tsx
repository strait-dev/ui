import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { DatePicker } from "./date-picker";

const FIXED_DATE = new Date(2025, 4, 15); // 15 May 2025

const meta: Meta<typeof DatePicker> = {
  title: "Patterns/Date Picker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A popover-based date picker built on **react-day-picker** v9 + our `Calendar` + `Popover`/`Button` primitives.",
          "",
          "- Trigger is a labelled outline button showing the selected date or a placeholder.",
          "- Supports `label`, `required`, `disabled`, `error`, inline `errorMessage`, localized `placeholder`, and `formatDate` props.",
          "- Fully controlled: pass `value` + `onChange`.",
          "- Use this base component instead of specialized date-picker variants; compose presets or month/year shortcuts beside it when needed.",
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
      description: "Applies destructive border to the trigger.",
    },
    required: {
      control: "boolean",
      description: "Shows a required asterisk next to the label.",
    },
    label: {
      control: "text",
      description: "Label rendered above the trigger.",
    },
  },
  args: {
    label: "Due date",
    disabled: false,
    error: false,
    required: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledDatePicker(props: {
  label?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: React.ReactNode;
  required?: boolean;
  initialValue?: Date;
  placeholder?: React.ReactNode;
  formatDate?: (date: Date) => React.ReactNode;
}) {
  const [date, setDate] = useState<Date | undefined>(props.initialValue);
  return (
    <div className="w-64">
      <DatePicker
        disabled={props.disabled}
        error={props.error}
        errorMessage={props.errorMessage}
        formatDate={props.formatDate}
        label={props.label}
        onChange={setDate}
        placeholder={props.placeholder}
        required={props.required}
        value={date}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}

/** Interactive playground — toggle the controls to explore props. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-64">
      <ControlledDatePicker {...args} initialValue={FIXED_DATE} />
    </div>
  ),
};

/** No date pre-selected. */
export const Empty: Story = {
  render: () => (
    <div className="w-64">
      <ControlledDatePicker
        label="Event date"
        placeholder="Choose an event date"
      />
    </div>
  ),
};

/** Pre-selected date. */
export const WithPreselectedDate: Story = {
  render: () => (
    <div className="w-64">
      <ControlledDatePicker initialValue={FIXED_DATE} label="Start date" />
    </div>
  ),
};

/** Disabled state — trigger is non-interactive. */
export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <ControlledDatePicker
        disabled
        initialValue={FIXED_DATE}
        label="Date (disabled)"
      />
    </div>
  ),
};

/** Error state — border turns destructive and shows inline recovery copy. */
export const WithError: Story = {
  render: () => (
    <div className="w-64">
      <ControlledDatePicker
        error
        errorMessage="Choose an expiry date to continue."
        label="Expiry date"
      />
    </div>
  ),
};

/** Localized display without a specialized component variant. */
export const CustomFormat: Story = {
  render: () => (
    <div className="w-64">
      <ControlledDatePicker
        formatDate={(date) =>
          new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(date)
        }
        initialValue={FIXED_DATE}
        label="Localized date"
        placeholder="Pick date"
      />
    </div>
  ),
};
