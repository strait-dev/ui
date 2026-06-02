"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@strait/ui/components/resizable";

const panelClass =
  "flex h-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm font-medium";

export default function ResizableVertical() {
  return (
    <div className="h-64 w-full rounded-lg border">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={60} minSize={20}>
          <div className={panelClass}>Editor</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className={panelClass}>Terminal</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
