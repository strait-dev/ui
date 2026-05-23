import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { SelectNative } from "./select-native";

const meta = {
  title: "Forms/Select Native",
  component: SelectNative,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An alternative native `<select>` wrapper with a distinct visual treatment",
          "and shadow. Uses `ArrowDown01Icon` instead of the unfold-more chevron.",
          "",
          "Accepts all native `<select>` attributes; set `multiple` to render a",
          "multi-select listbox instead. The arrow icon is hidden in multi-select",
          "mode. Pass `<option>` and `<optgroup>` children directly.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the select.",
    },
    multiple: {
      control: "boolean",
      description: "Renders a multi-select listbox.",
    },
  },
  args: {
    disabled: false,
    multiple: false,
  },
} satisfies Meta<typeof SelectNative>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-56 flex-col gap-1.5">
      <Label htmlFor="pg-select-native">Favorite fruit</Label>
      <SelectNative {...args} id="pg-select-native">
        <option disabled value="">
          Pick a fruit…
        </option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
        <option value="mango">Mango</option>
      </SelectNative>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** All states in one view. */
export const States: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <SelectNative>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </SelectNative>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Disabled</Label>
        <SelectNative disabled>
          <option value="a">Option A</option>
        </SelectNative>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Invalid</Label>
        <SelectNative aria-invalid>
          <option disabled value="">
            Select one…
          </option>
          <option value="a">Option A</option>
        </SelectNative>
        <p className="text-destructive text-sm">Please make a selection.</p>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Multi-select                                                        */
/* ------------------------------------------------------------------ */

/** `multiple={true}` renders a listbox; arrow icon is hidden. */
export const Multiple: Story = {
  render: (args) => (
    <div className="flex w-56 flex-col gap-1.5">
      <Label htmlFor="multi-native">Skills (hold Ctrl/⌘ for multiple)</Label>
      <SelectNative {...args} id="multi-native" multiple>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="react">React</option>
      </SelectNative>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* With optgroups                                                      */
/* ------------------------------------------------------------------ */

/** Native optgroups for categorised options. */
export const WithOptGroups: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="sn-groups">Vehicle type</Label>
      <SelectNative id="sn-groups">
        <option disabled value="">
          Select…
        </option>
        <optgroup label="Land">
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="truck">Truck</option>
        </optgroup>
        <optgroup label="Sea">
          <option value="boat">Boat</option>
          <option value="yacht">Yacht</option>
        </optgroup>
        <optgroup label="Air">
          <option value="plane">Airplane</option>
          <option value="helicopter">Helicopter</option>
        </optgroup>
      </SelectNative>
    </div>
  ),
};
