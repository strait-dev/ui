import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./button";
import {
  DateSelector,
  type DateSelectorI18nConfig,
  type DateSelectorValue,
  formatDateValue,
} from "./date-selector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Forms/Date Selector",
  component: DateSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A compact date filter that selects by day, month, quarter, half-year,",
          "or year, with `is` / `before` / `after` / `between` operators.",
          "",
          "Selection is controlled: pass `value` and `onChange`. The day view reuses",
          "`Calendar`; coarser periods render their own grids. Wrap it in a",
          "`Popover` or `Dialog` to turn it into a trigger-driven filter.",
          "",
          "**Periods** — limit the period tabs with `periodTypes` and pick the",
          "initial tab with `defaultPeriodType`.",
          "",
          "**Operators** — lock the operator with `presetMode` (which also hides the",
          "operator tabs), or set the initial one with `defaultFilterType`. `between`",
          "requires `allowRange` (default `true`).",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof DateSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Inline panel with every period and operator available. */
function PlaygroundDemo() {
  const [value, setValue] = useState<DateSelectorValue>();
  return <DateSelector onChange={setValue} value={value} />;
}

export const Playground: Story = {
  render: () => <PlaygroundDemo />,
};

/** Driven from a trigger button via `Popover` — the canonical filter setup. */
export const WithPopover: Story = {
  render: () => {
    function PopoverDemo() {
      const [value, setValue] = useState<DateSelectorValue>();
      const label = value ? formatDateValue(value) : "Pick a date";
      return (
        <Popover>
          <PopoverTrigger
            render={<Button className="w-56 justify-start" variant="outline" />}
          >
            <HugeiconsIcon
              className="size-4"
              icon={Calendar03Icon}
              strokeWidth={2}
            />
            {label}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4">
            <DateSelector onChange={setValue} value={value} />
          </PopoverContent>
        </Popover>
      );
    }
    return <PopoverDemo />;
  },
};

/** Opened inside a `Dialog` for a focused, modal selection. */
export const WithDialog: Story = {
  render: () => {
    function DialogDemo() {
      const [value, setValue] = useState<DateSelectorValue>();
      const label = value ? formatDateValue(value) : "Pick a date";
      return (
        <Dialog>
          <DialogTrigger
            render={<Button className="w-56 justify-start" variant="outline" />}
          >
            <HugeiconsIcon
              className="size-4"
              icon={Calendar03Icon}
              strokeWidth={2}
            />
            {label}
          </DialogTrigger>
          <DialogContent className="sm:max-w-fit">
            <DialogHeader>
              <DialogTitle>Select a date</DialogTitle>
            </DialogHeader>
            <DateSelector onChange={setValue} value={value} />
          </DialogContent>
        </Dialog>
      );
    }
    return <DialogDemo />;
  },
};

/** `presetMode` locks the operator to `between` and hides the operator tabs. */
export const PresetBetween: Story = {
  render: () => {
    function PresetDemo() {
      const [value, setValue] = useState<DateSelectorValue>();
      return (
        <DateSelector
          label="Created"
          onChange={setValue}
          presetMode="between"
          value={value}
        />
      );
    }
    return <PresetDemo />;
  },
};

/** Restrict the available granularities with `periodTypes`. */
export const LimitedPeriods: Story = {
  render: () => {
    function LimitedDemo() {
      const [value, setValue] = useState<DateSelectorValue>();
      return (
        <DateSelector
          defaultPeriodType="month"
          onChange={setValue}
          periodTypes={["month", "quarter", "year"]}
          value={value}
        />
      );
    }
    return <LimitedDemo />;
  },
};

/** Localise every label by passing a partial `i18n` override. */
export const Internationalized: Story = {
  render: () => {
    function I18nDemo() {
      const [value, setValue] = useState<DateSelectorValue>();
      const de: Partial<DateSelectorI18nConfig> = {
        filterTypes: {
          is: "ist",
          before: "vor",
          after: "nach",
          between: "zwischen",
        },
        periodTypes: {
          day: "Tag",
          month: "Monat",
          quarter: "Quartal",
          halfYear: "Halbjahr",
          year: "Jahr",
        },
        placeholder: "Datum wählen...",
        weekdaysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
      };
      return <DateSelector i18n={de} onChange={setValue} value={value} />;
    }
    return <I18nDemo />;
  },
};

/** Hide the text input to show only the picker grid. */
export const WithoutInput: Story = {
  render: () => {
    function NoInputDemo() {
      const [value, setValue] = useState<DateSelectorValue>();
      return (
        <DateSelector onChange={setValue} showInput={false} value={value} />
      );
    }
    return <NoInputDemo />;
  },
};
