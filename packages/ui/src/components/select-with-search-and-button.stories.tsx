import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  type SelectOptionWithSearchAndButton,
  SelectWithSearchAndButton,
} from "./select-with-search-and-button";

const FRAMEWORKS: SelectOptionWithSearchAndButton[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
  { value: "next", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
];

const meta: Meta<typeof SelectWithSearchAndButton> = {
  title: "Patterns/Select With Search And Button",
  component: SelectWithSearchAndButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A searchable select that appends an action button at the bottom of the dropdown, built on `Popover` + `Command` (cmdk).",
          "",
          "- The footer button (e.g. **Add new**) is separated from the option list by a `CommandSeparator`.",
          "- Provide `onButtonClick` to handle the button action; `buttonText` and `buttonIcon` customise the label/icon.",
          "- Supports `label`, `error`, `required`, and `disabled` props.",
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
    buttonText: {
      control: "text",
      description: "Text for the action button.",
    },
  },
  args: {
    options: FRAMEWORKS,
    placeholder: "Select a framework",
    label: "Framework",
    buttonText: "Add new framework",
    disabled: false,
    error: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledSelectWithButton(props: {
  options?: SelectOptionWithSearchAndButton[];
  label?: string;
  placeholder?: string;
  buttonText?: string;
  disabled?: boolean;
  error?: boolean;
  initialValue?: string;
  onButtonClick?: () => void;
}) {
  const [value, setValue] = useState<string>(props.initialValue ?? "");
  return (
    <div className="w-64">
      <SelectWithSearchAndButton
        buttonText={props.buttonText ?? "Add new"}
        disabled={props.disabled}
        error={props.error}
        label={props.label}
        onButtonClick={props.onButtonClick}
        onValueChange={setValue}
        options={props.options ?? FRAMEWORKS}
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
      <ControlledSelectWithButton
        buttonText={args.buttonText}
        disabled={args.disabled}
        error={args.error}
        label={args.label}
        onButtonClick={() => {
          window.alert("Add new framework clicked");
        }}
        options={args.options}
        placeholder={args.placeholder}
      />
    </div>
  ),
};

/** Without the action button (`onButtonClick` not provided). */
export const WithoutButton: Story = {
  render: () => (
    <div className="w-64">
      <ControlledSelectWithButton label="Framework" />
    </div>
  ),
};

/** Pre-selected value. */
export const WithPreselectedValue: Story = {
  render: () => (
    <div className="w-64">
      <ControlledSelectWithButton
        initialValue="react"
        label="Framework"
        onButtonClick={() => {}}
      />
    </div>
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <ControlledSelectWithButton
        disabled
        initialValue="vue"
        label="Framework (disabled)"
      />
    </div>
  ),
};

/** Error state. */
export const WithError: Story = {
  render: () => (
    <div className="w-64">
      <ControlledSelectWithButton error label="Framework" />
    </div>
  ),
};
