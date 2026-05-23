import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "./spinner";

const meta = {
  title: "Feedback/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An animated loading indicator that wraps the `Loading03Icon` from",
          "HugeIcons. It renders as an `<svg>` so it inherits `currentColor` and",
          "can be sized with the `className` prop or by setting `width`/`height`.",
          "",
          "Use the `strokeWidth` prop to adjust line thickness.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    strokeWidth: {
      control: { type: "range", min: 1, max: 4, step: 0.5 },
      description: "SVG stroke width passed to the icon.",
      table: { defaultValue: { summary: "2" } },
    },
    className: {
      control: "text",
      description:
        "Tailwind classes — use `size-*` to change dimensions and `text-*` for colour.",
    },
  },
  args: {
    strokeWidth: 2,
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {};

/** Common sizes expressed via `className`. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(
        [
          { label: "xs", cls: "size-3" },
          { label: "sm", cls: "size-4" },
          { label: "md", cls: "size-5" },
          { label: "lg", cls: "size-6" },
          { label: "xl", cls: "size-8" },
          { label: "2xl", cls: "size-10" },
        ] as const
      ).map(({ label, cls }) => (
        <div className="flex flex-col items-center gap-2" key={label}>
          <Spinner {...args} className={cls} />
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  ),
};

/** Colour variants via `text-*` Tailwind utilities. */
export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(
        [
          { label: "default", cls: "text-foreground" },
          { label: "muted", cls: "text-muted-foreground" },
          { label: "brand", cls: "text-blue-500" },
          { label: "success", cls: "text-emerald-500" },
          { label: "warning", cls: "text-amber-500" },
          { label: "destructive", cls: "text-destructive" },
        ] as const
      ).map(({ label, cls }) => (
        <div className="flex flex-col items-center gap-2" key={label}>
          <Spinner {...args} className={`size-5 ${cls}`} />
          <span className="text-muted-foreground text-xs">{label}</span>
        </div>
      ))}
    </div>
  ),
};

/** Stroke-width variants. */
export const StrokeWidths: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {([1, 1.5, 2, 2.5, 3] as const).map((sw) => (
        <div className="flex flex-col items-center gap-2" key={sw}>
          <Spinner {...args} className="size-6" strokeWidth={sw} />
          <span className="text-muted-foreground text-xs">sw={sw}</span>
        </div>
      ))}
    </div>
  ),
};
