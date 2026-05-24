import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
});

describe("ContextMenu", () => {
  it("renders the trigger region with the correct data-slot", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Right-click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    const triggerRegion = screen
      .getByText("Right-click here")
      .closest("[data-slot='context-menu-trigger']");
    expect(triggerRegion).toBeInTheDocument();
  });

  it("hides menu content when closed by default", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Right-click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    expect(screen.queryByText("Open")).not.toBeInTheDocument();
  });

  it("shows menu items and label when opened via defaultOpen", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Right-click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>Open</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("items have correct data-slot and data-variant when open", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Right-click</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Open</ContextMenuItem>
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    const openItem = screen
      .getByText("Open")
      .closest("[data-slot='context-menu-item']");
    expect(openItem).toHaveAttribute("data-variant", "default");

    const deleteItem = screen
      .getByText("Delete")
      .closest("[data-slot='context-menu-item']");
    expect(deleteItem).toHaveAttribute("data-variant", "destructive");
  });

  it("renders checkbox and radio items when open", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Right-click</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked>Word Wrap</ContextMenuCheckboxItem>
          <ContextMenuRadioGroup value="react">
            <ContextMenuRadioItem value="react">React</ContextMenuRadioItem>
            <ContextMenuRadioItem value="vue">Vue</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
    expect(
      screen
        .getByText("Word Wrap")
        .closest("[data-slot='context-menu-checkbox-item']")
    ).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // Size axis
  // -------------------------------------------------------------------------

  it("content has data-size=default when no size is given", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Right-click</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    const content = document.querySelector(
      "[data-slot='context-menu-content']"
    );
    expect(content).toHaveAttribute("data-size", "default");
  });

  it("content has data-size=sm when size='sm' is given", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Right-click</div>
        </ContextMenuTrigger>
        <ContextMenuContent size="sm">
          <ContextMenuItem>Small Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    const content = document.querySelector(
      "[data-slot='context-menu-content']"
    );
    expect(content).toHaveAttribute("data-size", "sm");
  });

  it("content has data-size=lg when size='lg' is given", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Right-click</div>
        </ContextMenuTrigger>
        <ContextMenuContent size="lg">
          <ContextMenuItem>Large Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    const content = document.querySelector(
      "[data-slot='context-menu-content']"
    );
    expect(content).toHaveAttribute("data-size", "lg");
  });

  it("items are still present with sm size", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Right-click</div>
        </ContextMenuTrigger>
        <ContextMenuContent size="sm">
          <ContextMenuItem>Small Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    expect(screen.getByText("Small Item")).toBeInTheDocument();
  });

  it("items are still present with lg size", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>
          <div>Right-click</div>
        </ContextMenuTrigger>
        <ContextMenuContent size="lg">
          <ContextMenuItem>Large Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    expect(screen.getByText("Large Item")).toBeInTheDocument();
  });
});
