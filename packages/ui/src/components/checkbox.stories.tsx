import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A styled checkbox built on the Base UI `Checkbox` primitive.",
          "",
          "**States** — `data-checked` fills the box with the primary colour;",
          "`disabled` dims and blocks interaction; `aria-invalid` switches to",
          "destructive styling.",
          "",
          "Use `defaultChecked` for uncontrolled usage, or `checked` +",
          "`onCheckedChange` for controlled usage.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the checkbox.",
    },
    defaultChecked: {
      control: "boolean",
      description: "Initial checked state (uncontrolled).",
    },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="pg-checkbox" {...args} />
      <Label htmlFor="pg-checkbox">Accept terms</Label>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** All states in one view. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked id="checked" />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox disabled id="disabled-unchecked" />
        <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked disabled id="disabled-checked" />
        <Label htmlFor="disabled-checked">Disabled checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox aria-invalid id="invalid" />
        <Label htmlFor="invalid">Invalid</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox aria-invalid defaultChecked id="invalid-checked" />
        <Label htmlFor="invalid-checked">Invalid checked</Label>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Controlled                                                          */
/* ------------------------------------------------------------------ */

function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={checked}
          id="controlled"
          onCheckedChange={(c) => setChecked(!!c)}
        />
        <Label htmlFor="controlled">
          {checked ? "Checked" : "Unchecked"} — click to toggle
        </Label>
      </div>
      <p className="text-muted-foreground text-sm">
        Value: <code>{String(checked)}</code>
      </p>
    </div>
  );
}

/** Controlled checkbox with local state. */
export const Controlled: Story = {
  render: () => <ControlledCheckbox />,
};

/* ------------------------------------------------------------------ */
/* Compositions                                                        */
/* ------------------------------------------------------------------ */

/** A list of checkboxes — e.g. a feature selection step. */
export const CheckboxGroup: Story = {
  render: () => {
    const features = [
      {
        id: "analytics",
        label: "Analytics",
        description: "Track visits and page views.",
      },
      {
        id: "notifications",
        label: "Notifications",
        description: "Email and push alerts.",
      },
      {
        id: "integrations",
        label: "Integrations",
        description: "Connect third-party apps.",
      },
    ];

    return (
      <div className="flex flex-col gap-4">
        {features.map((f) => (
          <div className="flex gap-2" key={f.id}>
            <Checkbox id={f.id} />
            <div className="flex flex-col gap-0.5">
              <Label htmlFor={f.id}>{f.label}</Label>
              <p className="text-muted-foreground text-sm">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
