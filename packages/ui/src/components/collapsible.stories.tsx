import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

const meta = {
  title: "Layout/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A single-panel disclosure widget.",
          "Built on Base UI's `Collapsible` primitive.",
          "",
          "Unlike `Accordion`, `Collapsible` manages one open/closed state",
          "independently. Use it for optional filter panels, expandable code",
          "blocks, or any section that can be tucked away.",
          "",
          "Key props on `Collapsible` (root):",
          "- **`defaultOpen`** — initially expanded (uncontrolled).",
          "- **`open` / `onOpenChange`** — controlled open state.",
          "- **`disabled`** — prevents the trigger from toggling.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the panel is open on first render (uncontrolled).",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Prevents the trigger from toggling the panel.",
      table: { defaultValue: { summary: "false" } },
    },
  },
  args: {
    defaultOpen: false,
    disabled: false,
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — toggle `defaultOpen` and `disabled` via controls. */
export const Playground: Story = {
  render: (args) => (
    <Collapsible {...args} className="w-80">
      <div className="flex items-center justify-between rounded-lg border px-4 py-2">
        <span className="font-medium text-sm">Project members</span>
        <CollapsibleTrigger
          render={
            <Button aria-label="Toggle members" size="icon-sm" variant="ghost">
              <HugeiconsIcon icon={PlusSignIcon} />
            </Button>
          }
        />
      </div>
      <CollapsibleContent className="mt-2 space-y-2">
        {["Alice Johnson", "Bob Smith", "Carol White"].map((name) => (
          <div
            className="rounded-md border px-4 py-2 text-sm font-mono"
            key={name}
          >
            {name}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

/** Closed by default — click the trigger to reveal the content. */
export const Closed: Story = {
  args: { defaultOpen: false },
  render: (args) => (
    <Collapsible {...args} className="w-80">
      <CollapsibleTrigger
        render={
          <Button className="w-full justify-start" variant="outline">
            Show advanced options
          </Button>
        }
      />
      <CollapsibleContent className="mt-3 space-y-2 rounded-lg border p-4">
        <p className="text-muted-foreground text-sm">
          Debug mode, verbose logging, and experimental features are available
          here. These settings may affect performance.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Enable debug
          </Button>
          <Button size="sm" variant="ghost">
            Reset
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

/** Open by default — content is visible without interaction. */
export const Open: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Collapsible {...args} className="w-80">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">Recent activity</span>
        <CollapsibleTrigger
          render={
            <Button aria-label="Collapse activity" size="sm" variant="ghost">
              Hide
            </Button>
          }
        />
      </div>
      <CollapsibleContent className="mt-3 space-y-2">
        {[
          "Pushed 3 commits to main",
          "Opened PR #42: Add dark mode",
          "Commented on issue #17",
          "Merged PR #39: Fix scroll bug",
        ].map((item) => (
          <div className="rounded-md bg-muted px-3 py-2 text-xs" key={item}>
            {item}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
};

/** Disabled — the trigger renders but cannot toggle the panel. */
export const Disabled: Story = {
  args: { disabled: true, defaultOpen: false },
  render: (args) => (
    <Collapsible {...args} className="w-80">
      <CollapsibleTrigger
        render={
          <Button className="w-full justify-start" disabled variant="outline">
            Expand (disabled)
          </Button>
        }
      />
      <CollapsibleContent className="mt-3 rounded-lg border p-4">
        <p className="text-muted-foreground text-sm">
          This content is not reachable when the collapsible is disabled.
        </p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

/**
 * Multiple independent collapsibles stacked — each manages its own state.
 * Common pattern for a settings page with several optional sections.
 */
export const Stacked: Story = {
  render: () => {
    const sections = [
      {
        id: "appearance",
        label: "Appearance",
        content: "Choose your colour scheme, font size, and interface density.",
      },
      {
        id: "notifications",
        label: "Notifications",
        content:
          "Configure email digests, browser push notifications, and Slack alerts.",
      },
      {
        id: "privacy",
        label: "Privacy",
        content:
          "Manage data sharing, analytics opt-out, and session history settings.",
      },
    ];
    return (
      <div className="w-80 space-y-2">
        {sections.map((s) => (
          <Collapsible key={s.id}>
            <div className="flex items-center justify-between rounded-lg border px-4 py-2.5">
              <span className="font-medium text-sm">{s.label}</span>
              <CollapsibleTrigger
                render={
                  <Button
                    aria-label={`Toggle ${s.label}`}
                    size="sm"
                    variant="ghost"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} />
                  </Button>
                }
              />
            </div>
            <CollapsibleContent className="rounded-b-lg border border-t-0 px-4 py-3">
              <p className="text-muted-foreground text-sm">{s.content}</p>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
  },
};
