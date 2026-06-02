"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@strait/ui/components/resizable";

const panelClass =
  "flex h-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm font-medium";

export default function ResizableNested() {
  return (
    <div className="h-72 w-full rounded-lg border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={22} minSize={12}>
          <div className={panelClass}>Explorer</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={78} minSize={40}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={65} minSize={25}>
              <div className={panelClass}>Editor</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={15}>
              <div className={panelClass}>Terminal</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
