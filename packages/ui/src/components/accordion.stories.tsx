import {
  CheckmarkCircle02Icon,
  Mail01Icon,
  Notification01Icon,
  Settings02Icon,
  SmartPhone01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "./frame";

const meta = {
  title: "Layout/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A vertically stacked list of disclosure panels.",
          "Built on Base UI's `Accordion` primitive.",
          "",
          "Key props on `Accordion` (root):",
          "- **`multiple`** — allow more than one panel open at a time (default `false`).",
          "- **`defaultValue`** — array of open item values on first render.",
          "- **`value` / `onValueChange`** — controlled open state.",
          "- **`disabled`** — disables all triggers.",
          "- **`variant`** — `default` (flush) | `outline` (bordered cards) |",
          "  `solid` (filled cards); overridable per `AccordionItem`.",
          "",
          "Each `AccordionItem` needs a `value` string. Triggers include",
          "animated chevrons via `ArrowDown01Icon` / `ArrowUp01Icon`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Allow multiple items to be expanded simultaneously.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Disable all accordion triggers.",
      table: { defaultValue: { summary: "false" } },
    },
    variant: {
      control: "select",
      options: ["default", "outline", "solid"],
      description: "Visual style applied to every item.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    multiple: false,
    disabled: false,
    variant: "default",
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const faqItems = [
  {
    value: "item-1",
    trigger: "What is Strait UI?",
    content:
      "Strait UI is a design system built on Base UI primitives and styled with Tailwind CSS. It provides accessible, composable components for building consistent product interfaces.",
  },
  {
    value: "item-2",
    trigger: "How do I install the package?",
    content:
      'Run `bun add @strait/ui` in your project root, then import components directly: `import { Button } from "@strait/ui"`. All components are tree-shakeable.',
  },
  {
    value: "item-3",
    trigger: "Can I customise the colour palette?",
    content:
      "Yes. Strait UI uses CSS custom properties for all design tokens. Override them in your global stylesheet or Tailwind config to match your brand colours.",
  },
  {
    value: "item-4",
    trigger: "Is server-side rendering supported?",
    content:
      'All interactive components are marked `"use client"`. Static components render on the server without any additional configuration.',
  },
];

/** Interactive playground — toggle `multiple` and `disabled` in the controls. */
export const Playground: Story = {
  args: { defaultValue: ["item-1"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** Single-open mode (default): only one panel can be expanded at a time. */
export const Single: Story = {
  args: { multiple: false, defaultValue: ["item-1"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** Multiple-open mode: any number of panels can be expanded simultaneously. */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["item-1", "item-3"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** All panels closed initially. */
export const AllClosed: Story = {
  args: { defaultValue: [] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** Disabled — all triggers are non-interactive. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["item-2"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * Outline variant — each item is a bordered, rounded card with internal
 * padding. Set `variant="outline"` on the root.
 */
export const Outline: Story = {
  args: { variant: "outline", defaultValue: ["item-1"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * Solid variant — each item is a filled muted card. Set `variant="solid"`
 * on the root.
 */
export const Solid: Story = {
  args: { variant: "solid", defaultValue: ["item-1"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * Rich content inside panels — paragraphs, links, and nested lists
 * to verify the typography styles applied by `AccordionContent`.
 */
export const RichContent: Story = {
  args: { multiple: true, defaultValue: ["changelog", "links"] },
  render: (args) => (
    <Accordion {...args} className="w-[28rem]">
      <AccordionItem value="changelog">
        <AccordionTrigger>Release notes — v2.0</AccordionTrigger>
        <AccordionContent>
          <p>
            Version 2.0 introduces a redesigned token system and full Base UI
            alignment.
          </p>
          <p>
            Migration from v1 requires updating import paths. See the{" "}
            <a href="https://example.com/migration">migration guide</a> for
            details.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="links">
        <AccordionTrigger>Useful links</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-4 text-sm">
            <li>
              <a href="https://example.com/docs">Documentation</a>
            </li>
            <li>
              <a href="https://github.com/example/strait">GitHub repository</a>
            </li>
            <li>
              <a href="https://example.com/tokens">Design tokens reference</a>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Support &amp; community</AccordionTrigger>
        <AccordionContent>
          Join the Discord community or open an issue on GitHub for help with
          integration, bug reports, or feature requests.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * `indicator="plus-minus"` swaps the chevron for a plus glyph that turns into
 * a minus when the item expands. Useful in FAQ blocks where a more emphatic
 * open/close affordance is desired.
 */
export const PlusMinusIndicator: Story = {
  args: { variant: "outline", defaultValue: ["item-1"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger indicator="plus-minus">
            {item.trigger}
          </AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * `indicator="none"` suppresses the built-in glyph entirely — bring your own
 * marker as a trailing child with `data-slot="accordion-trigger-icon"` to pick
 * up automatic sizing and colour tokens.
 */
export const CustomIndicator: Story = {
  args: { variant: "outline", defaultValue: ["item-1"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.slice(0, 3).map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger indicator="none">
            {item.trigger}
            <HugeiconsIcon
              data-slot="accordion-trigger-icon"
              icon={Settings02Icon}
              strokeWidth={2}
            />
          </AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * Drop an `Accordion` inside a `Card` to group a single, framed FAQ block.
 * The accordion's flush `default` variant reads as one continuous list under
 * the card's bordered surface.
 */
export const InCard: Story = {
  args: { defaultValue: ["item-1"] },
  render: (args) => (
    <Card className="w-[28rem]">
      <CardHeader>
        <CardTitle>Frequently asked</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion {...args}>
          {faqItems.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  ),
};

/**
 * One `Accordion` per `FramePanel` in a `stacked` Frame — each section is a
 * self-contained disclosure group sharing a single bordered shell.
 */
export const InFrame: Story = {
  args: { defaultValue: ["billing-1"], multiple: false },
  render: () => (
    <Frame className="w-[28rem]" stacked>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Billing</FrameTitle>
          <FrameDescription>Plan, invoices, and payment.</FrameDescription>
        </FrameHeader>
        <Accordion defaultValue={["billing-1"]}>
          <AccordionItem value="billing-1">
            <AccordionTrigger>How do I update my card?</AccordionTrigger>
            <AccordionContent>
              Go to Settings → Billing, then click the card on file to swap it.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="billing-2">
            <AccordionTrigger>When are invoices issued?</AccordionTrigger>
            <AccordionContent>
              On the first of every month, sent to your billing email.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Security</FrameTitle>
          <FrameDescription>Two-factor, sessions, devices.</FrameDescription>
        </FrameHeader>
        <Accordion>
          <AccordionItem value="security-1">
            <AccordionTrigger>Reset a forgotten password</AccordionTrigger>
            <AccordionContent>
              Use the “Forgot password?” link on the sign-in screen — a reset
              email is sent within a minute.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="security-2">
            <AccordionTrigger>Revoke an active session</AccordionTrigger>
            <AccordionContent>
              Settings → Security → Active sessions. Hit “Sign out” on any
              session you don't recognise.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </FramePanel>
    </Frame>
  ),
};

/**
 * Accordions nest cleanly — wrap a child `Accordion` inside an
 * `AccordionContent` to build hierarchical disclosures (e.g. category →
 * subcategory in a settings tree).
 */
export const NestedAccordion: Story = {
  args: { variant: "outline", defaultValue: ["account"] },
  render: (args) => (
    <Accordion {...args} className="w-[26rem]">
      <AccordionItem value="account">
        <AccordionTrigger>Account</AccordionTrigger>
        <AccordionContent>
          <Accordion defaultValue={["profile"]}>
            <AccordionItem value="profile">
              <AccordionTrigger>Profile information</AccordionTrigger>
              <AccordionContent>
                Your name, avatar, and bio. Changes propagate to teammates
                within a minute.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="email">
              <AccordionTrigger>Email preferences</AccordionTrigger>
              <AccordionContent>
                Decide what we email you about — product updates, security
                alerts, and weekly digests.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="workspace">
        <AccordionTrigger>Workspace</AccordionTrigger>
        <AccordionContent>
          <Accordion>
            <AccordionItem value="members">
              <AccordionTrigger>Members &amp; roles</AccordionTrigger>
              <AccordionContent>
                Invite teammates and assign them to roles with scoped access.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing">
              <AccordionTrigger>Plan &amp; billing</AccordionTrigger>
              <AccordionContent>
                Manage seats, upgrade your plan, or download past invoices.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * People directory pattern — each item's trigger renders an avatar, name, and
 * role, and the panel reveals contact details. Demonstrates rich trigger
 * content beyond plain text.
 */
export const UserList: Story = {
  args: { variant: "outline", defaultValue: ["alex"] },
  render: (args) => {
    const people = [
      {
        value: "alex",
        name: "Alex Johnson",
        role: "Design Lead",
        initials: "AJ",
        email: "alex@example.com",
        phone: "+1 (555) 010-2244",
      },
      {
        value: "maria",
        name: "Maria Cabrera",
        role: "Senior Engineer",
        initials: "MC",
        email: "maria@example.com",
        phone: "+1 (555) 010-3389",
      },
      {
        value: "noah",
        name: "Noah Park",
        role: "Product Manager",
        initials: "NP",
        email: "noah@example.com",
        phone: "+1 (555) 010-7710",
      },
    ];
    return (
      <Accordion {...args} className="w-[28rem]">
        {people.map((person) => (
          <AccordionItem key={person.value} value={person.value}>
            <AccordionTrigger>
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarImage alt={person.name} src="" />
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="font-medium text-foreground text-sm">
                    {person.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {person.role}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 text-sm">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <HugeiconsIcon
                    className="size-4"
                    icon={Mail01Icon}
                    strokeWidth={2}
                  />
                  Email
                </dt>
                <dd>{person.email}</dd>
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <HugeiconsIcon
                    className="size-4"
                    icon={SmartPhone01Icon}
                    strokeWidth={2}
                  />
                  Phone
                </dt>
                <dd>{person.phone}</dd>
              </dl>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};

/**
 * Onboarding checklist — each step pairs a status `Badge` with a description
 * panel. Completed steps use `success-light`, active steps use `info-light`,
 * and pending steps stay muted.
 */
export const OnboardingSteps: Story = {
  args: {
    variant: "solid",
    defaultValue: ["invite"],
    multiple: false,
  },
  render: (args) => {
    const steps = [
      {
        value: "account",
        title: "Create your account",
        status: "done" as const,
        copy: "Welcome aboard — your workspace is ready.",
      },
      {
        value: "invite",
        title: "Invite your team",
        status: "active" as const,
        copy: "Add at least one teammate so you can collaborate on projects.",
      },
      {
        value: "project",
        title: "Set up your first project",
        status: "pending" as const,
        copy: "Pick a template or start from scratch — projects organise your work.",
      },
      {
        value: "integrations",
        title: "Connect an integration",
        status: "pending" as const,
        copy: "Wire up Slack, GitHub, or Linear to streamline notifications.",
      },
    ];
    const badgeFor = (status: "done" | "active" | "pending") => {
      if (status === "done") {
        return (
          <Badge iconLeft={CheckmarkCircle02Icon} variant="success-light">
            Done
          </Badge>
        );
      }
      if (status === "active") {
        return (
          <Badge dot variant="info-light">
            In progress
          </Badge>
        );
      }
      return <Badge variant="secondary">Pending</Badge>;
    };
    return (
      <Accordion {...args} className="w-[28rem]">
        {steps.map((step) => (
          <AccordionItem key={step.value} value={step.value}>
            <AccordionTrigger>
              <span className="flex flex-1 items-center justify-between gap-3 pr-3">
                <span className="font-medium text-sm">{step.title}</span>
                {badgeFor(step.status)}
              </span>
            </AccordionTrigger>
            <AccordionContent>{step.copy}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};

/**
 * Settings sections — wrap each panel's content with helper icons in the
 * trigger to communicate the surface that the section configures.
 */
export const SettingsSections: Story = {
  args: { variant: "outline", defaultValue: ["profile"] },
  render: (args) => {
    const sections = [
      {
        value: "profile",
        icon: UserCircleIcon,
        title: "Profile",
        copy: "Update your display name, avatar, and time zone.",
      },
      {
        value: "notifications",
        icon: Notification01Icon,
        title: "Notifications",
        copy: "Choose what you receive via email, push, and in-product.",
      },
      {
        value: "preferences",
        icon: Settings02Icon,
        title: "Preferences",
        copy: "Theme, density, and keyboard shortcut customisation.",
      },
    ];
    return (
      <Accordion {...args} className="w-[28rem]">
        {sections.map((section) => (
          <AccordionItem key={section.value} value={section.value}>
            <AccordionTrigger>
              <span className="flex items-center gap-3">
                <HugeiconsIcon
                  className="size-4 text-muted-foreground"
                  icon={section.icon}
                  strokeWidth={2}
                />
                <span className="font-medium text-sm">{section.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>{section.copy}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};
