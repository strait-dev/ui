import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { DateInput } from "./date-input";

const FIXED_DATE = new Date(2025, 4, 15); // 15 May 2025

const meta: Meta<typeof DateInput> = {
  title: "Patterns/Date Input",
  component: DateInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A custom date input with three separate numeric fields for month, day, and year.",
          "",
          "- Arrow keys increment/decrement each field and automatically roll over to adjacent units.",
          "- Arrow Left/Right navigate between the three segments.",
          "- Fully controlled via `value` + `onChange`; initialises to today when no `value` is provided.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    value: {
      control: false,
      description: "Controlled Date value.",
    },
    onChange: {
      action: "onChange",
      description:
        "Callback called with a new Date whenever the value changes.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledDateInput({ initialValue }: { initialValue?: Date }) {
  const [date, setDate] = useState<Date>(initialValue ?? FIXED_DATE);
  return (
    <div className="flex flex-col items-center gap-3">
      <DateInput onChange={setDate} value={date} />
      <p className="text-muted-foreground text-sm">{date.toDateString()}</p>
    </div>
  );
}

/** Interactive playground. */
export const Playground: Story = {
  render: () => <ControlledDateInput initialValue={FIXED_DATE} />,
};

/** Pre-filled with a specific date. */
export const WithPresetDate: Story = {
  render: () => <ControlledDateInput initialValue={new Date(2024, 0, 1)} />,
};

/** Starts from today's date. */
export const DefaultToToday: Story = {
  render: () => {
    function DefaultDateInput() {
      const [date, setDate] = useState<Date>(new Date());
      return (
        <div className="flex flex-col items-center gap-3">
          <DateInput onChange={setDate} value={date} />
          <p className="text-muted-foreground text-sm">
            Selected: {date.toDateString()}
          </p>
        </div>
      );
    }
    return <DefaultDateInput />;
  },
};
