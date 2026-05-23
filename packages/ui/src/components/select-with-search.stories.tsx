import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { type SelectOption, SelectWithSearch } from "./select-with-search";

const COUNTRIES: SelectOption[] = [
  { value: "br", label: "Brazil" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "au", label: "Australia" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
];

const meta: Meta<typeof SelectWithSearch> = {
  title: "Patterns/Select With Search",
  component: SelectWithSearch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A searchable select built on our `Popover` + `Command` (cmdk) primitives, with **react-virtuoso** for large option lists.",
          "",
          "- Filtering is handled externally (`shouldFilter={false}` on Command); use `onSearchChange` to drive server-side search.",
          "- `renderOption` / `renderSelectedOption` accept render-prop overrides for custom item display.",
          "- `onEndReached` enables infinite-scroll loading; `isFetchingNextPage` + `renderLoading` show a footer spinner.",
          "- Supports `label`, `error`, `required`, `disabled`, and `size` props.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the trigger.",
    },
    error: {
      control: "boolean",
      description: "Applies destructive border.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder when nothing is selected.",
    },
    label: {
      control: "text",
      description: "Label rendered above the trigger.",
    },
  },
  args: {
    options: COUNTRIES,
    placeholder: "Select a country",
    label: "Country",
    disabled: false,
    error: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledSelect(props: {
  options?: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  initialValue?: string;
}) {
  const [value, setValue] = useState<string>(props.initialValue ?? "");
  return (
    <div className="w-64">
      <SelectWithSearch
        disabled={props.disabled}
        error={props.error}
        label={props.label}
        onValueChange={setValue}
        options={props.options ?? COUNTRIES}
        placeholder={props.placeholder}
        value={value}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {value || "Nothing selected"}
      </p>
    </div>
  );
}

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-64">
      <ControlledSelect
        disabled={args.disabled}
        error={args.error}
        label={args.label}
        options={args.options}
        placeholder={args.placeholder}
      />
    </div>
  ),
};

/** No pre-selected value. */
export const Empty: Story = {
  render: () => (
    <div className="w-64">
      <ControlledSelect label="Country" placeholder="Select a country" />
    </div>
  ),
};

/** Pre-selected value. */
export const WithPreselectedValue: Story = {
  render: () => (
    <div className="w-64">
      <ControlledSelect
        initialValue="br"
        label="Country"
        placeholder="Select a country"
      />
    </div>
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <ControlledSelect
        disabled
        initialValue="us"
        label="Country (disabled)"
        placeholder="Select a country"
      />
    </div>
  ),
};

/** Error state. */
export const WithError: Story = {
  render: () => (
    <div className="w-64">
      <ControlledSelect error label="Country" placeholder="Select a country" />
    </div>
  ),
};
