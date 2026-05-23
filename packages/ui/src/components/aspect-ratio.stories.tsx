import type { Meta, StoryObj } from "@storybook/react-vite";

import { AspectRatio } from "./aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "Data Display/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Constrains its child to a fixed aspect ratio using the CSS custom",
          "property `--ratio`. Pass any numeric ratio: `16/9`, `4/3`, `1`, `3/2`, etc.",
          "",
          "It renders a single `<div>` with `position: relative` — place your",
          "child with `position: absolute; inset: 0` to fill it.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    ratio: {
      control: { type: "number", min: 0.1, step: 0.1 },
      description: "Width / height ratio (e.g. `16/9` = `1.777…`).",
    },
  },
  args: {
    ratio: 16 / 9,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — edit the `ratio` in the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-80">
      <AspectRatio {...args}>
        <img
          alt="Playground"
          className="size-full rounded-xl object-cover"
          src="https://picsum.photos/seed/ar/640/360"
        />
      </AspectRatio>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Common ratios                                                       */
/* ------------------------------------------------------------------ */

/** A gallery of the most common aspect ratios with labelled images. */
export const CommonRatios: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-3 gap-4">
      {(
        [
          { label: "16:9", ratio: 16 / 9 },
          { label: "4:3", ratio: 4 / 3 },
          { label: "1:1", ratio: 1 },
          { label: "3:2", ratio: 3 / 2 },
          { label: "2:3", ratio: 2 / 3 },
          { label: "21:9", ratio: 21 / 9 },
        ] as { label: string; ratio: number }[]
      ).map(({ label, ratio }) => (
        <div key={label}>
          <AspectRatio
            className="overflow-hidden rounded-lg bg-muted"
            ratio={ratio}
          >
            <img
              alt={label}
              className="size-full object-cover"
              src={`https://picsum.photos/seed/${label}/400`}
            />
            <span className="absolute bottom-1 right-2 rounded bg-black/60 px-1 py-0.5 font-mono text-white text-xs">
              {label}
            </span>
          </AspectRatio>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Video embed                                                         */
/* ------------------------------------------------------------------ */

/** Embeds a 16:9 YouTube iframe responsively. */
export const VideoEmbed: Story = {
  render: () => (
    <div className="w-96">
      <AspectRatio ratio={16 / 9}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full rounded-xl"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Demo video"
        />
      </AspectRatio>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Placeholder / skeleton                                              */
/* ------------------------------------------------------------------ */

/** Loading skeleton respects aspect ratio before the image loads. */
export const WithPlaceholder: Story = {
  render: () => (
    <div className="w-80">
      <AspectRatio
        className="overflow-hidden rounded-xl bg-muted animate-pulse"
        ratio={16 / 9}
      >
        <span className="sr-only">Loading image…</span>
      </AspectRatio>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Square avatar crop                                                  */
/* ------------------------------------------------------------------ */

/** 1:1 ratio — crop an image to a square. */
export const Square: Story = {
  render: () => (
    <div className="w-40">
      <AspectRatio className="overflow-hidden rounded-xl" ratio={1}>
        <img
          alt="Square crop"
          className="size-full object-cover"
          src="https://picsum.photos/seed/sq/400"
        />
      </AspectRatio>
    </div>
  ),
};
