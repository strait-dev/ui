"use client";

import { CodeBlockCommand } from "@strait/ui/components/code-block-command";

export default function CodeBlockCommandAutoDerive() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlockCommand
        npm="npm install @strait/ui"
        storageKey="docs-auto-derive"
      />
    </div>
  );
}
