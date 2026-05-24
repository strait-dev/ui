import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select";

const meta = {
  title: "Forms/Native Select",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A native `<select>` element styled to match the design system.",
          "",
          "Uses the OS-native dropdown, making it ideal for mobile-first flows.",
          "The chevron icon is injected via absolute positioning.",
          "",
          "Accepts `size` (`sm` | `default` | `lg`), all native `<select>` attributes,",
          "`NativeSelectOption` for `<option>` children, and `NativeSelectOptGroup`",
          "for grouped options.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
      description: "Height preset. Does NOT map to the HTML size attribute.",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the select.",
    },
  },
  args: {
    size: "default",
    disabled: false,
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="pg-native">Country</Label>
      <NativeSelect {...args} id="pg-native">
        <NativeSelectOption value="">Select a country…</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
        <NativeSelectOption value="ca">Canada</NativeSelectOption>
        <NativeSelectOption value="au">Australia</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** `sm`, `default`, and `lg` sizes. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Small</Label>
        <NativeSelect size="sm">
          <NativeSelectOption value="a">Option A</NativeSelectOption>
          <NativeSelectOption value="b">Option B</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <NativeSelect size="default">
          <NativeSelectOption value="a">Option A</NativeSelectOption>
          <NativeSelectOption value="b">Option B</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Large</Label>
        <NativeSelect size="lg">
          <NativeSelectOption value="a">Option A</NativeSelectOption>
          <NativeSelectOption value="b">Option B</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** All states. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <NativeSelect>
          <NativeSelectOption value="a">Option A</NativeSelectOption>
          <NativeSelectOption value="b">Option B</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Disabled</Label>
        <NativeSelect disabled>
          <NativeSelectOption value="a">Option A</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Invalid</Label>
        <NativeSelect aria-invalid>
          <NativeSelectOption value="">Select an option</NativeSelectOption>
          <NativeSelectOption value="a">Option A</NativeSelectOption>
        </NativeSelect>
        <p className="text-destructive text-sm">Please select an option.</p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Grouped options                                                     */
/* ------------------------------------------------------------------ */

/** Options grouped by continent with `NativeSelectOptGroup`. */
export const WithGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="native-grouped">Timezone</Label>
      <NativeSelect id="native-grouped">
        <NativeSelectOption value="">Pick a timezone…</NativeSelectOption>
        <NativeSelectOptGroup label="Americas">
          <NativeSelectOption value="est">Eastern (EST)</NativeSelectOption>
          <NativeSelectOption value="pst">Pacific (PST)</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Europe">
          <NativeSelectOption value="gmt">London (GMT)</NativeSelectOption>
          <NativeSelectOption value="cet">Berlin (CET)</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Asia">
          <NativeSelectOption value="jst">Tokyo (JST)</NativeSelectOption>
          <NativeSelectOption value="ist">Mumbai (IST)</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Full width                                                          */
/* ------------------------------------------------------------------ */

/** Wrap the component in a `w-full` container to stretch it. */
export const FullWidth: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="fw-native">Role</Label>
      <NativeSelect className="w-full" id="fw-native">
        <NativeSelectOption value="">Select your role…</NativeSelectOption>
        <NativeSelectOption value="admin">Admin</NativeSelectOption>
        <NativeSelectOption value="editor">Editor</NativeSelectOption>
        <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};
