import {
  ComputerIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CardCheckboxGroup, CardCheckboxItem } from "./card-checkbox";

const meta: Meta<typeof CardCheckboxItem> = {
  title: "Patterns/Card Checkbox",
  component: CardCheckboxItem,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A card-style checkbox built on our `Checkbox` primitive.",
          "",
          "- `CardCheckboxItem` renders a full-width card with a checkbox, optional `icon`, `label`, and `description`.",
          "- `variant='compact'` shrinks the card to auto width.",
          "- `layout='start'` aligns items to the top (useful with multiline descriptions).",
          "- Group multiple items with `CardCheckboxGroup` (applies a CSS grid gap).",
          "- The card border highlights with `ring` color when the checkbox is checked.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact"],
      description: "Width behaviour of the card.",
      table: { defaultValue: { summary: "default" } },
    },
    layout: {
      control: "select",
      options: ["default", "start"],
      description: "Vertical alignment of icon/label within the card.",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and reduces opacity.",
    },
  },
  args: {
    variant: "default",
    layout: "default",
    disabled: false,
    label: "Card option",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <CardCheckboxItem
        {...args}
        id="playground-item"
        label={args.label ?? "Card option"}
      />
    </div>
  ),
};

/** Three device options in a group. */
export const Group: Story = {
  render: () => {
    function DeviceGroup() {
      const [checked, setChecked] = useState<Record<string, boolean>>({
        desktop: true,
        mobile: false,
        tablet: false,
      });
      return (
        <div className="w-80">
          <CardCheckboxGroup>
            <CardCheckboxItem
              checked={checked.desktop}
              description="Optimised for large screens"
              icon={<HugeiconsIcon className="size-5" icon={ComputerIcon} />}
              id="device-desktop"
              label="Desktop"
              onCheckedChange={(v) =>
                setChecked((p) => ({ ...p, desktop: Boolean(v) }))
              }
            />
            <CardCheckboxItem
              checked={checked.mobile}
              description="Optimised for small screens"
              icon={
                <HugeiconsIcon className="size-5" icon={SmartPhone01Icon} />
              }
              id="device-mobile"
              label="Mobile"
              onCheckedChange={(v) =>
                setChecked((p) => ({ ...p, mobile: Boolean(v) }))
              }
            />
            <CardCheckboxItem
              checked={checked.tablet}
              description="Optimised for medium screens"
              icon={<HugeiconsIcon className="size-5" icon={Tablet01Icon} />}
              id="device-tablet"
              label="Tablet"
              onCheckedChange={(v) =>
                setChecked((p) => ({ ...p, tablet: Boolean(v) }))
              }
            />
          </CardCheckboxGroup>
        </div>
      );
    }
    return <DeviceGroup />;
  },
};

/** Compact variant — card shrinks to content width. */
export const Compact: Story = {
  render: () => (
    <div className="flex gap-3">
      <CardCheckboxItem
        defaultChecked
        id="compact-a"
        label="Option A"
        variant="compact"
      />
      <CardCheckboxItem id="compact-b" label="Option B" variant="compact" />
      <CardCheckboxItem id="compact-c" label="Option C" variant="compact" />
    </div>
  ),
};

/** With description text (layout=start for top-alignment). */
export const WithDescription: Story = {
  render: () => (
    <div className="w-80">
      <CardCheckboxItem
        defaultChecked
        description="This option will be included in your monthly report."
        id="with-desc"
        label="Include in report"
        layout="start"
      />
    </div>
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <CardCheckboxItem
        checked
        description="This option is not available."
        disabled
        id="disabled-item"
        label="Unavailable option"
        layout="start"
      />
    </div>
  ),
};
