import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "Forms/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A custom-styled select built on the Base UI `Select` primitive.",
          "",
          "Compose it as:",
          "```",
          "<Select>",
          "  <SelectTrigger><SelectValue placeholder='Pick…' /></SelectTrigger>",
          "  <SelectContent>",
          "    <SelectItem value='a'>Option A</SelectItem>",
          "  </SelectContent>",
          "</Select>",
          "```",
          "",
          "`SelectTrigger` accepts a `size` prop (`default` | `sm`).",
          "Items are grouped with `SelectGroup` + `SelectLabel`.",
          "Separate groups visually with `SelectSeparator`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the entire select.",
    },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="pg-select">Framework</Label>
      <Select {...args}>
        <SelectTrigger className="w-48" id="pg-select">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** `default` and `sm` trigger sizes. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Default size</Label>
        <Select>
          <SelectTrigger className="w-48" size="default">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Small size</Label>
        <Select>
          <SelectTrigger className="w-48" size="sm">
            <SelectValue placeholder="Select…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** Default state (no selection). */
export const Empty: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Choose an option…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="one">One</SelectItem>
        <SelectItem value="two">Two</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-52">
        <SelectValue placeholder="Unavailable" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="x">X</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/** With a pre-selected value (`defaultValue`). */
export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="vue">
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
        <SelectItem value="svelte">Svelte</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/* ------------------------------------------------------------------ */
/* Grouped items                                                       */
/* ------------------------------------------------------------------ */

/** Items grouped by category with labels and a separator. */
export const Grouped: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="grouped-select">Timezone</Label>
      <Select defaultValue="est">
        <SelectTrigger className="w-56" id="grouped-select">
          <SelectValue placeholder="Pick a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern (EST)</SelectItem>
            <SelectItem value="cst">Central (CST)</SelectItem>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">London (GMT)</SelectItem>
            <SelectItem value="cet">Berlin (CET)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value="jst">Tokyo (JST)</SelectItem>
            <SelectItem value="ist">Mumbai (IST)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Controlled                                                          */
/* ------------------------------------------------------------------ */

function ControlledSelect() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ctrl-select">Priority</Label>
        <Select onValueChange={(v) => setValue(v ?? "")} value={value}>
          <SelectTrigger className="w-48" id="ctrl-select">
            <SelectValue placeholder="Set priority…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <p className="text-muted-foreground text-sm">
        Selected: <code>{value || "none"}</code>
      </p>
    </div>
  );
}

/** Controlled select with live state feedback. */
export const Controlled: Story = {
  render: () => <ControlledSelect />,
};

/* ------------------------------------------------------------------ */
/* Full width                                                          */
/* ------------------------------------------------------------------ */

/** Trigger stretches to fill its container with `w-full`. */
export const FullWidth: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-1.5">
      <Label htmlFor="fw-select">Country</Label>
      <Select>
        <SelectTrigger className="w-full" id="fw-select">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="gb">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
