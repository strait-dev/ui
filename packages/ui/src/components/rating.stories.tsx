import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { Rating } from "./rating";

const meta: Meta<typeof Rating> = {
  title: "Forms/Rating",
  component: Rating,
  tags: ["autodocs"],
  args: { defaultValue: 3, max: 5 },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A star rating input that supports controlled, uncontrolled,",
          "read-only, and disabled states. Interactive mode uses a",
          '`role="radiogroup"` with `<button role="radio">` for each star,',
          "supporting both mouse hover previews and full keyboard navigation",
          "(ArrowRight/Left, Home, End). Read-only mode renders semantic",
          '`<span>` elements with `role="img"`. Three sizes: `sm`, `default`,',
          "and `lg`.",
        ].join(" "),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — tweak the controls to explore all states. */
export const Playground: Story = {};

/** Three star sizes rendered side by side. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-16 text-muted-foreground text-sm">sm</span>
        <Rating {...args} aria-label="Small rating" size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-muted-foreground text-sm">default</span>
        <Rating {...args} aria-label="Default rating" size="default" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-muted-foreground text-sm">lg</span>
        <Rating {...args} aria-label="Large rating" size="lg" />
      </div>
    </div>
  ),
};

/** Non-interactive display with `readOnly`. */
export const ReadOnly: Story = {
  args: { readOnly: true },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Rating {...args} aria-label="Rated 1 out of 5" value={1} />
      <Rating {...args} aria-label="Rated 3 out of 5" value={3} />
      <Rating {...args} aria-label="Rated 5 out of 5" value={5} />
    </div>
  ),
};

/** Dimmed and non-interactive with `disabled`. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 3 },
  render: (args) => <Rating {...args} aria-label="Disabled rating" />,
};

/** Fully controlled — the parent manages the selected value via React state. */
export const Controlled: Story = {
  render: () => {
    const [v, setV] = React.useState(2);
    return (
      <div className="flex flex-col gap-3">
        <Rating
          aria-label="Controlled rating"
          max={5}
          onValueChange={setV}
          value={v}
        />
        <p className="text-muted-foreground text-sm">Selected: {v} / 5</p>
      </div>
    );
  },
};
