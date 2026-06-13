import {
  DiffSnippet,
  type DiffSnippetLine,
} from "@strait/ui/components/diff-snippet";

const dollar = String.fromCharCode(36);

const lines: DiffSnippetLine[] = [
  { type: "context", content: "function greet(name: string) {" },
  { type: "remove", content: "  return 'Hi ' + name;" },
  { type: "add", content: `  return \`Hello, ${dollar}{name}!\`;` },
  { type: "context", content: "}" },
];

export default function DiffSnippetDemo() {
  return (
    <div className="w-full max-w-xl">
      <DiffSnippet
        filename="greet.ts"
        language="ts"
        lines={lines}
        showLineNumbers
      />
    </div>
  );
}
