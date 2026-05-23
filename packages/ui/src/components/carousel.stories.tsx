import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

const meta: Meta<typeof Carousel> = {
  title: "Data Display/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Touch-friendly carousel built on **Embla Carousel**.",
          "Compose it from: `Carousel` (root), `CarouselContent` (scroll container),",
          "`CarouselItem` (each slide), `CarouselPrevious` / `CarouselNext` (navigation).",
          "",
          "`Carousel` accepts `opts` (Embla options), `plugins`, `orientation`",
          "(`horizontal` | `vertical`), and `setApi` to get the Embla API instance.",
          "",
          "Keyboard: ← / → arrow keys scroll the active carousel.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Scroll axis.",
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
  args: {
    orientation: "horizontal",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const slides = [
  { id: 1, label: "Slide 1", bg: "bg-primary/10" },
  { id: 2, label: "Slide 2", bg: "bg-info/10" },
  { id: 3, label: "Slide 3", bg: "bg-success/10" },
  { id: 4, label: "Slide 4", bg: "bg-warning/10" },
  { id: 5, label: "Slide 5", bg: "bg-destructive/10" },
];

/** Interactive playground — switch orientation in the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-72 px-12">
      <Carousel {...args}>
        <CarouselContent>
          {slides.map(({ id, label, bg }) => (
            <CarouselItem key={id}>
              <div
                className={`flex h-40 items-center justify-center rounded-xl ${bg} font-medium text-sm`}
              >
                {label}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Orientations                                                        */
/* ------------------------------------------------------------------ */

/** Default horizontal scroll with Previous / Next buttons. */
export const Horizontal: Story = {
  render: () => (
    <div className="w-72 px-12">
      <Carousel orientation="horizontal">
        <CarouselContent>
          {slides.map(({ id, label, bg }) => (
            <CarouselItem key={id}>
              <div
                className={`flex h-40 items-center justify-center rounded-xl ${bg} font-medium text-sm`}
              >
                {label}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/** Vertical scroll — useful for vertically oriented UIs. */
export const Vertical: Story = {
  render: () => (
    <div className="py-12">
      <Carousel className="h-48" orientation="vertical">
        <CarouselContent className="h-48">
          {slides.map(({ id, label, bg }) => (
            <CarouselItem key={id}>
              <div
                className={`flex h-40 items-center justify-center rounded-xl ${bg} font-medium text-sm`}
              >
                {label}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Partial-view (peek next slide)                                      */
/* ------------------------------------------------------------------ */

/** Each item takes 80 % width so the next slide peeks in. */
export const WithPeek: Story = {
  render: () => (
    <div className="w-80 px-12">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {slides.map(({ id, label, bg }) => (
            <CarouselItem className="basis-4/5" key={id}>
              <div
                className={`flex h-36 items-center justify-center rounded-xl ${bg} font-medium text-sm`}
              >
                {label}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Multi-slide (show 2 at once)                                        */
/* ------------------------------------------------------------------ */

/** Two slides visible simultaneously using `basis-1/2`. */
export const TwoSlides: Story = {
  render: () => (
    <div className="w-96 px-12">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {slides.map(({ id, label, bg }) => (
            <CarouselItem className="basis-1/2" key={id}>
              <div
                className={`flex h-36 items-center justify-center rounded-xl ${bg} font-medium text-sm`}
              >
                {label}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Image gallery                                                       */
/* ------------------------------------------------------------------ */

/** Realistic image gallery with aspect-ratio locked images. */
export const ImageGallery: Story = {
  render: () => (
    <div className="w-80 px-12">
      <Carousel>
        <CarouselContent>
          {[10, 20, 30, 40, 50].map((seed) => (
            <CarouselItem key={seed}>
              <div className="overflow-hidden rounded-xl">
                <img
                  alt={`Slide ${seed}`}
                  className="aspect-video w-full object-cover"
                  src={`https://picsum.photos/seed/${seed}/640/360`}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
