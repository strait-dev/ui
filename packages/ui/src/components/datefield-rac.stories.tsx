import { CalendarDate, Time } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { DateField, DateInput, TimeField } from "./datefield-rac";

const FIXED = new CalendarDate(2025, 5, 15);

const meta: Meta<typeof DateField> = {
  title: "Patterns/Date Field RAC",
  component: DateField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Low-level date/time field primitives built on **react-aria-components**:",
          "- `DateField` — wraps RAC `DateField` with className composition.",
          "- `TimeField` — same wrapper for time values.",
          "- `DateInput` — styled segment container with `data-focus-within` ring.",
          "- `DateSegment` — individual year/month/day/hour/minute/etc. segments with focused/invalid/placeholder states.",
          "",
          "Compose `DateField` + `DateInput` (or just `DateInput` standalone) for a fully accessible inline date entry.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Controlled `DateField` with a pre-set value. */
export const Playground: Story = {
  render: () => (
    <DateField aria-label="Date" defaultValue={FIXED}>
      <DateInput />
    </DateField>
  ),
};

/** `DateField` with no default value (shows placeholder segments). */
export const Empty: Story = {
  render: () => (
    <DateField aria-label="Enter date">
      <DateInput />
    </DateField>
  ),
};

/** Disabled `DateField`. */
export const Disabled: Story = {
  render: () => (
    <DateField aria-label="Disabled date" defaultValue={FIXED} isDisabled>
      <DateInput />
    </DateField>
  ),
};

/** `TimeField` for time-only input. */
export const TimeFieldStory: Story = {
  name: "Time Field",
  render: () => (
    <TimeField aria-label="Time" defaultValue={new Time(14, 30)}>
      <DateInput />
    </TimeField>
  ),
};
