"use client";

import { CodeBlockCommand } from "@strait/ui/components/code-block-command";

export default function CodeBlockCommandWithAiTab() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlockCommand
        npm="npm install @strait/ui"
        prompt="Install @strait/ui and set up the Tailwind CSS v4 preset with the base stylesheet import."
        storageKey="docs-ai-tab"
      />
    </div>
  );
}
