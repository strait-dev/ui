import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { BarList } from "./bar-list";

type Referrer = { name: string; value: number; href?: string };

const referrers: Referrer[] = [
  { name: "google.com", value: 8420, href: "https://google.com" },
  { name: "github.com", value: 5210, href: "https://github.com" },
  { name: "twitter.com", value: 3180, href: "https://twitter.com" },
  { name: "producthunt.com", value: 1640, href: "https://producthunt.com" },
  { name: "direct", value: 920 },
];

const numberFormatter = (v: number) => v.toLocaleString();

const meta: Meta<typeof BarList> = {
  title: "Data Display/Bar List",
  component: BarList,
  tags: ["autodocs"],
  args: { data: referrers, valueFormatter: numberFormatter },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A horizontal ranked bar list — labels overlaid on value-proportional",
          "bars with the formatted value in a trailing column. Rows can link",
          "out (`href`) or become buttons (`onValueChange`). For a tokenised",
          "compound API with a header, reach for the `Leaderboard` component.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md">
      <BarList {...args} />
    </div>
  ),
};

export const Ascending: Story = {
  render: (args) => (
    <div className="max-w-md">
      <BarList {...args} sortOrder="ascending" />
    </div>
  ),
};

export const Unsorted: Story = {
  render: (args) => (
    <div className="max-w-md">
      <BarList {...args} sortOrder="none" />
    </div>
  ),
};

export const Clickable: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <div className="max-w-md space-y-3">
        <BarList
          data={referrers}
          onValueChange={(row) => setSelected(row.name)}
          valueFormatter={numberFormatter}
        />
        <p className="text-muted-foreground text-sm">
          Selected: <span className="font-medium">{selected ?? "none"}</span>
        </p>
      </div>
    );
  },
};
