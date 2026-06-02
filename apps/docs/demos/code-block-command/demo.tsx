import { CodeBlockCommand } from "@strait/ui/components/code-block-command";

export default function CodeBlockCommandDemo() {
  return (
    <div className="w-full max-w-lg">
      <CodeBlockCommand npm="npm install @strait/ui" />
    </div>
  );
}
