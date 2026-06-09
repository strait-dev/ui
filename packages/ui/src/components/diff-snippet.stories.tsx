import type { Meta, StoryObj } from "@storybook/react-vite";

import { DiffSnippet, type DiffSnippetLine } from "./diff-snippet";

const dollar = String.fromCharCode(36);

const sampleLines: DiffSnippetLine[] = [
  { type: "context", content: "function greet(name: string) {" },
  { type: "remove", content: "  return 'Hi ' + name;" },
  { type: "add", content: `  return \`Hello, ${dollar}{name}!\`;` },
  { type: "context", content: "}" },
];

const configLines: DiffSnippetLine[] = [
  { type: "context", content: "export const theme = {" },
  { type: "remove", content: "  radius: 'md'," },
  { type: "add", content: "  radius: 'lg'," },
  { type: "add", content: "  surface: 'raised'," },
  { type: "context", content: "};" },
];

const meta: Meta<typeof DiffSnippet> = {
  title: "Data Display/Diff Snippet",
  component: DiffSnippet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Compact diff display for docs, release notes, and review summaries.",
          "Use it when a change is small enough to explain inline without a full",
          "syntax-highlighted `CodeBlock`.",
          "",
          "Rows are typed as `add`, `remove`, or `context`; markers and semantic",
          "success/destructive styling are generated from that type. Optional",
          "filename, language label, line numbers, and copy button are built in.",
          "",
          "Accessibility: the root is a named region, line-number gutters and diff",
          "markers are hidden where appropriate, and the copy action exposes a clear",
          "button label. Provide a specific `aria-label` when a page contains several",
          "snippets.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    lines: {
      control: "object",
      description: "Ordered diff rows to render.",
    },
    filename: {
      control: "text",
      description: "Optional filename shown in the header.",
    },
    language: {
      control: "text",
      description: "Optional language label shown in the header.",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Density preset for snippet rows and chrome.",
      table: { defaultValue: { summary: "default" } },
    },
    showLineNumbers: {
      control: "boolean",
      description: "Render a numbered gutter.",
      table: { defaultValue: { summary: "false" } },
    },
    copyable: {
      control: "boolean",
      description: "Show a clipboard button for the generated diff text.",
      table: { defaultValue: { summary: "true" } },
    },
  },
  args: {
    lines: sampleLines,
    filename: "greet.ts",
    language: "ts",
    copyable: true,
    showLineNumbers: true,
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust rows, metadata, and density. */
export const Playground: Story = {};

/** Minimal inline diff without metadata. */
export const Minimal: Story = {
  args: {
    filename: undefined,
    language: undefined,
    showLineNumbers: false,
    lines: sampleLines.slice(1, 3),
  },
};

/** Header metadata and line numbers make review snippets easier to scan. */
export const WithHeader: Story = {
  args: {
    filename: "theme.config.ts",
    language: "ts",
    lines: configLines,
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
          <DiffSnippet {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

/** State matrix for added, removed, and context rows. */
export const StateMatrix: Story = {
  render: () => (
    <DiffSnippet
      aria-label="Diff row state matrix"
      copyable={false}
      filename="states.diff"
      language="diff"
      lines={[
        { type: "context", content: "unchanged context line" },
        { type: "add", content: "added line using success tokens" },
        { type: "remove", content: "removed line using destructive tokens" },
      ]}
      showLineNumbers
    />
  ),
};
