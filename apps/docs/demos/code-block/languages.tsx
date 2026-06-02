import { CodeBlock } from "@strait/ui/components/code-block";

const tsCode = `import { Button } from "@strait/ui/components/button";

export function App() {
  return (
    <Button variant="brand-solid" size="sm">
      Get started
    </Button>
  );
}`;

const bashCode = `# Install @strait/ui
bun add @strait/ui

# Start Storybook
bun run storybook`;

export default function CodeBlockLanguages() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <CodeBlock code={tsCode} language="tsx" />
      <CodeBlock code={bashCode} language="bash" />
    </div>
  );
}
