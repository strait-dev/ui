import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./code-block";

const TSX_SAMPLE = `import { Button } from "@strait/ui";

function App() {
  return (
    <Button variant="default" size="sm">
      Click me
    </Button>
  );
}

export default App;`;

const BASH_SAMPLE = `# Install the package
bun add @strait/ui

# Or with npm
npm install @strait/ui`;

const LONG_SAMPLE = Array.from(
  { length: 30 },
  (_, i) => `const line${i + 1} = "value ${i + 1}";`
).join("\n");

const meta: Meta<typeof CodeBlock> = {
  title: "Data Display/Code Block",
  component: CodeBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Read-only code display surface with an optional language label,",
          "line numbers, and a clipboard copy button.",
          "",
          "Renders **plain text** — no syntax-highlighting library is used.",
          "Use `showLineNumbers` for numbered gutter rendering and `maxHeight`",
          "to constrain long snippets with internal scrolling.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    code: {
      control: "text",
      description: "The source code string to display.",
    },
    language: {
      control: "text",
      description: "Language label shown in the top bar.",
    },
    showLineNumbers: {
      control: "boolean",
      description: "Render a numbered gutter.",
      table: { defaultValue: { summary: "false" } },
    },
    copyable: {
      control: "boolean",
      description: "Show the clipboard copy button.",
      table: { defaultValue: { summary: "true" } },
    },
    wrap: {
      control: "boolean",
      description: "Wrap long lines instead of scrolling horizontally.",
      table: { defaultValue: { summary: "false" } },
    },
    maxHeight: {
      control: "text",
      description: "CSS max-height value or pixel number.",
    },
  },
  args: {
    code: TSX_SAMPLE,
    language: "tsx",
    copyable: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — tweak props in the controls panel. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* Language labels                                                      */
/* ------------------------------------------------------------------ */

/** TSX snippet with language label and copy button. */
export const TSX: Story = {
  args: {
    code: TSX_SAMPLE,
    language: "tsx",
  },
};

/** Bash snippet — great for install commands. */
export const Bash: Story = {
  args: {
    code: BASH_SAMPLE,
    language: "bash",
  },
};

/* ------------------------------------------------------------------ */
/* Line numbers                                                         */
/* ------------------------------------------------------------------ */

/** Line numbers make it easy to reference specific lines. */
export const WithLineNumbers: Story = {
  args: {
    code: TSX_SAMPLE,
    language: "tsx",
    showLineNumbers: true,
  },
};

/* ------------------------------------------------------------------ */
/* No copy button                                                       */
/* ------------------------------------------------------------------ */

/** Suppress the copy button with `copyable={false}`. */
export const NoCopyButton: Story = {
  args: {
    code: TSX_SAMPLE,
    language: "tsx",
    copyable: false,
  },
};

/* ------------------------------------------------------------------ */
/* Max height                                                           */
/* ------------------------------------------------------------------ */

/** Constrain height so long snippets scroll. */
export const MaxHeight: Story = {
  args: {
    code: LONG_SAMPLE,
    language: "js",
    showLineNumbers: true,
    maxHeight: 200,
  },
};

/* ------------------------------------------------------------------ */
/* Word wrap                                                            */
/* ------------------------------------------------------------------ */

/** Long single-line strings wrapped with `wrap`. */
export const WordWrap: Story = {
  args: {
    code: `const superLongVariableName = "This is a very long string that would normally cause horizontal scrolling but with wrap enabled it stays contained within the block";`,
    language: "js",
    wrap: true,
  },
};

/* ------------------------------------------------------------------ */
/* No top bar                                                           */
/* ------------------------------------------------------------------ */

/** No language + no copy button = no top bar; clean embed. */
export const NoTopBar: Story = {
  args: {
    code: "SELECT id, name FROM users WHERE active = true;",
    copyable: false,
  },
};
