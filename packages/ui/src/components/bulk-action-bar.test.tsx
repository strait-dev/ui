import { Delete01Icon } from "@hugeicons/core-free-icons";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { BulkActionBar } from "./bulk-action-bar";

describe("BulkActionBar", () => {
  it("renders the selected count text", () => {
    render(
      <BulkActionBar
        actions={[]}
        onClearSelection={() => {}}
        selectedCount={5}
      />
    );
    expect(screen.getByText("5 selected")).toBeInTheDocument();
  });

  it("has the data-slot='bulk-action-bar' attribute on the root element", () => {
    const { container } = render(
      <BulkActionBar
        actions={[]}
        onClearSelection={() => {}}
        selectedCount={1}
      />
    );
    const root = container.querySelector("[data-slot='bulk-action-bar']");
    expect(root).toBeInTheDocument();
  });

  it("renders a labelled action button and fires onClick when clicked", async () => {
    const onClick = vi.fn();
    render(
      <BulkActionBar
        actions={[{ label: "Archive", onClick }]}
        onClearSelection={() => {}}
        selectedCount={2}
      />
    );
    const button = screen.getByRole("button", { name: "Archive" });
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("fires onClearSelection when the clear button is clicked", async () => {
    const onClearSelection = vi.fn();
    render(
      <BulkActionBar
        actions={[]}
        onClearSelection={onClearSelection}
        selectedCount={3}
      />
    );
    const clearButton = screen.getByRole("button", { name: "Clear selection" });
    await userEvent.click(clearButton);
    expect(onClearSelection).toHaveBeenCalledOnce();
  });

  it("renders an icon action button with the correct aria-label", () => {
    render(
      <BulkActionBar
        actions={[{ label: "Delete", icon: Delete01Icon, onClick: () => {} }]}
        onClearSelection={() => {}}
        selectedCount={1}
      />
    );
    const iconButton = screen.getByRole("button", { name: "Delete" });
    expect(iconButton).toBeInTheDocument();
  });

  it("renders multiple actions in the toolbar", () => {
    const archiveClick = vi.fn();
    const exportClick = vi.fn();
    render(
      <BulkActionBar
        actions={[
          { label: "Archive", onClick: archiveClick },
          { label: "Export", onClick: exportClick },
        ]}
        onClearSelection={() => {}}
        selectedCount={4}
      />
    );
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("renders children in the extra slot", () => {
    render(
      <BulkActionBar actions={[]} onClearSelection={() => {}} selectedCount={2}>
        <span data-testid="custom-slot">Select all</span>
      </BulkActionBar>
    );
    expect(screen.getByTestId("custom-slot")).toBeInTheDocument();
  });

  it("applies fixed positioning classes when position='fixed'", () => {
    const { container } = render(
      <BulkActionBar
        actions={[]}
        onClearSelection={() => {}}
        position="fixed"
        selectedCount={1}
      />
    );
    const root = container.querySelector("[data-slot='bulk-action-bar']");
    expect(root).toHaveClass("fixed");
  });

  it("does not apply fixed positioning classes when position='static'", () => {
    const { container } = render(
      <BulkActionBar
        actions={[]}
        onClearSelection={() => {}}
        position="static"
        selectedCount={1}
      />
    );
    const root = container.querySelector("[data-slot='bulk-action-bar']");
    expect(root).not.toHaveClass("fixed");
  });
});
