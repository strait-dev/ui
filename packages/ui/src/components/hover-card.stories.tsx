import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta = {
  title: "Overlays/Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A preview card that appears when hovering a trigger element. Built on",
          "Base UI's PreviewCard primitive.",
          "",
          "Unlike `Popover`, the hover card opens on pointer enter and closes on",
          "pointer leave — it is not interactive and should not be used for actions.",
          "Use it for supplementary context like user profiles or link previews.",
          "",
          "Position is controlled by `side` and `align` on `HoverCardContent`.",
          "Hover delays (`delay` / `closeDelay`) are set on `HoverCardTrigger`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Whether the card is open on first render (uncontrolled).",
      table: { defaultValue: { summary: "false" } },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Hover the trigger to see the card. */
export const Playground: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger render={<Button variant="link">@janesmith</Button>} />
      <HoverCardContent>
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted">
            <HugeiconsIcon className="size-4" icon={UserIcon} />
          </div>
          <div>
            <p className="font-medium text-sm">Jane Smith</p>
            <p className="text-muted-foreground text-xs">@janesmith</p>
          </div>
        </div>
        <p className="mt-2 text-muted-foreground text-xs">
          Product designer at Strait. Crafting delightful user experiences.
        </p>
        <p className="mt-1 text-muted-foreground text-xs">
          Joined January 2024
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};

/** User mention card — the primary use-case for HoverCard. */
export const UserMention: Story = {
  render: () => (
    <p className="text-sm">
      This task was created by{" "}
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button className="h-auto p-0" variant="link">
              @jsmith
            </Button>
          }
        />
        <HoverCardContent>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon className="size-5" icon={UserIcon} />
            </div>
            <div>
              <p className="font-medium text-sm">Jane Smith</p>
              <p className="text-muted-foreground text-xs">
                jane@example.com · Admin
              </p>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground text-xs">
            Leads the product design team. Based in New York.
          </p>
          <div className="mt-2 flex gap-4">
            <div>
              <p className="font-medium text-sm">48</p>
              <p className="text-muted-foreground text-xs">Tasks completed</p>
            </div>
            <div>
              <p className="font-medium text-sm">6</p>
              <p className="text-muted-foreground text-xs">Active projects</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      and assigned to you.
    </p>
  ),
};

/** Link preview — hovering a link shows metadata about the destination. */
export const LinkPreview: Story = {
  render: () => (
    <p className="text-sm">
      Read the full spec in our{" "}
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button className="h-auto p-0" variant="link">
              design guidelines
            </Button>
          }
        />
        <HoverCardContent side="top">
          <div className="flex flex-col gap-1.5">
            <p className="font-medium text-sm">Design Guidelines</p>
            <p className="text-muted-foreground text-xs">
              docs.strait.design/guidelines
            </p>
            <p className="text-muted-foreground text-xs">
              Comprehensive design system documentation covering typography,
              colour, spacing, and component usage.
            </p>
            <p className="text-muted-foreground text-xs">
              Last updated 2 days ago
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      document.
    </p>
  ),
};

/** Side placements — try each to see where the card appears. */
export const Placements: Story = {
  render: () => (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger
            render={
              <Button size="sm" variant="outline">
                {side}
              </Button>
            }
          />
          <HoverCardContent side={side}>
            <p className="font-medium text-sm">Placed on {side}</p>
            <p className="text-muted-foreground text-xs">
              Hover card appears on the {side} side of the trigger.
            </p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
};

/** Project card — hover over a project name to preview its details. */
export const ProjectPreview: Story = {
  render: () => (
    <div className="flex flex-col gap-2 text-sm">
      {[
        {
          name: "Acme Redesign",
          status: "Active",
          tasks: 24,
          members: 5,
          desc: "Redesigning the Acme dashboard for improved user experience.",
        },
        {
          name: "API v2 Migration",
          status: "On hold",
          tasks: 11,
          members: 3,
          desc: "Migrating all endpoints to the new v2 API specification.",
        },
      ].map((project) => (
        <HoverCard key={project.name}>
          <HoverCardTrigger
            render={
              <Button className="h-auto p-0" variant="link">
                {project.name}
              </Button>
            }
          />
          <HoverCardContent>
            <p className="font-medium text-sm">{project.name}</p>
            <p className="text-muted-foreground text-xs">{project.desc}</p>
            <div className="mt-2 flex gap-4">
              <div>
                <p className="font-medium text-xs">{project.status}</p>
                <p className="text-muted-foreground text-xs">Status</p>
              </div>
              <div>
                <p className="font-medium text-xs">{project.tasks}</p>
                <p className="text-muted-foreground text-xs">Tasks</p>
              </div>
              <div>
                <p className="font-medium text-xs">{project.members}</p>
                <p className="text-muted-foreground text-xs">Members</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
};
