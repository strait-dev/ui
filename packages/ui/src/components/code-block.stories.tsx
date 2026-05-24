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
          "Read-only code display surface with **Shiki-powered syntax",
          "highlighting**, an optional language label, line numbers, and a",
          "clipboard copy button.",
          "",
          "Any Shiki-supported `language` is accepted (`tsx`, `ruby`, `go`,",
          "`python`, `rust`, `sql`, …) and is themed with Strait's bespoke",
          "light/dark syntax palette. Highlighting runs asynchronously — plain",
          "text shows first, then swaps to highlighted markup. Use",
          "`showLineNumbers` for a numbered gutter and `maxHeight` to constrain",
          "long snippets with internal scrolling.",
          "",
          "The `variant` prop controls the surface treatment:",
          "- `default` — muted background with border (original).",
          "- `dark` — forced dark surface (`bg-neutral-950`) for terminal-style snippets.",
          "- `transparent` — no background or border; blends into any container.",
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
    variant: {
      control: { type: "select" },
      options: ["default", "dark", "transparent"],
      description: "Surface colour treatment for the root container.",
      table: { defaultValue: { summary: "default" } },
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
    variant: "default",
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

/**
 * The same component highlights any Shiki-supported language. Here Ruby, Go,
 * Python, Rust, and SQL are rendered with Strait's syntax theme.
 */
export const Languages: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates language-agnostic highlighting. Pass any Shiki language id to `language` (`ruby`, `go`, `python`, `rust`, `sql`, …) and the snippet is tokenised and themed with Strait's palette. Unknown languages degrade gracefully to plain text.",
      },
    },
  },
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">ruby</p>
        <CodeBlock
          code={`class Greeter\n  def initialize(name)\n    @name = name\n  end\n\n  def greet\n    puts "Hello, #{@name}!"\n  end\nend`}
          language="ruby"
        />
      </div>
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">go</p>
        <CodeBlock
          code={`package main\n\nimport "fmt"\n\nfunc main() {\n\tname := "world"\n\tfmt.Printf("Hello, %s!\\n", name)\n}`}
          language="go"
        />
      </div>
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">python</p>
        <CodeBlock
          code={`def greet(name: str) -> str:\n    """Return a greeting."""\n    return f"Hello, {name}!"\n\n\nprint(greet("world"))`}
          language="python"
        />
      </div>
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">rust</p>
        <CodeBlock
          code={`fn main() {\n    let name = "world";\n    println!("Hello, {name}!");\n}`}
          language="rust"
        />
      </div>
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">sql</p>
        <CodeBlock
          code={
            "SELECT u.id, u.name, count(o.id) AS orders\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE u.active = true\nGROUP BY u.id, u.name;"
          }
          language="sql"
        />
      </div>
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">json</p>
        <CodeBlock
          code={`{\n  "name": "@strait/ui",\n  "version": "1.0.0",\n  "private": false\n}`}
          language="json"
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Variants                                                             */
/* ------------------------------------------------------------------ */

/**
 * All three surface variants stacked with labels so they can be compared
 * side by side.
 *
 * - `default` — the original muted surface with a border.
 * - `dark` — forced dark background; great for terminal-style output.
 * - `transparent` — no background or border; blends into any container.
 */
export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Stacks all three `variant` options — `default`, `dark`, and `transparent` — with labels so you can compare the surface treatments at a glance. The `transparent` entry is wrapped in a card surface to make the blend-in effect apparent.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">
          variant="default"
        </p>
        <CodeBlock code={BASH_SAMPLE} language="bash" variant="default" />
      </div>
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">
          variant="dark"
        </p>
        <CodeBlock code={BASH_SAMPLE} language="bash" variant="dark" />
      </div>
      <div>
        <p className="mb-2 font-mono text-muted-foreground text-xs">
          variant="transparent"
        </p>
        <div className="rounded-lg bg-card p-4 ring-1 ring-foreground/10">
          <CodeBlock code={BASH_SAMPLE} language="bash" variant="transparent" />
        </div>
      </div>
    </div>
  ),
};

/**
 * Dark surface — forced dark background regardless of colour scheme.
 * Ideal for terminal-style install commands and shell snippets.
 */
export const Dark: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Forces a dark surface (`bg-neutral-950 text-neutral-50`) regardless of the active colour scheme. Perfect for terminal-style install commands or shell snippets where a dark canvas is always expected.",
      },
    },
  },
  args: {
    code: "npm install @strait/ui",
    language: "bash",
    variant: "dark",
  },
};

/**
 * Transparent surface — no background or border; use inside a card or panel
 * that provides its own surface.
 */
export const Transparent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Removes the background and border entirely so the code area blends into any container. Rendered here inside a decorative card wrapper (`bg-card` + `ring-1 ring-foreground/10`) to make the blend-in effect visible.",
      },
    },
  },
  render: () => (
    <div className="rounded-lg bg-card p-4 ring-1 ring-foreground/10">
      <p className="mb-2 text-muted-foreground text-sm">
        Custom container provides the surface:
      </p>
      <CodeBlock
        code={`const greeting = "Hello, world!";\nconsole.log(greeting);`}
        language="js"
        variant="transparent"
      />
    </div>
  ),
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
