import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  CommandMenu,
  type CommandMenuGroup,
  type CommandMenuItem,
} from "./command-menu";

// ---------------------------------------------------------------------------
// jsdom polyfills needed by cmdk
// ---------------------------------------------------------------------------
beforeAll(() => {
  // cmdk uses ResizeObserver internally; jsdom does not provide it.
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // cmdk calls scrollIntoView during keyboard navigation; jsdom does not implement it.
  Element.prototype.scrollIntoView ||= () => {};
});

// ---------------------------------------------------------------------------
// Shared fixture helpers
// ---------------------------------------------------------------------------

const makeGroups = (
  onSelect1 = vi.fn(),
  onSelect2 = vi.fn()
): CommandMenuGroup[] => [
  {
    heading: "Navigation",
    items: [
      { label: "Go home", shortcut: "⌘H", onSelect: onSelect1 },
      { label: "Settings", onSelect: vi.fn() },
    ],
  },
  {
    heading: "Actions",
    items: [{ label: "Delete item", onSelect: onSelect2 }],
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CommandMenu — controlled open prop", () => {
  it("renders the dialog when open=true and shows group headings + item labels", () => {
    const groups = makeGroups();
    render(<CommandMenu groups={groups} onOpenChange={vi.fn()} open={true} />);

    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Go home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Delete item")).toBeInTheDocument();
  });

  it("does not render dialog content when open=false", () => {
    const groups = makeGroups();
    render(<CommandMenu groups={groups} onOpenChange={vi.fn()} open={false} />);

    expect(screen.queryByText("Navigation")).not.toBeInTheDocument();
    expect(screen.queryByText("Go home")).not.toBeInTheDocument();
  });

  it("renders the shortcut text when provided", () => {
    render(
      <CommandMenu groups={makeGroups()} onOpenChange={vi.fn()} open={true} />
    );
    expect(screen.getByText("⌘H")).toBeInTheDocument();
  });

  it("shows the custom placeholder in the input", () => {
    render(
      <CommandMenu
        groups={makeGroups()}
        onOpenChange={vi.fn()}
        open={true}
        placeholder="Search commands…"
      />
    );
    expect(screen.getByPlaceholderText("Search commands…")).toBeInTheDocument();
  });
});

describe("CommandMenu — filtering", () => {
  it("hides non-matching items when the user types a query", async () => {
    const user = userEvent.setup();
    render(
      <CommandMenu groups={makeGroups()} onOpenChange={vi.fn()} open={true} />
    );

    const input = screen.getByRole("combobox");
    await user.type(input, "home");

    expect(screen.queryByText("Delete item")).not.toBeInTheDocument();
    expect(screen.getByText("Go home")).toBeInTheDocument();
  });

  it("shows the empty message when nothing matches", async () => {
    const user = userEvent.setup();
    render(
      <CommandMenu
        emptyMessage="Nothing here."
        groups={makeGroups()}
        onOpenChange={vi.fn()}
        open={true}
      />
    );

    const input = screen.getByRole("combobox");
    await user.type(input, "xyzzy_impossible_query");

    expect(screen.getByText("Nothing here.")).toBeInTheDocument();
  });
});

describe("CommandMenu — item selection", () => {
  it("calls onSelect and fires onOpenChange(false) when an item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect1 = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CommandMenu
        groups={makeGroups(onSelect1)}
        onOpenChange={onOpenChange}
        open={true}
      />
    );

    const item = screen.getByText("Go home");
    await user.click(item);

    expect(onSelect1).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("CommandMenu — trigger", () => {
  it("renders the trigger element when provided", () => {
    render(
      <CommandMenu
        groups={makeGroups()}
        onOpenChange={vi.fn()}
        open={false}
        trigger={<button type="button">Open palette</button>}
      />
    );
    expect(
      screen.getByRole("button", { name: "Open palette" })
    ).toBeInTheDocument();
  });

  it("calls onOpenChange(true) when the trigger is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <CommandMenu
        groups={makeGroups()}
        onOpenChange={onOpenChange}
        open={false}
        trigger={<button type="button">Open palette</button>}
      />
    );

    await user.click(screen.getByRole("button", { name: "Open palette" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("CommandMenu — uncontrolled", () => {
  it("toggles open state internally without external props", async () => {
    const user = userEvent.setup();
    render(
      <CommandMenu
        groups={makeGroups()}
        trigger={<button type="button">Open</button>}
      />
    );

    // Initially closed — group heading not visible.
    expect(screen.queryByText("Navigation")).not.toBeInTheDocument();

    // Click trigger to open.
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });
});

describe("CommandMenu — keywords", () => {
  it("finds an item via its keywords when filtering", async () => {
    const user = userEvent.setup();
    const items: CommandMenuItem[] = [
      {
        label: "Open file",
        keywords: ["document", "load"],
        onSelect: vi.fn(),
      },
    ];
    const groups: CommandMenuGroup[] = [{ heading: "File", items }];

    render(<CommandMenu groups={groups} onOpenChange={vi.fn()} open={true} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "document");

    expect(screen.getByText("Open file")).toBeInTheDocument();
  });
});
