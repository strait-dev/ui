import { CodeBlock } from "@strait/ui/components/code-block";

const code = `import { Button } from "@strait/ui/components/button";

function App() {
  return (
    <Button variant="default" size="sm">
      Click me
    </Button>
  );
}

export default App;`;

export default function CodeBlockDemo() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock code={code} language="tsx" showLineNumbers />
    </div>
  );
}
