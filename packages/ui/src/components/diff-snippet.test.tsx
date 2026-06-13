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
        lineNumberStart={41}
        lines={lines}
        showLineNumbers
      />
    );

    expect(screen.getByText("greet.ts")).toBeInTheDocument();
    expect(screen.getByText("ts")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(
      screen.getByText("return 'Hi ' + name;").closest("span")
    ).toHaveAttribute("data-slot", "diff-snippet-content");
    expect(document.querySelector('[data-type="remove"]')).toBeInTheDocument();
    expect(document.querySelector('[data-type="add"]')).toBeInTheDocument();
  });

  it("renders annotation line types", () => {
    render(
      <DiffSnippet
        lines={[
          { type: "info", content: "note: new import" },
          { type: "warning", content: "warning: review migration" },
          { type: "error", content: "error: removed API" },
        ]}
      />
    );

    expect(document.querySelector('[data-type="info"]')).toBeInTheDocument();
    expect(document.querySelector('[data-type="warning"]')).toBeInTheDocument();
    expect(document.querySelector('[data-type="error"]')).toBeInTheDocument();
  });

  it("copies the diff with generated markers", async () => {
    render(<DiffSnippet lines={lines} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy diff" }));

    expect(copy).toHaveBeenCalledWith(
      `  function greet(name) {\n-   return 'Hi ' + name;\n+ ${addedLine}\n  }`
    );
  });

  it("copies plain lines when markers are hidden", async () => {
    render(<DiffSnippet lines={lines} showMarkers={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Copy diff" }));

    expect(copy).toHaveBeenCalledWith(
      `function greet(name) {\n  return 'Hi ' + name;\n${addedLine}\n}`
    );
    expect(
      document.querySelector('[data-slot="diff-snippet-marker"]')
    ).not.toBeInTheDocument();
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

  it("renders an empty message", () => {
    render(<DiffSnippet emptyMessage="Nothing changed" lines={[]} />);

    expect(screen.getByText("Nothing changed")).toHaveAttribute(
      "data-slot",
      "diff-snippet-empty"
    );
  });
});
