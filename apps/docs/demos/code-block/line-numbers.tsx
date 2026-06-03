import { CodeBlock } from "@strait/ui/components/code-block";

const code = `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result); // 55`;

export default function CodeBlockLineNumbers() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock code={code} language="ts" showLineNumbers />
    </div>
  );
}
