import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
  title: "Actions/Toggle Group",
  component: ToggleGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A set of toggles that share a single selection. By default only one",
          "item can be active (single-choice); set `toggleMultiple` for a",
          "multi-select toolbar. Each `ToggleGroupItem` needs a `value`, and",
          "the group is controlled via `value` / `defaultValue` (an array).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      table: { defaultValue: { summary: "default" } },
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { defaultValue: { summary: "horizontal" } },
    },
    multiple: {
      control: "boolean",
      description: "Allow more than one item to be active.",
    },
    disabled: { control: "boolean" },
  },
  args: {
    variant: "outline",
    size: "default",
    orientation: "horizontal",
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const alignItems = (
  <>
    <ToggleGroupItem aria-label="Align left" value="left">
      <HugeiconsIcon icon={TextAlignLeftIcon} />
    </ToggleGroupItem>
    <ToggleGroupItem aria-label="Align center" value="center">
      <HugeiconsIcon icon={TextAlignCenterIcon} />
    </ToggleGroupItem>
    <ToggleGroupItem aria-label="Align right" value="right">
      <HugeiconsIcon icon={TextAlignRightIcon} />
    </ToggleGroupItem>
  </>
);

/** Single-choice alignment toolbar (default behaviour). */
export const Playground: Story = {
  args: { defaultValue: ["center"] },
  render: (args) => <ToggleGroup {...args}>{alignItems}</ToggleGroup>,
};

/** `default` vs `outline`, both joined into a single control. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup {...args} defaultValue={["left"]} variant="default">
        {alignItems}
      </ToggleGroup>
      <ToggleGroup {...args} defaultValue={["left"]} variant="outline">
        {alignItems}
      </ToggleGroup>
    </div>
  ),
};

/** Three sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <ToggleGroup {...args} defaultValue={["center"]} key={size} size={size}>
          {alignItems}
        </ToggleGroup>
      ))}
    </div>
  ),
};

/**
 * Multi-select with `multiple` — independent text-formatting switches,
 * any combination allowed.
 */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["bold", "underline"] },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem aria-label="Bold" value="bold">
        <HugeiconsIcon icon={TextBoldIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Italic" value="italic">
        <HugeiconsIcon icon={TextItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Underline" value="underline">
        <HugeiconsIcon icon={TextUnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/** Spaced-out items via `spacing`, instead of a seamless joined group. */
export const Spaced: Story = {
  args: { spacing: 4, defaultValue: ["center"] },
  render: (args) => <ToggleGroup {...args}>{alignItems}</ToggleGroup>,
};

/** Vertical orientation. */
export const Vertical: Story = {
  args: { orientation: "vertical", defaultValue: ["center"] },
  render: (args) => <ToggleGroup {...args}>{alignItems}</ToggleGroup>,
};

/** A disabled group. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["center"] },
  render: (args) => <ToggleGroup {...args}>{alignItems}</ToggleGroup>,
};
