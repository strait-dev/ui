import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea, ScrollBar } from "./scroll-area";
import { Separator } from "./separator";

const meta = {
  title: "Layout/Scroll Area",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A scrollable container with a styled, always-visible scrollbar.",
          "Built on Base UI's `ScrollArea` primitive.",
          "",
          "Give the root a fixed height (or width for horizontal scroll) so content",
          "overflows and the scrollbar becomes active. Both `ScrollArea` (root) and",
          "`ScrollBar` (explicit scrollbar) are exported for full control.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description:
        "Extra classes applied to the root element (use to set `h-*` / `w-*`).",
    },
  },
  args: {},
} satisfies Meta<typeof ScrollArea>;

export default meta;

type Story = StoryObj<typeof meta>;

const tags = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Storybook",
  "Vite",
  "Bun",
  "Base UI",
  "Radix UI",
  "ESLint",
  "Biome",
  "pnpm",
  "Turborepo",
  "Vitest",
  "Playwright",
  "GraphQL",
  "tRPC",
  "Prisma",
  "PostgreSQL",
  "Redis",
  "Docker",
];

const messages = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  sender: i % 3 === 0 ? "Alice" : i % 3 === 1 ? "Bob" : "Carol",
  text: `Message ${i + 1}: ${["Hey, how's it going?", "Working on the new feature.", "Let's sync up later.", "Pushed a fix to main.", "Review PR when you have a sec."][i % 5]}`,
}));

/** Interactive playground — resize the viewport to see the scroll bar. */
export const Playground: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-72 w-80 rounded-lg border p-4">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id}>
            <p className="font-medium text-sm">{m.sender}</p>
            <p className="text-muted-foreground text-xs">{m.text}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/** A long list of tags demonstrating vertical scroll. */
export const VerticalList: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-48 w-56 rounded-lg border">
      <div className="p-4">
        <p className="mb-3 font-semibold text-sm">Technologies</p>
        {tags.map((tag, i) => (
          <div key={tag}>
            <div className="py-1.5 text-sm">{tag}</div>
            {i < tags.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

/** Horizontal scroll — the `ScrollBar` is rendered with `orientation="horizontal"`. */
export const Horizontal: Story = {
  render: (args) => (
    <ScrollArea {...args} className="w-80 rounded-lg border">
      <div className="flex gap-4 p-4">
        {tags.map((tag) => (
          <div
            className="flex h-20 w-28 shrink-0 items-center justify-center rounded-md bg-muted text-center font-medium text-xs"
            key={tag}
          >
            {tag}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

/** Both axes — a large grid that scrolls in both directions. */
export const BothAxes: Story = {
  render: (args) => (
    <ScrollArea {...args} className="h-56 w-80 rounded-lg border">
      <div
        className="grid gap-3 p-4"
        style={{ gridTemplateColumns: `repeat(${tags.length / 2}, 8rem)` }}
      >
        {Array.from({ length: 80 }, (_, i) => (
          <div
            className="flex h-12 items-center justify-center rounded-md bg-muted text-xs"
            // biome-ignore lint/suspicious/noArrayIndexKey: static list, no reordering
            key={i}
          >
            Cell {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

/** A constrained-height chat thread — the most common real-world pattern. */
export const ChatThread: Story = {
  render: (args) => (
    <div className="w-96 rounded-xl border">
      <div className="border-b px-4 py-3 font-semibold text-sm">Team Chat</div>
      <ScrollArea {...args} className="h-64">
        <div className="flex flex-col gap-3 p-4">
          {messages.map((m) => (
            <div
              className={`flex flex-col gap-0.5 ${m.id % 2 === 0 ? "items-end" : "items-start"}`}
              key={m.id}
            >
              <span className="text-[10px] text-muted-foreground">
                {m.sender}
              </span>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                  m.id % 2 === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
