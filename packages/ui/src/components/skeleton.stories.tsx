import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "./skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A pulsing placeholder that indicates content is loading.",
          "It is a single `<div>` with `animate-pulse` and `bg-muted` applied,",
          "sized entirely via `className`. Compose multiple `Skeleton`s to mirror",
          "the layout of the real content.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "Tailwind classes for size and shape (`rounded-full` etc.).",
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — edit `className` to see different shapes. */
export const Playground: Story = {
  args: { className: "h-4 w-48" },
};

/** Basic shape variants: rectangle, rounded, circle, and square. */
export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex flex-col items-start gap-2">
        <span className="text-muted-foreground text-xs">Rectangle</span>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex flex-col items-start gap-2">
        <span className="text-muted-foreground text-xs">Pill</span>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex flex-col items-start gap-2">
        <span className="text-muted-foreground text-xs">Circle</span>
        <Skeleton className="size-10 rounded-full" />
      </div>
      <div className="flex flex-col items-start gap-2">
        <span className="text-muted-foreground text-xs">Square</span>
        <Skeleton className="size-10 rounded-md" />
      </div>
    </div>
  ),
};

/** A realistic card skeleton that mirrors a typical card layout. */
export const CardSkeleton: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4 rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  ),
};

/** A table / list skeleton useful for data-heavy views. */
export const TableSkeleton: Story = {
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-3">
      {/* Header row */}
      <div className="flex gap-4">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="ml-auto h-4 w-16" />
      </div>
      {/* Data rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
        <div className="flex items-center gap-4" key={i}>
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="ml-auto h-3 w-12" />
        </div>
      ))}
    </div>
  ),
};

/** A profile / settings skeleton. */
export const ProfileSkeleton: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col items-center gap-4 pt-4">
      <Skeleton className="size-20 rounded-full" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  ),
};
