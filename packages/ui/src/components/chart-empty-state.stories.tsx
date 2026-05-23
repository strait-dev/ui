import { BarChartIcon } from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { ChartEmptyState } from "./chart-empty-state";

const meta: Meta<typeof ChartEmptyState> = {
  title: "Feedback/Chart Empty State",
  component: ChartEmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Thin presentational empty state for charts and data panels with no content.",
          "",
          "Renders a centered column with an icon tile, an optional heading, a muted",
          "message, and an optional CTA slot. Designed to sit directly inside a chart",
          "container when the dataset is empty, a filter returns zero results, or a",
          "query completes without data.",
          "",
          "No state, no side-effects — safe for React Server Components.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    message: {
      control: "text",
      description: "Required muted body copy explaining the empty state.",
    },
    title: {
      control: "text",
      description: "Optional bold-ish heading rendered above the message.",
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes merged onto the root element.",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description:
        "Visual scale: `sm` for small panels, `default` unchanged, `lg` for hero states.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    message: "No data available for this period.",
    title: undefined,
    action: undefined,
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — toggle title, tweak message, swap icon. */
export const Playground: Story = {
  args: {
    title: "Nothing to display",
    message: "Add a data source to start seeing charts here.",
  },
};

/** Includes a call-to-action button beneath the message. */
export const WithAction: Story = {
  args: {
    title: "No chart data",
    message: "Connect a data source to populate this chart.",
    action: <Button size="sm">Add data source</Button>,
  },
};

/** Minimal usage — only the required `message` prop. */
export const Minimal: Story = {
  args: {
    message: "No data available.",
  },
};

/** Custom icon overriding the default ChartLineData01Icon. */
export const CustomIcon: Story = {
  args: {
    icon: BarChartIcon,
    title: "Empty bar chart",
    message: "Run a query to populate this chart.",
  },
};

/** All three `size` values stacked for visual comparison. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-8">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div className="flex flex-col items-center gap-1" key={size}>
          <span className="text-muted-foreground text-xs">size="{size}"</span>
          <ChartEmptyState
            message="No data available for this period."
            size={size}
            title="Nothing to display"
          />
        </div>
      ))}
    </div>
  ),
};
