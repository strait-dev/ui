import type { Meta, StoryObj } from "@storybook/react-vite";
import { IdCell } from "./id-cell";
import { TooltipProvider } from "./tooltip";

const meta: Meta<typeof IdCell> = {
  title: "Patterns/ID Cell",
  component: IdCell,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A table-cell widget that displays a truncated ID with a copy-to-clipboard button.",
          "",
          "Composes `Tooltip`, `TooltipTrigger`, `TooltipContent`, and `Button` primitives",
          "with `copy-to-clipboard`, `motion/react` `AnimatePresence`, and a toast",
          "notification. The first 6 characters of `id` are shown; hovering the truncated",
          "text reveals the full value in a tooltip. The copy button animates between",
          "a copy icon and a check icon for 2 seconds after clicking.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    id: {
      control: "text",
      description: "The full ID string to display and copy.",
    },
  },
  args: {
    id: "usr_01HZ8B3X9KFQW7MPNVE2TDCYS",
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — click the copy icon to see the animation and toast. */
export const Playground: Story = {};

/** Short UUID-style identifier. */
export const ShortUUID: Story = {
  args: {
    id: "3f2504e0-4f89-11d3-9a0c-0305e82c3301",
  },
};

/** Long prefixed ID — common in Stripe-style systems. */
export const PrefixedId: Story = {
  args: {
    id: "cus_NffrFeUfNV2Hib",
  },
};

/** Very long hash — demonstrates truncation. */
export const LongHash: Story = {
  args: {
    id: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
};

/** Minimal 6-character ID — still works, shows nothing after the cut. */
export const MinimalId: Story = {
  args: {
    id: "abc123",
  },
};
