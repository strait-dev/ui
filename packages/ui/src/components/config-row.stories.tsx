import {
  GlobeIcon,
  Key01Icon,
  Settings01Icon,
  ShieldKeyIcon,
  Timer01Icon,
} from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { ConfigRow } from "./config-row";
import { CopyButton } from "./copy-button";

const meta: Meta<typeof ConfigRow> = {
  title: "Data Display/Config Row",
  component: ConfigRow,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A presentational label/value row for settings panels, detail drawers, and",
          "info grids. Renders a left side (optional icon + label + optional description)",
          "and a right side (value in `font-mono text-xs` + optional action).",
          "",
          "Compose multiple `ConfigRow` items inside a `Card` with `divide-y` to build",
          "clean bordered setting lists without extra markup.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Muted label on the left." },
    value: { control: "text", description: "Value shown on the right." },
    description: {
      control: "text",
      description: "Optional second muted line below the label.",
    },
  },
  args: {
    label: "Region",
    value: "us-east-1",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust label, value, and description. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/** Row with a leading icon to reinforce the label's meaning. */
export const WithIcon: Story = {
  args: {
    icon: GlobeIcon,
    label: "Region",
    value: "us-east-1",
  },
};

/** Row with a trailing {@link CopyButton} action. */
export const WithAction: Story = {
  args: {
    icon: Key01Icon,
    label: "API Key",
    value: "sk-live-••••••••4f9a",
    action: (
      <CopyButton aria-label="Copy API key" text="sk-live-real-key-here" />
    ),
  },
};

/** Row with a secondary description line beneath the label. */
export const WithDescription: Story = {
  args: {
    icon: Timer01Icon,
    label: "Retention",
    description: "How long raw events are stored before deletion.",
    value: "90 days",
  },
};

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

/**
 * Several `ConfigRow` items stacked inside a `Card` with `divide-y` —
 * the most common real-world pattern for settings and detail panels.
 */
export const Composition: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="divide-y">
          <ConfigRow
            className="px-4 py-2.5"
            icon={GlobeIcon}
            label="Region"
            value="us-east-1"
          />
          <ConfigRow
            className="px-4 py-2.5"
            description="How long raw events are stored."
            icon={Timer01Icon}
            label="Retention"
            value="90 days"
          />
          <ConfigRow
            action={
              <CopyButton
                aria-label="Copy API key"
                text="sk-live-real-key-here"
              />
            }
            className="px-4 py-2.5"
            icon={Key01Icon}
            label="API Key"
            value="sk-live-••••••••4f9a"
          />
          <ConfigRow
            className="px-4 py-2.5"
            icon={ShieldKeyIcon}
            label="Auth Provider"
            value="GitHub OAuth"
          />
          <ConfigRow
            className="px-4 py-2.5"
            icon={Settings01Icon}
            label="Plan"
            value="Pro"
          />
        </div>
      </CardContent>
    </Card>
  ),
};
