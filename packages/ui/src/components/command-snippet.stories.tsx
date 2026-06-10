import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommandSnippet } from "./command-snippet";

const installCommands = {
  bun: "bun add @strait/ui",
  npm: "npm install @strait/ui",
  pnpm: "pnpm add @strait/ui",
  yarn: "yarn add @strait/ui",
};

const cliItems = [
  { label: "curl", command: "curl https://api.strait.dev/health" },
  { label: "docker", command: "docker run --rm strait/ui:latest" },
  { label: "brew", command: "brew install strait-dev/tap/strait" },
];

const meta: Meta<typeof CommandSnippet> = {
  title: "Data Display/Command Snippet",
  component: CommandSnippet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Command snippet for install commands, setup steps, and CLI examples.",
          "Use it when the code is a command to run rather than source code to",
          "read.",
          "",
          "Pass a single `command` for static snippets, a generic `items` array",
          "for arbitrary selectable commands, or a `commands` map for the",
          "Bun/npm/pnpm/yarn shorthand. The active command is the one copied by the",
          "clipboard button.",
          "",
          "Keyboard behavior: command choices are buttons with `aria-pressed`; Tab",
          "moves through choices and copy, Enter/Space switches the active command.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    command: {
      control: "text",
      description: "Single command to display.",
    },
    items: {
      control: "object",
      description: "Generic selectable commands.",
    },
    commands: {
      control: "object",
      description: "Package-manager-specific command shorthand.",
    },
    managerOrder: {
      control: "object",
      description: "Order used for package-manager shorthand.",
    },
    defaultManager: {
      control: "select",
      options: ["bun", "npm", "pnpm", "yarn"],
      description: "Initially selected package manager for `commands`.",
      table: { defaultValue: { summary: "bun" } },
    },
    defaultValue: {
      control: "text",
      description: "Initial selected value for generic `items`.",
    },
    value: {
      control: "text",
      description: "Controlled selected item value.",
    },
    variant: {
      control: "select",
      options: ["terminal", "card", "muted", "minimal"],
      description: "Surface treatment for the snippet chrome.",
      table: { defaultValue: { summary: "terminal" } },
    },
    title: {
      control: "text",
      description: "Optional header title.",
    },
    prompt: {
      control: "text",
      description: "Prompt prefix shown before the command.",
      table: { defaultValue: { summary: "$" } },
    },
    showPrompt: {
      control: "boolean",
      description: "Show the prompt prefix.",
      table: { defaultValue: { summary: "true" } },
    },
    showHeader: {
      control: "boolean",
      description: "Force the header on/off instead of deriving it.",
    },
    wrap: {
      control: "boolean",
      description: "Wrap long commands instead of scrolling horizontally.",
      table: { defaultValue: { summary: "false" } },
    },
    maxHeight: {
      control: "text",
      description: "CSS max-height value or pixel number for the scroll body.",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
      description: "Density preset for the snippet chrome and command line.",
      table: { defaultValue: { summary: "default" } },
    },
    copyable: {
      control: "boolean",
      description: "Show the clipboard copy button.",
      table: { defaultValue: { summary: "true" } },
    },
  },
  args: {
    commands: installCommands,
    defaultManager: "bun",
    title: "Install",
    copyable: true,
    showPrompt: true,
    size: "default",
    variant: "terminal",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — switch package managers and copy the active command. */
export const Playground: Story = {};

/** Single command, no selector controls. */
export const SingleCommand: Story = {
  args: {
    command: "bun run verify",
    commands: undefined,
    title: "Verify",
  },
};

/** Package-manager variants for install docs. */
export const PackageManagers: Story = {
  args: {
    commands: installCommands,
    defaultManager: "bun",
    title: "Install @strait/ui",
  },
};

/** Generic command items support Docker, curl, Homebrew, or project CLIs. */
export const GenericItems: Story = {
  args: {
    commands: undefined,
    defaultValue: "docker",
    items: cliItems,
    title: "Run with",
  },
};

/** Multiline commands remain copyable as one payload. */
export const Multiline: Story = {
  args: {
    command: "bun add @strait/ui\nbun add react react-dom",
    commands: undefined,
    prompt: ">",
    title: "Setup",
  },
};

/** Compare all surface variants. */
export const Variants: Story = {
  render: (args) => (
    <div className="grid w-[34rem] gap-4">
      {(["terminal", "card", "muted", "minimal"] as const).map((variant) => (
        <div className="grid gap-2" key={variant}>
          <span className="font-medium text-muted-foreground text-xs">
            variant="{variant}"
          </span>
          <CommandSnippet {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

/** Compare the density presets. */
export const Sizes: Story = {
  render: (args) => (
    <div className="grid w-[34rem] gap-4">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <div className="grid gap-2" key={size}>
          <span className="font-medium text-muted-foreground text-xs">
            size="{size}"
          </span>
          <CommandSnippet {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

/** Wrapping keeps long commands readable in narrow docs columns. */
export const Wrapped: Story = {
  args: {
    command:
      "curl --request POST https://api.strait.dev/v1/events --header 'Authorization: Bearer $STRAIT_TOKEN' --data '{\"type\":\"deploy\"}'",
    commands: undefined,
    showPrompt: false,
    title: "HTTP request",
    variant: "card",
    wrap: true,
  },
  render: (args) => (
    <div className="w-80">
      <CommandSnippet {...args} />
    </div>
  ),
};
