import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "./menubar";

describe("Menubar", () => {
  it("renders the menubar root with the correct data-slot", () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const menubar = screen.getByText("File").closest("[data-slot='menubar']");
    expect(menubar).toBeInTheDocument();
  });

  it("renders trigger labels and hides content initially", () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New File</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.queryByText("New File")).not.toBeInTheDocument();
    expect(screen.queryByText("Undo")).not.toBeInTheDocument();
  });

  it("shows menu items, label, and separator when menu has defaultOpen", () => {
    render(
      <Menubar>
        <MenubarMenu defaultOpen>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarLabel>File Options</MenubarLabel>
              <MenubarItem>New File</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarItem variant="destructive">Delete</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.getByText("File Options")).toBeInTheDocument();
    expect(screen.getByText("New File")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("menu items have the correct data-slot and data-variant when open", () => {
    render(
      <Menubar>
        <MenubarMenu defaultOpen>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem variant="destructive">Remove</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    const undoItem = screen
      .getByText("Undo")
      .closest("[data-slot='menubar-item']");
    expect(undoItem).toHaveAttribute("data-variant", "default");

    const removeItem = screen
      .getByText("Remove")
      .closest("[data-slot='menubar-item']");
    expect(removeItem).toHaveAttribute("data-variant", "destructive");
  });

  it("shows checkbox and radio items when the Edit menu has defaultOpen", () => {
    render(
      <Menubar>
        <MenubarMenu defaultOpen>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>Word Wrap</MenubarCheckboxItem>
            <MenubarRadioGroup value="dark">
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(
      screen
        .getByText("Word Wrap")
        .closest("[data-slot='menubar-checkbox-item']")
    ).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("Light")).toBeInTheDocument();
  });
});
