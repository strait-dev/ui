"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@strait/ui/components/resizable";

const panelClass =
  "flex h-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm font-medium";

export default function ResizableDemo() {
  return (
    <div className="h-48 w-full rounded-lg border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={30} minSize={15}>
          <div className={panelClass}>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className={panelClass}>Main Content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
