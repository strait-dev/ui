import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import copy from "copy-to-clipboard";
import { describe, expect, it, vi } from "vitest";
import { DiffSnippet, type DiffSnippetLine } from "./diff-snippet";

vi.mock("copy-to-clipboard", () => ({ default: vi.fn(() => true) }));

const dollar = String.fromCharCode(36);
const addedLine = `  return \`Hello, ${dollar}{name}!\`;`;

const lines: DiffSnippetLine[] = [
  { type: "context", content: "function greet(name) {" },
  { type: "remove", content: "  return 'Hi ' + name;" },
  { type: "add", content: addedLine },
  { type: "context", content: "}" },
];

describe("DiffSnippet", () => {
  it("renders the root slot and accessible region", () => {
    render(<DiffSnippet aria-label="Greeting diff" lines={lines} />);

    expect(
      screen.getByRole("region", { name: "Greeting diff" })
    ).toHaveAttribute("data-slot", "diff-snippet");
  });

  it("renders filename, language, markers, and line types", () => {
    render(
      <DiffSnippet
        filename="greet.ts"
        language="ts"
        lines={lines}
        showLineNumbers
      />
    );

    expect(screen.getByText("greet.ts")).toBeInTheDocument();
    expect(screen.getByText("ts")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(
      screen.getByText("return 'Hi ' + name;").closest("span")
    ).toHaveAttribute("data-slot", "diff-snippet-content");
    expect(document.querySelector('[data-type="remove"]')).toBeInTheDocument();
    expect(document.querySelector('[data-type="add"]')).toBeInTheDocument();
  });

  it("copies the diff with generated markers", async () => {
    render(<DiffSnippet lines={lines} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy diff" }));

    expect(copy).toHaveBeenCalledWith(
      `  function greet(name) {\n-   return 'Hi ' + name;\n+ ${addedLine}\n  }`
    );
  });

  it("can hide the copy button and header", () => {
    render(<DiffSnippet copyable={false} lines={lines} />);

    expect(
      screen.queryByRole("button", { name: "Copy diff" })
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="diff-snippet-header"]')
    ).not.toBeInTheDocument();
  });
});
