import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  type CommandListSize,
  CommandSeparator,
  CommandShortcut,
} from "./command";

// cmdk uses ResizeObserver and scrollIntoView internally; jsdom provides
// neither, so we polyfill both before any test runs.
beforeAll(() => {
  if (typeof window.ResizeObserver === "undefined") {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

function Fixture({ onSelect }: { onSelect?: (value: string) => void }) {
  return (
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Frameworks">
          <CommandItem onSelect={onSelect} value="react">
            React
          </CommandItem>
          <CommandItem onSelect={onSelect} value="vue">
            Vue
          </CommandItem>
          <CommandItem onSelect={onSelect} value="svelte">
            Svelte
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tools">
          <CommandItem onSelect={onSelect} value="vite">
            Vite
            <CommandShortcut>⌘V</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("Command", () => {
  it("renders inline with all items visible immediately", () => {
    render(<Fixture />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Svelte")).toBeInTheDocument();
    expect(screen.getByText("Vite")).toBeInTheDocument();
  });

  it("has the correct data-slot on the root element", () => {
    render(<Fixture />);
    const root = screen.getByText("React").closest("[data-slot='command']");
    expect(root).toBeInTheDocument();
  });

  it("renders the search input with the correct data-slot", () => {
    render(<Fixture />);
    const input = screen.getByPlaceholderText("Search...");
    expect(input).toHaveAttribute("data-slot", "command-input");
  });

  it("filters items as the user types in the input", async () => {
    render(<Fixture />);
    const input = screen.getByPlaceholderText("Search...");
    await userEvent.type(input, "vue");
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.queryByText("Svelte")).not.toBeInTheDocument();
  });

  it("shows the empty state when no items match the query", async () => {
    render(<Fixture />);
    const input = screen.getByPlaceholderText("Search...");
    await userEvent.type(input, "zzznomatch");
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("calls onSelect with the item value when clicked", async () => {
    const onSelect = vi.fn();
    render(<Fixture onSelect={onSelect} />);
    await userEvent.click(screen.getByText("React"));
    expect(onSelect).toHaveBeenCalledWith("react");
  });

  it("renders a CommandShortcut with the correct data-slot", () => {
    render(<Fixture />);
    const shortcut = screen.getByText("⌘V");
    expect(shortcut).toHaveAttribute("data-slot", "command-shortcut");
  });
});

// ---------------------------------------------------------------------------
// CommandList size axis
// ---------------------------------------------------------------------------

function SizeFixture({ size }: { size?: CommandListSize }) {
  return (
    <Command>
      <CommandList size={size}>
        <CommandGroup heading="Items">
          <CommandItem value="alpha">Alpha</CommandItem>
          <CommandItem value="beta">Beta</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("CommandList size", () => {
  it("renders with data-size='default' when no size prop is supplied", () => {
    const { container } = render(<SizeFixture />);
    const list = container.querySelector("[data-slot='command-list']");
    expect(list).toHaveAttribute("data-size", "default");
  });

  it("renders with data-size='sm' when size='sm'", () => {
    const { container } = render(<SizeFixture size="sm" />);
    const list = container.querySelector("[data-slot='command-list']");
    expect(list).toHaveAttribute("data-size", "sm");
  });

  it("renders with data-size='lg' when size='lg'", () => {
    const { container } = render(<SizeFixture size="lg" />);
    const list = container.querySelector("[data-slot='command-list']");
    expect(list).toHaveAttribute("data-size", "lg");
  });

  it("items are still visible when size='sm'", () => {
    render(<SizeFixture size="sm" />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("items are still visible when size='lg'", () => {
    render(<SizeFixture size="lg" />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
