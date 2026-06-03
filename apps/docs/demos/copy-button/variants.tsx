"use client";

import { CopyButton } from "@strait/ui/components/copy-button";

export default function CopyButtonVariants() {
  return (
    <div className="flex items-center gap-2">
      <CopyButton text="npm install @strait/ui" variant="ghost" />
      <CopyButton text="npm install @strait/ui" variant="outline" />
      <CopyButton text="npm install @strait/ui" variant="secondary" />
      <CopyButton text="npm install @strait/ui" variant="default" />
    </div>
  );
}
