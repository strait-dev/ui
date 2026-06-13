import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "./description-list";

const meta: Meta<typeof DescriptionList> = {
  title: "Data Display/Description List",
  component: DescriptionList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Semantic `<dl>`/`<dt>`/`<dd>` key–value display with two layout",
          "orientations and three size presets.",
          "",
          "**Orientations**",
          "- `vertical` (default) — terms and details stack; each pair is",
          "  separated by a vertical gap.",
          "- `horizontal` — two-column CSS grid; term in the left column",
          "  (≤ 12 rem), details in the right. Flat `<dt>`/`<dd>` siblings",
          "  inside the `<dl>` grid flow automatically into the correct cells.",
          "",
          "**Sizes** (`sm | default | lg`) — control text size and row gap.",
          "",
          "**Divided** — adds a subtle `border-b` divider between rows.",
          "Supported for `horizontal` orientation only; document the",
          "vertical behaviour via `className` if needed.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Layout direction.",
      table: { defaultValue: { summary: "vertical" } },
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Text size and row-gap preset.",
      table: { defaultValue: { summary: "default" } },
    },
    divided: {
      control: "boolean",
      description: "Show border between rows (horizontal orientation only).",
      table: { defaultValue: { summary: "false" } },
    },
  },
  args: {
    orientation: "vertical",
    size: "default",
    divided: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Vertical (default)                                                  */
/* ------------------------------------------------------------------ */

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <DescriptionList {...args}>
        <DescriptionTerm>Full name</DescriptionTerm>
        <DescriptionDetails>Alice Martin</DescriptionDetails>
        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>alice@example.com</DescriptionDetails>
        <DescriptionTerm>Department</DescriptionTerm>
        <DescriptionDetails>Engineering — Platform</DescriptionDetails>
        <DescriptionTerm>Location</DescriptionTerm>
        <DescriptionDetails>San Francisco, CA</DescriptionDetails>
      </DescriptionList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Full name")).toBeInTheDocument();
    await expect(canvas.getByText("Alice Martin")).toBeInTheDocument();
  },
};

/** Default stacked layout — each term/details pair sits above the next. */
export const Vertical: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <DescriptionList {...args}>
        <DescriptionTerm>Full name</DescriptionTerm>
        <DescriptionDetails>Alice Martin</DescriptionDetails>
        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>alice@example.com</DescriptionDetails>
        <DescriptionTerm>Department</DescriptionTerm>
        <DescriptionDetails>Engineering — Platform</DescriptionDetails>
        <DescriptionTerm>Location</DescriptionTerm>
        <DescriptionDetails>San Francisco, CA</DescriptionDetails>
      </DescriptionList>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Horizontal                                                          */
/* ------------------------------------------------------------------ */

/**
 * Two-column grid layout — terms in the left column, details in the right.
 * Works with flat `<dt>`/`<dd>` siblings; no wrapper needed.
 */
export const Horizontal: Story = {
  render: (args) => (
    <div className="max-w-lg">
      <DescriptionList {...args} orientation="horizontal">
        <DescriptionTerm>Full name</DescriptionTerm>
        <DescriptionDetails>Alice Martin</DescriptionDetails>
        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>alice@example.com</DescriptionDetails>
        <DescriptionTerm>Department</DescriptionTerm>
        <DescriptionDetails>Engineering — Platform</DescriptionDetails>
        <DescriptionTerm>Location</DescriptionTerm>
        <DescriptionDetails>San Francisco, CA</DescriptionDetails>
      </DescriptionList>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** `sm`, `default`, and `lg` — note the progressive text size and gap. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size}>
          <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            size="{size}"
          </p>
          <DescriptionList orientation="horizontal" size={size}>
            <DescriptionTerm>Plan</DescriptionTerm>
            <DescriptionDetails>Pro — billed annually</DescriptionDetails>
            <DescriptionTerm>Seats</DescriptionTerm>
            <DescriptionDetails>10 / 25 used</DescriptionDetails>
            <DescriptionTerm>Renewal</DescriptionTerm>
            <DescriptionDetails>June 1, 2026</DescriptionDetails>
          </DescriptionList>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Divided                                                             */
/* ------------------------------------------------------------------ */

/**
 * Horizontal list with a subtle divider between rows.
 * The last row is exempt from the bottom border automatically.
 */
export const Divided: Story = {
  render: (args) => (
    <div className="max-w-lg">
      <DescriptionList {...args} divided orientation="horizontal">
        <DescriptionTerm>Invoice</DescriptionTerm>
        <DescriptionDetails>#INV-2024-0042</DescriptionDetails>
        <DescriptionTerm>Issued</DescriptionTerm>
        <DescriptionDetails>May 1, 2025</DescriptionDetails>
        <DescriptionTerm>Due</DescriptionTerm>
        <DescriptionDetails>May 31, 2025</DescriptionDetails>
        <DescriptionTerm>Amount</DescriptionTerm>
        <DescriptionDetails>$2,400.00</DescriptionDetails>
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>Paid</DescriptionDetails>
      </DescriptionList>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Order Summary (realistic composition)                              */
/* ------------------------------------------------------------------ */

/**
 * Realistic e-commerce order summary using a horizontal divided list.
 * Demonstrates how `DescriptionList` fits naturally inside a card-like
 * container alongside other UI elements.
 */
export const OrderSummary: Story = {
  render: () => (
    <div className="max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 font-semibold text-foreground text-lg">
        Order #10042
      </h2>
      <DescriptionList divided orientation="horizontal" size="sm">
        <DescriptionTerm>Customer</DescriptionTerm>
        <DescriptionDetails>Alice Martin</DescriptionDetails>
        <DescriptionTerm>Email</DescriptionTerm>
        <DescriptionDetails>alice@example.com</DescriptionDetails>
        <DescriptionTerm>Shipping to</DescriptionTerm>
        <DescriptionDetails>
          123 Market St, San Francisco, CA 94103
        </DescriptionDetails>
        <DescriptionTerm>Items</DescriptionTerm>
        <DescriptionDetails>3 items</DescriptionDetails>
        <DescriptionTerm>Subtotal</DescriptionTerm>
        <DescriptionDetails>$118.00</DescriptionDetails>
        <DescriptionTerm>Shipping</DescriptionTerm>
        <DescriptionDetails>$10.00</DescriptionDetails>
        <DescriptionTerm>Total</DescriptionTerm>
        <DescriptionDetails className="font-semibold text-foreground">
          $128.00
        </DescriptionDetails>
      </DescriptionList>
    </div>
  ),
};
