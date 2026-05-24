import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("ResizablePanelGroup", () => {
  it("renders with data-slot='resizable-panel-group'", () => {
    const { container } = render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(
      container.querySelector("[data-slot='resizable-panel-group']")
    ).toBeInTheDocument();
  });

  it("renders panel content", () => {
    render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={30}>Sidebar</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>Main</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("renders panels with data-slot='resizable-panel'", () => {
    const { container } = render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>Panel A</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Panel B</ResizablePanel>
      </ResizablePanelGroup>
    );
    const panels = container.querySelectorAll("[data-slot='resizable-panel']");
    expect(panels.length).toBe(2);
  });

  it("renders handle with data-slot='resizable-handle'", () => {
    const { container } = render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>A</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>B</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(
      container.querySelector("[data-slot='resizable-handle']")
    ).toBeInTheDocument();
  });

  it("renders the visual grip when withHandle is true", () => {
    const { container } = render(
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>A</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>B</ResizablePanel>
      </ResizablePanelGroup>
    );
    // The grip is a div inside the handle
    const handle = container.querySelector("[data-slot='resizable-handle']");
    expect(handle?.querySelector("div")).toBeInTheDocument();
  });

  it("renders vertical panel group", () => {
    const { container } = render(
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={50}>Top</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Bottom</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(
      container.querySelector("[data-slot='resizable-panel-group']")
    ).toBeInTheDocument();
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Bottom")).toBeInTheDocument();
  });
});
