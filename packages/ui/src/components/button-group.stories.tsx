import {
  ArrowDown01Icon,
  Backward01Icon,
  Copy01Icon,
  PauseIcon,
  PlayIcon,
  PlusSignIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group";

const meta = {
  title: "Actions/Button Group",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Joins related `Button`s into a single segmented control: the group",
          "collapses the inner border radii and shared borders so the buttons",
          "read as one unit. Use `ButtonGroupSeparator` to divide a split",
          "button and `ButtonGroupText` for inline labels or addons. Switch to",
          'a stacked layout with `orientation="vertical"`.',
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
  args: { orientation: "horizontal" },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A segmented control of joined outline buttons. */
export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button aria-label="Align left" size="icon" variant="outline">
        <HugeiconsIcon icon={TextAlignLeftIcon} />
      </Button>
      <Button aria-label="Align center" size="icon" variant="outline">
        <HugeiconsIcon icon={TextAlignCenterIcon} />
      </Button>
      <Button aria-label="Align right" size="icon" variant="outline">
        <HugeiconsIcon icon={TextAlignRightIcon} />
      </Button>
    </ButtonGroup>
  ),
};

/** Text labels in a row of joined buttons. */
export const Segmented: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  ),
};

/**
 * A split button: a primary action joined to an overflow trigger by a
 * `ButtonGroupSeparator`.
 */
export const SplitButton: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Save</Button>
      <ButtonGroupSeparator />
      <Button aria-label="More save options" size="icon" variant="outline">
        <HugeiconsIcon icon={ArrowDown01Icon} />
      </Button>
    </ButtonGroup>
  ),
};

/** `ButtonGroupText` provides an inline addon, here a copyable value. */
export const WithText: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>strait.dev/p/</ButtonGroupText>
      <Button aria-label="Copy link" size="icon" variant="outline">
        <HugeiconsIcon icon={Copy01Icon} />
      </Button>
    </ButtonGroup>
  ),
};

/** A media-style transport control mixing icons. */
export const IconBar: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button aria-label="Previous" size="icon" variant="outline">
        <HugeiconsIcon icon={Backward01Icon} />
      </Button>
      <Button aria-label="Play" size="icon" variant="outline">
        <HugeiconsIcon icon={PlayIcon} />
      </Button>
      <Button aria-label="Pause" size="icon" variant="outline">
        <HugeiconsIcon icon={PauseIcon} />
      </Button>
    </ButtonGroup>
  ),
};

/** Stacked vertically. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">
        <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
        New
      </Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="outline">Archive</Button>
    </ButtonGroup>
  ),
};
