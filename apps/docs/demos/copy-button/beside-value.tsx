"use client";

import { CopyButton } from "@strait/ui/components/copy-button";

export default function CopyButtonBesideValue() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 font-mono text-sm">
        <span>run_8f3a91c2e7</span>
        <CopyButton aria-label="Copy run ID" text="run_8f3a91c2e7" />
      </div>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 font-mono text-sm">
        <span>sk-live-abc123xyz</span>
        <CopyButton
          aria-label="Copy API key"
          size="sm"
          text="sk-live-abc123xyz"
          variant="outline"
        >
          Copy key
        </CopyButton>
      </div>
    </div>
  );
}
