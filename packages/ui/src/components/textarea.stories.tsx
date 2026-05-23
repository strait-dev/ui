import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A multi-line text input. Uses `field-sizing-content` so the element",
          "auto-grows as the user types — no fixed height required.",
          "",
          "Accepts all native `<textarea>` attributes. Pass `aria-invalid={true}`",
          "to show the destructive validation state.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the field is empty.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the textarea and prevents interaction.",
    },
    rows: {
      control: { type: "number", min: 2, max: 20 },
      description: "Initial visible row count.",
    },
  },
  args: {
    placeholder: "Write something…",
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** Default empty state. */
export const Default: Story = {
  args: { placeholder: "Enter your message" },
};

/** Disabled — interaction is blocked and opacity is reduced. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "This text cannot be edited." },
};

/** Invalid state activates destructive border and ring. */
export const Invalid: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="textarea-invalid">Message</Label>
      <Textarea
        {...args}
        aria-invalid
        id="textarea-invalid"
        placeholder="Enter your message"
      />
      <p className="text-destructive text-sm">Message cannot be empty.</p>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Compositions                                                        */
/* ------------------------------------------------------------------ */

/** Always pair a `Textarea` with a `Label` via `htmlFor`/`id`. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="bio-field">Bio</Label>
      <Textarea
        {...args}
        id="bio-field"
        placeholder="Tell us a little about yourself…"
        rows={4}
      />
    </div>
  ),
};

/** Complete field layout: label + helper text. */
export const WithHelperText: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="feedback-field">Feedback</Label>
      <Textarea
        {...args}
        id="feedback-field"
        placeholder="What could we improve?"
        rows={4}
      />
      <p className="text-muted-foreground text-sm">Max 500 characters.</p>
    </div>
  ),
};

/** Pre-filled with content to demonstrate auto-sizing. */
export const WithContent: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="content-field">Notes</Label>
      <Textarea
        {...args}
        defaultValue={
          "This textarea grows automatically as you type.\n\nTry adding more lines to see it expand."
        }
        id="content-field"
      />
    </div>
  ),
};
