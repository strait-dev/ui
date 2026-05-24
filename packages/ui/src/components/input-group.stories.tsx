import {
  Dollar01Icon,
  Mail01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";
import { Label } from "./label";

const meta = {
  title: "Forms/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Composes an `InputGroupInput` (or `InputGroupTextarea`) with optional",
          "addons: icons, text, or buttons.",
          "",
          "**Sub-components**",
          "- `InputGroupAddon` — positions a decorator at `inline-start`, `inline-end`,",
          "  `block-start`, or `block-end`.",
          "- `InputGroupText` — inline label/icon (non-interactive).",
          "- `InputGroupButton` — a compact button inside the group.",
          "- `InputGroupInput` — the bare input (border/ring handled by `InputGroup`).",
          "- `InputGroupTextarea` — a bare textarea variant.",
          "",
          "Focus, disabled, and invalid states are lifted from the inner control",
          "to the outer group border via CSS `has-[]` selectors.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Playground                                                          */
/* ------------------------------------------------------------------ */

/** Search field with an icon prefix and a submit button suffix. */
export const Playground: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="ig-search">Search</Label>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <HugeiconsIcon className="size-4" icon={Search01Icon} />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="ig-search" placeholder="Search anything…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs" type="submit" variant="secondary">
            Go
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Text addons                                                         */
/* ------------------------------------------------------------------ */

/** Inline text labels at the start or end (e.g. currency, protocol). */
export const TextAddons: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-price">Price</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Dollar01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-price" placeholder="0.00" type="number" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-url">Website</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-url" placeholder="example.com" type="text" />
        </InputGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-email">Email</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Mail01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="ig-email"
            placeholder="you@example.com"
            type="email"
          />
        </InputGroup>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Button addons                                                       */
/* ------------------------------------------------------------------ */

/** Copy / clear buttons at the end of the input. */
export const ButtonAddons: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-copy">API key</Label>
        <InputGroup>
          <InputGroupInput
            defaultValue="sk_live_AbCdEfGhIjKl"
            id="ig-copy"
            readOnly
            type="text"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs" variant="ghost">
              Copy
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Block addons                                                        */
/* ------------------------------------------------------------------ */

/** Labels stacked above or below the input (block-start / block-end). */
export const BlockAddons: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Message with character limit</Label>
        <InputGroup>
          <InputGroupAddon align="block-start">
            <span className="font-medium text-xs">Subject</span>
          </InputGroupAddon>
          <InputGroupInput placeholder="Enter subject…" />
          <InputGroupAddon align="block-end">
            <span className="text-muted-foreground text-xs">0 / 100</span>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** Disabled and invalid states propagate visually to the group border. */
export const States: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Disabled</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Search01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput disabled placeholder="Cannot search" />
        </InputGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Invalid</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Mail01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            aria-invalid
            placeholder="you@example.com"
            type="email"
          />
        </InputGroup>
        <p className="text-destructive text-sm">Enter a valid email address.</p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Textarea variant                                                    */
/* ------------------------------------------------------------------ */

/** `InputGroupTextarea` for multi-line input with an addon. */
export const TextareaVariant: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label>Message</Label>
      <InputGroup>
        <InputGroupTextarea placeholder="Write your message…" rows={4} />
        <InputGroupAddon align="block-end">
          <InputGroupButton size="xs" variant="secondary">
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};
