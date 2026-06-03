"use client";

import { CodeBlockCommand } from "@strait/ui/components/code-block-command";

export default function CodeBlockCommandNpx() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlockCommand
        npm="npx create-next-app@latest my-app --typescript"
        storageKey="docs-npx"
      />
    </div>
  );
}
