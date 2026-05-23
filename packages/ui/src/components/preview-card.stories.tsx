import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardTrigger,
} from "./preview-card";

const meta: Meta<typeof PreviewCard> = {
  title: "Patterns/Preview Card",
  component: PreviewCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A hover-triggered preview card built on **Base UI** `PreviewCard`.",
          "",
          "Composition:",
          "- `PreviewCard` — root provider.",
          "- `PreviewCardTrigger` — hover target. Accepts `delay` and `closeDelay` (default 300 ms).",
          "- `PreviewCardPortal` → `PreviewCardPositioner` → `PreviewCardPopup` — layered popup stack.",
          "- `PreviewCardArrow` — decorative arrow pointing at the trigger.",
          "- `PreviewCardBackdrop` — optional fixed backdrop for mobile touch support.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Default preview card — hover the link to reveal the card. */
export const Playground: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger className="cursor-pointer text-primary underline underline-offset-4">
        Hover over this link
      </PreviewCardTrigger>
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup>
            <div className="flex flex-col gap-2">
              <div className="h-32 w-full rounded-md bg-muted" />
              <p className="font-semibold text-sm">Preview Title</p>
              <p className="text-muted-foreground text-xs">
                This is a short description that gives context about the hovered
                item before navigating to it.
              </p>
            </div>
            <PreviewCardArrow />
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  ),
};

/** With an image thumbnail in the card body. */
export const WithImage: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger className="cursor-pointer font-medium text-primary underline underline-offset-4">
        React documentation
      </PreviewCardTrigger>
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup>
            <div className="flex gap-3">
              <div className="h-16 w-16 shrink-0 rounded-md bg-blue-100" />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm">React</p>
                <p className="text-muted-foreground text-xs">
                  The library for web and native user interfaces.
                </p>
              </div>
            </div>
            <PreviewCardArrow />
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  ),
};

/** Custom delay — opens after 600 ms, closes after 600 ms. */
export const CustomDelay: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger
        className="cursor-pointer text-primary underline underline-offset-4"
        closeDelay={600}
        delay={600}
      >
        Slow preview (600 ms)
      </PreviewCardTrigger>
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup>
            <p className="text-sm">
              This card took 600 ms to open and will take 600 ms to close.
            </p>
            <PreviewCardArrow />
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  ),
};

/** No delay — instant open/close. */
export const Instant: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger
        className="cursor-pointer text-primary underline underline-offset-4"
        closeDelay={0}
        delay={0}
      >
        Instant preview
      </PreviewCardTrigger>
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup>
            <p className="text-sm">Opens and closes instantly.</p>
            <PreviewCardArrow />
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  ),
};
