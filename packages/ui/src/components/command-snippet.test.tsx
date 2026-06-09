import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import copy from "copy-to-clipboard";
import { describe, expect, it, vi } from "vitest";
import { CommandSnippet } from "./command-snippet";

vi.mock("copy-to-clipboard", () => ({ default: vi.fn(() => true) }));

const commands = {
  bun: "bun add @strait/ui",
  npm: "npm install @strait/ui",
  pnpm: "pnpm add @strait/ui",
  yarn: "yarn add @strait/ui",
};

describe("CommandSnippet", () => {
  it("renders the root slot and single command", () => {
    render(<CommandSnippet command="bun add @strait/ui" />);

    expect(
      screen.getByRole("region", { name: "Command snippet" })
    ).toHaveAttribute("data-slot", "command-snippet");
    expect(screen.getByText("bun add @strait/ui")).toBeInTheDocument();
  });

  it("copies the active command", async () => {
    render(<CommandSnippet command="bun add @strait/ui" />);

    await userEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(copy).toHaveBeenCalledWith("bun add @strait/ui");
  });

  it("switches package-manager commands", async () => {
    render(<CommandSnippet commands={commands} defaultManager="bun" />);

    expect(screen.getByText("bun add @strait/ui")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "npm" }));

    expect(screen.getByText("npm install @strait/ui")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "npm" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("copies the selected package-manager command", async () => {
    render(<CommandSnippet commands={commands} defaultManager="pnpm" />);

    await userEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(copy).toHaveBeenCalledWith("pnpm add @strait/ui");
  });

  it("can hide the copy button", () => {
    render(<CommandSnippet command="bun test" copyable={false} />);

    expect(
      screen.queryByRole("button", { name: "Copy command" })
    ).not.toBeInTheDocument();
  });
});
