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

const items = [
  { label: "curl", command: "curl https://api.strait.dev/health" },
  { label: "docker", command: "docker run strait/ui" },
];

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

  it("honors package-manager order", () => {
    render(
      <CommandSnippet
        commands={commands}
        defaultManager="npm"
        managerOrder={["npm", "bun", "pnpm", "yarn"]}
      />
    );

    const buttons = screen
      .getAllByRole("button")
      .map((button) => button.textContent);
    expect(buttons).toContain("npm");
    expect(buttons.indexOf("npm")).toBeLessThan(buttons.indexOf("bun"));
  });

  it("supports generic selectable command items", async () => {
    const onValueChange = vi.fn();
    render(
      <CommandSnippet
        defaultValue="docker"
        items={items}
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByText("docker run strait/ui")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "curl" }));

    expect(
      screen.getByText("curl https://api.strait.dev/health")
    ).toBeInTheDocument();
    expect(onValueChange).toHaveBeenCalledWith("curl", items[0]);
  });

  it("supports controlled selection", () => {
    render(<CommandSnippet items={items} value="curl" />);

    expect(
      screen.getByText("curl https://api.strait.dev/health")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "curl" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("copies the selected package-manager command", async () => {
    render(<CommandSnippet commands={commands} defaultManager="pnpm" />);

    await userEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(copy).toHaveBeenCalledWith("pnpm add @strait/ui");
  });

  it("calls onCopy with the active command", async () => {
    const onCopy = vi.fn();
    render(<CommandSnippet command="bun test" onCopy={onCopy} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(onCopy).toHaveBeenCalledWith("bun test");
  });

  it("can hide the prompt, copy button, and header", () => {
    render(
      <CommandSnippet
        command="bun test"
        copyable={false}
        showHeader={false}
        showPrompt={false}
      />
    );

    expect(
      screen.queryByRole("button", { name: "Copy command" })
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="command-snippet-header"]')
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="command-snippet-prompt"]')
    ).not.toBeInTheDocument();
  });
});
