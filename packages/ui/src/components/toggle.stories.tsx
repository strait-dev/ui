import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { Toggle } from "./toggle";

type ToggleEmphasis = NonNullable<ComponentProps<typeof Toggle>["emphasis"]>;
type ToggleSize = NonNullable<ComponentProps<typeof Toggle>["size"]>;
type ToggleVariant = NonNullable<ComponentProps<typeof Toggle>["variant"]>;

const emphasisOptions: ToggleEmphasis[] = ["default", "outline"];
const sizeOptions: ToggleSize[] = ["xs", "sm", "default", "lg", "xl"];
const variantOptions: ToggleVariant[] = [
  "default",
  "destructive",
  "success",
  "info",
  "warning",
];

const meta = {
  title: "Actions/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A two-state button that can be on or off — useful for toolbar",
          "controls like bold/italic. Use `pressed` (controlled) or",
          "`defaultPressed` (uncontrolled); the on state is exposed as",
          "`data-[state=on]`. Always give icon-only toggles an `aria-label`.",
          "",
          "**Size** — five presets: `xs` (24 px), `sm` (28 px), `default` (32 px),",
          "`lg` (36 px), `xl` (40 px).",
          "",
          "**Variant** — five colour treatments for the pressed/active state:",
          "`default` (muted), `destructive`, `success`, `info`, `warning`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    emphasis: {
      control: "select",
      options: emphasisOptions,
      description: "Visual style.",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: sizeOptions,
      description: "Height/padding preset.",
      table: { defaultValue: { summary: "default" } },
    },
    variant: {
      control: "select",
      options: variantOptions,
      description: "Tints the pressed/active state.",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: { control: "boolean", description: "Disables the toggle." },
    defaultPressed: {
      control: "boolean",
      description: "Initial pressed state (uncontrolled).",
    },
  },
  args: {
    emphasis: "default",
    size: "default",
    variant: "default",
    "aria-label": "Toggle bold",
    children: <HugeiconsIcon icon={TextBoldIcon} />,
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — toggle the controls to explore states. */
export const Playground: Story = {};

/** The two visual styles. */
export const Emphasis: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {emphasisOptions.map((emphasis) => (
        <Toggle {...args} emphasis={emphasis} key={emphasis} />
      ))}
    </div>
  ),
};

/** All five sizes, from `xs` to `xl`. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {sizeOptions.map((size) => (
        <Toggle {...args} emphasis="outline" key={size} size={size} />
      ))}
    </div>
  ),
};

/** All five variant colours — shown in the pressed/on state. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {variantOptions.map((variant) => (
        <Toggle
          {...args}
          defaultPressed
          emphasis="outline"
          key={variant}
          variant={variant}
        />
      ))}
    </div>
  ),
};

/** Off, on (`defaultPressed`), and disabled. */
export const States: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Toggle {...args} aria-label="Off" emphasis="outline" />
      <Toggle {...args} aria-label="On" defaultPressed emphasis="outline" />
      <Toggle {...args} aria-label="Disabled" disabled emphasis="outline" />
      <Toggle
        {...args}
        aria-label="Disabled on"
        defaultPressed
        disabled
        emphasis="outline"
      />
    </div>
  ),
};

/** A toggle with an icon and a text label. */
export const WithText: Story = {
  args: {
    "aria-label": undefined,
    children: undefined,
  },
  render: (args) => (
    <Toggle {...args} aria-label="Italic" emphasis="outline">
      <HugeiconsIcon icon={TextItalicIcon} />
      Italic
    </Toggle>
  ),
};

/** Icon-only toggles — the common toolbar shape. */
export const IconOnly: Story = {
  args: { children: undefined },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Toggle {...args} aria-label="Bold" emphasis="outline">
        <HugeiconsIcon icon={TextBoldIcon} />
      </Toggle>
      <Toggle {...args} aria-label="Italic" emphasis="outline">
        <HugeiconsIcon icon={TextItalicIcon} />
      </Toggle>
      <Toggle {...args} aria-label="Underline" emphasis="outline">
        <HugeiconsIcon icon={TextUnderlineIcon} />
      </Toggle>
    </div>
  ),
};
