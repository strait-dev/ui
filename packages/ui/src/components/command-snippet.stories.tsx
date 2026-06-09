import type { Meta, StoryObj } from "@storybook/react-vite";

import { CommandSnippet } from "./command-snippet";

const installCommands = {
  bun: "bun add @strait/ui",
  npm: "npm install @strait/ui",
  pnpm: "pnpm add @strait/ui",
  yarn: "yarn add @strait/ui",
};

const meta: Meta<typeof CommandSnippet> = {
  title: "Data Display/Command Snippet",
  component: CommandSnippet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Terminal-style command snippet for install commands, setup steps,",
          "and CLI examples. Use it when the code is a command to run rather",
          "than source code to read.",
          "",
          "Pass a single `command` for static snippets, or a `commands` map for",
          "package-manager tabs. The active command is the one copied by the",
          "clipboard button. The surface uses semantic terminal tokens, so it stays",
          'themeable alongside `CodeBlock variant="dark"`.',
          "",
          "Keyboard behavior: package managers are buttons with `aria-pressed`; Tab",
          "moves through managers and copy, Enter/Space switches the active command.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    command: {
      control: "text",
      description: "Single command to display.",
    },
    commands: {
      control: "object",
      description: "Package-manager-specific commands.",
    },
    defaultManager: {
      control: "select",
      options: ["bun", "npm", "pnpm", "yarn"],
      description: "Initially selected package manager.",
      table: { defaultValue: { summary: "bun" } },
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
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
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
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — switch package managers and copy the active command. */
export const Playground: Story = {};

/** Single command, no package-manager controls. */
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

/** Multiline commands remain copyable as one payload. */
export const Multiline: Story = {
  args: {
    command: "bun add @strait/ui\nbun add react react-dom",
    commands: undefined,
    prompt: ">",
    title: "Setup",
  },
};

/** Compare the compact/default/large density presets. */
export const Sizes: Story = {
  render: (args) => (
    <div className="grid w-[34rem] gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
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
