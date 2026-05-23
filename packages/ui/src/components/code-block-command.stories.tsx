import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlockCommand } from "./code-block-command";

const meta: Meta<typeof CodeBlockCommand> = {
  title: "Data Display/Code Block Command",
  component: CodeBlockCommand,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A package-manager command block that shows npm / pnpm / yarn / bun tabs.",
          "",
          "**Auto-derivation** — pass only `npm` and the other three commands are",
          "inferred automatically via `convertNpmCommand`. Pass explicit props to",
          "override any derived value.",
          "",
          "**Persistence** — the selected manager is stored in `localStorage` under",
          '`storageKey` (default `"package-manager"`) so the user\'s preference',
          "survives page reloads.",
          "",
          '**AI tab** — supply a `prompt` string to add an extra "AI" tab whose',
          "content is the instruction to paste into an AI assistant.",
        ].join("\n"),
      },
    },
  },
  args: {
    npm: "npm install @strait/ui",
    storageKey: "package-manager",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Playground — supply only the `npm` command and let the component derive
 * the pnpm, yarn, and bun equivalents automatically.
 */
export const Playground: Story = {
  args: {
    npm: "npm install @strait/ui",
  },
};

/**
 * Explicit — all four manager commands supplied directly. Useful when the
 * auto-derived commands are not accurate for your package.
 */
export const ExplicitPerManager: Story = {
  args: {
    npm: "npm install zod",
    pnpm: "pnpm add zod",
    yarn: "yarn add zod",
    bun: "bun add zod",
  },
};

/**
 * With AI prompt tab — adds a fifth "AI" tab with an instruction the user
 * can copy and paste into an AI assistant (e.g. Claude, ChatGPT).
 */
export const WithAIPromptTab: Story = {
  args: {
    npm: "npm install @strait/ui",
    prompt:
      "Install @strait/ui in my project and show me how to set up the Tailwind CSS preset and import the base styles.",
  },
};

/**
 * npx example — `npx` commands convert to `pnpm dlx`, `yarn dlx`, and `bunx`.
 */
export const NpxExample: Story = {
  args: {
    npm: "npx create-next-app@latest my-app --typescript",
    storageKey: "package-manager-npx-demo",
  },
};

/**
 * npm create — package initialiser commands.
 */
export const NpmCreate: Story = {
  args: {
    npm: "npm create vite@latest my-app -- --template react-ts",
    storageKey: "package-manager-create-demo",
  },
};

/**
 * Global install — converts to `pnpm add -g`, `yarn global add`, `bun add -g`.
 */
export const GlobalInstall: Story = {
  args: {
    npm: "npm install --global typescript",
    storageKey: "package-manager-global-demo",
  },
};

/**
 * Only two managers — when explicit props are passed for a subset of managers,
 * only those tabs are shown.
 */
export const TwoManagersOnly: Story = {
  args: {
    npm: "npm install react",
    pnpm: "pnpm add react",
    yarn: undefined,
    bun: undefined,
    storageKey: "package-manager-two-demo",
  },
};
