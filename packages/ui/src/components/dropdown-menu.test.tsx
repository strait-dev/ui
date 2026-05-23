import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";

describe("DropdownMenu", () => {
  it("renders the trigger with the correct data-slot", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const trigger = screen.getByRole("button", { name: "Open Menu" });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("data-slot", "dropdown-menu-trigger");
  });

  it("hides menu content when closed by default", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("shows menu items and label when opened via defaultOpen", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText("My Account")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("items have correct data-slot and data-variant when open", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const profileItem = screen
      .getByText("Profile")
      .closest("[data-slot='dropdown-menu-item']");
    expect(profileItem).toHaveAttribute("data-variant", "default");

    const deleteItem = screen
      .getByText("Delete")
      .closest("[data-slot='dropdown-menu-item']");
    expect(deleteItem).toHaveAttribute("data-variant", "destructive");
  });

  it("renders a DropdownMenuShortcut with the correct data-slot when open", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const shortcut = screen.getByText("⌘S");
    expect(shortcut).toHaveAttribute("data-slot", "dropdown-menu-shortcut");
  });

  it("renders checkbox and radio items when open", () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Word Wrap</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="react">
            <DropdownMenuRadioItem value="react">React</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="vue">Vue</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
    expect(screen.getByText("Word Wrap")).toBeInTheDocument();
    expect(
      screen
        .getByText("Word Wrap")
        .closest("[data-slot='dropdown-menu-checkbox-item']")
    ).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });
});
