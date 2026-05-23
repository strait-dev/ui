import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A toggle switch built on the Base UI `Switch` primitive.",
          "",
          "Available sizes: `sm` (24 × 14 px), `default` (32 × 18 px), `lg` (44 × 24 px).",
          "`data-checked` turns the track primary-coloured; `data-disabled`",
          "dims and blocks interaction; `aria-invalid` shows a destructive ring.",
          "",
          "The `intent` prop (`default` | `destructive`) tints the checked track.",
          'Use `destructive` for high-stakes toggles (e.g. "disable service").',
          "",
          "Use `defaultChecked` for uncontrolled, or `checked` + `onCheckedChange`",
          "for controlled usage.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
      description: "Physical size of the switch track.",
      table: { defaultValue: { summary: "default" } },
    },
    intent: {
      control: "inline-radio",
      options: ["default", "destructive"],
      description: "Colour intent of the checked track.",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the switch.",
    },
    defaultChecked: {
      control: "boolean",
      description: "Initial checked state (uncontrolled).",
    },
  },
  args: {
    size: "default",
    intent: "default",
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="pg-switch" {...args} />
      <Label htmlFor="pg-switch">Airplane mode</Label>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", { name: "Airplane mode" });
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  },
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** `sm`, `default`, and `lg` sizes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="sz-sm" size="sm" {...args} />
        <Label htmlFor="sz-sm">Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sz-default" size="default" {...args} />
        <Label htmlFor="sz-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sz-lg" size="lg" {...args} />
        <Label htmlFor="sz-lg">Large</Label>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Intent variants                                                     */
/* ------------------------------------------------------------------ */

/** Default and destructive intents, both checked. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="v-default" intent="default" {...args} />
        <Label htmlFor="v-default">Default (checked)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          defaultChecked
          id="v-destructive"
          intent="destructive"
          {...args}
        />
        <Label htmlFor="v-destructive">Destructive (checked)</Label>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** All states at a glance. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="st-off" />
        <Label htmlFor="st-off">Off (unchecked)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="st-on" />
        <Label htmlFor="st-on">On (checked)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch disabled id="st-dis-off" />
        <Label htmlFor="st-dis-off">Disabled off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked disabled id="st-dis-on" />
        <Label htmlFor="st-dis-on">Disabled on</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch aria-invalid id="st-invalid" />
        <Label htmlFor="st-invalid">Invalid</Label>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Controlled                                                          */
/* ------------------------------------------------------------------ */

function ControlledSwitch() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch
          checked={on}
          id="ctrl-switch"
          onCheckedChange={(c) => setOn(!!c)}
        />
        <Label htmlFor="ctrl-switch">Dark mode</Label>
      </div>
      <p className="text-muted-foreground text-sm">
        Status: <code>{on ? "enabled" : "disabled"}</code>
      </p>
    </div>
  );
}

/** Controlled switch with live state feedback. */
export const Controlled: Story = {
  render: () => <ControlledSwitch />,
};

/* ------------------------------------------------------------------ */
/* Compositions                                                        */
/* ------------------------------------------------------------------ */

/** A settings list with multiple switches. */
export const SettingsList: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      {[
        {
          id: "notif",
          label: "Push notifications",
          desc: "Receive alerts on your devices.",
          defaultChecked: true,
        },
        {
          id: "email",
          label: "Email digest",
          desc: "Weekly summary of activity.",
          defaultChecked: false,
        },
        {
          id: "analytics",
          label: "Analytics sharing",
          desc: "Help us improve the product.",
          defaultChecked: true,
        },
      ].map((s) => (
        <div className="flex items-center justify-between gap-4" key={s.id}>
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={s.id}>{s.label}</Label>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </div>
          <Switch defaultChecked={s.defaultChecked} id={s.id} />
        </div>
      ))}
    </div>
  ),
};
