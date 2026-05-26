import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "./frame";

const meta: Meta<typeof Frame> = {
  title: "Layout/Frame",
  component: Frame,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`Frame` is a bordered surface that groups one or more `FramePanel` children. Use `stacked` to join panels with shared borders for a single continuous group, or leave it off for a spaced list of panels inside a shared outer border. Override `--frame-radius` on the root to retheme corners.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Frame>;

/** Default frame with a single panel containing a title, description, and footer. */
export const Playground: Story = {
  render: () => (
    <Frame className="max-w-md">
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Frame Title</FrameTitle>
          <FrameDescription>
            A bordered surface that hosts one or more panels.
          </FrameDescription>
        </FrameHeader>
        <div className="text-sm">Frame content goes here.</div>
        <FrameFooter>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </FrameFooter>
      </FramePanel>
    </Frame>
  ),
};

/** Multiple panels separated by `spacing` (the default). */
export const SeparatedPanels: Story = {
  render: () => (
    <Frame className="max-w-md">
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Account</FrameTitle>
          <FrameDescription>Update your profile information.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Security</FrameTitle>
          <FrameDescription>
            Two-factor authentication and active sessions.
          </FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Notifications</FrameTitle>
          <FrameDescription>Decide what we email you about.</FrameDescription>
        </FrameHeader>
      </FramePanel>
    </Frame>
  ),
};

/** Panels joined edge-to-edge via `stacked`. */
export const StackedPanels: Story = {
  render: () => (
    <Frame className="max-w-md" stacked>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Storage</FrameTitle>
          <FrameDescription>Using 12 GB of 100 GB.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Bandwidth</FrameTitle>
          <FrameDescription>3 TB / month plan.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>API calls</FrameTitle>
          <FrameDescription>240 K of 1 M this month.</FrameDescription>
        </FrameHeader>
      </FramePanel>
    </Frame>
  ),
};

/** `dense` removes inner panel padding so the child owns its own spacing. */
export const DensePanels: Story = {
  render: () => (
    <Frame className="max-w-md" dense stacked>
      <FramePanel>
        <div className="flex items-center justify-between px-5 py-3">
          <FrameTitle>Members</FrameTitle>
          <Button size="sm" variant="outline">
            Invite
          </Button>
        </div>
      </FramePanel>
      <FramePanel>
        <div className="px-5 py-3 text-muted-foreground text-sm">
          12 active · 3 pending invites
        </div>
      </FramePanel>
    </Frame>
  ),
};

/** `variant="ghost"` strips the outer border; panels keep their own. */
export const WithoutOuterBorder: Story = {
  render: () => (
    <Frame className="max-w-md" variant="ghost">
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Inbox</FrameTitle>
          <FrameDescription>Three new messages.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Archive</FrameTitle>
          <FrameDescription>1,204 conversations.</FrameDescription>
        </FrameHeader>
      </FramePanel>
    </Frame>
  ),
};

/** Custom `spacing="sm"` tightens the gap between separated panels. */
export const CustomSpacing: Story = {
  render: () => (
    <Frame className="max-w-md" spacing="sm" variant="ghost">
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Today</FrameTitle>
          <FrameDescription>4 events.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Tomorrow</FrameTitle>
          <FrameDescription>2 events.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>This week</FrameTitle>
          <FrameDescription>11 events.</FrameDescription>
        </FrameHeader>
      </FramePanel>
    </Frame>
  ),
};

/** Retheme corners by overriding the `--frame-radius` CSS variable on the root. */
export const CustomRadius: Story = {
  render: () => (
    <Frame className="max-w-md [--frame-radius:var(--radius-md)]" stacked>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Smaller radius</FrameTitle>
          <FrameDescription>
            All inner panels inherit the override via `--frame-radius`.
          </FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Second panel</FrameTitle>
          <FrameDescription>Shares the radius token.</FrameDescription>
        </FrameHeader>
      </FramePanel>
    </Frame>
  ),
};
