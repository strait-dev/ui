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
  { type: "info", content: "  // surface maps to semantic tokens" },
  { type: "context", content: "};" },
];

const longLines: DiffSnippetLine[] = [
  { type: "context", content: "const config = createThemeConfig({" },
  {
    type: "add",
    content:
      "  description: 'This intentionally long line demonstrates wrapping inside constrained documentation columns and narrow side panels.',",
  },
  {
    type: "warning",
    content: "  migration: 'Check downstream imports before release',",
  },
  { type: "context", content: "});" },
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
          "Rows are typed as `add`, `remove`, `context`, `info`, `warning`, or",
          "`error`; markers and semantic success/destructive/info/warning styling",
          "are generated from that type. Optional filename, language label, line",
          "numbers, copy button, wrapping, and max-height scrolling are built in.",
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
    variant: {
      control: "select",
      options: ["default", "muted", "terminal", "minimal"],
      description: "Surface treatment for the snippet chrome.",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
      description: "Density preset for snippet rows and chrome.",
      table: { defaultValue: { summary: "default" } },
    },
    showLineNumbers: {
      control: "boolean",
      description: "Render a numbered gutter.",
      table: { defaultValue: { summary: "false" } },
    },
    lineNumberStart: {
      control: "number",
      description: "First value used by the numbered gutter.",
      table: { defaultValue: { summary: "1" } },
    },
    showMarkers: {
      control: "boolean",
      description: "Render generated diff markers.",
      table: { defaultValue: { summary: "true" } },
    },
    highlightChanges: {
      control: "boolean",
      description: "Apply semantic tinted rows for changed/annotated lines.",
      table: { defaultValue: { summary: "true" } },
    },
    wrap: {
      control: "boolean",
      description: "Wrap long lines instead of scrolling horizontally.",
      table: { defaultValue: { summary: "false" } },
    },
    maxHeight: {
      control: "text",
      description: "CSS max-height value or pixel number for the scroll body.",
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
    showMarkers: true,
    highlightChanges: true,
    lineNumberStart: 1,
    size: "default",
    variant: "default",
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
    variant: "minimal",
  },
};

/** Header metadata and line numbers make review snippets easier to scan. */
export const WithHeader: Story = {
  args: {
    filename: "theme.config.ts",
    language: "ts",
    lineNumberStart: 12,
    lines: configLines,
  },
};

/** Compare all surface variants. */
export const Variants: Story = {
  render: (args) => (
    <div className="grid w-[34rem] gap-4">
      {(["default", "muted", "terminal", "minimal"] as const).map((variant) => (
        <div className="grid gap-2" key={variant}>
          <span className="font-medium text-muted-foreground text-xs">
            variant="{variant}"
          </span>
          <DiffSnippet {...args} variant={variant} />
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
          <DiffSnippet {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

/** State matrix for every row type. */
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
        { type: "info", content: "informational annotation" },
        { type: "warning", content: "migration warning annotation" },
        { type: "error", content: "blocking error annotation" },
      ]}
      showLineNumbers
    />
  ),
};

/** Wrapping and max-height keep dense diffs usable in narrow containers. */
export const WrappedScrollable: Story = {
  args: {
    filename: "long-config.ts",
    language: "ts",
    lines: longLines,
    maxHeight: 120,
    showLineNumbers: true,
    wrap: true,
  },
  render: (args) => (
    <div className="w-80">
      <DiffSnippet {...args} />
    </div>
  ),
};

/** Empty state for generated diffs that have no changes. */
export const Empty: Story = {
  args: {
    copyable: false,
    emptyMessage: "No diff generated",
    filename: "empty.diff",
    language: "diff",
    lines: [],
  },
};
