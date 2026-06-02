import { CodeBlock } from "@strait/ui/components/code-block";

// biome-ignore lint/suspicious/noTemplateCurlyInString: this is a sample code string to display, not a template literal
const code = "const greet = (name: string) => `Hello, ${name}!`;";

export default function CodeBlockVariants() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div>
        <p className="mb-1.5 font-medium text-muted-foreground text-xs">
          default
        </p>
        <CodeBlock code={code} language="ts" variant="default" />
      </div>
      <div>
        <p className="mb-1.5 font-medium text-muted-foreground text-xs">dark</p>
        <CodeBlock code={code} language="ts" variant="dark" />
      </div>
    </div>
  );
}
