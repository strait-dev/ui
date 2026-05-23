import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeBlock } from "./code-block";

const SAMPLE_CODE = `function hello() {\n  return "world";\n}`;

describe("CodeBlock", () => {
  it("renders with data-slot='code-block'", () => {
    render(<CodeBlock code={SAMPLE_CODE} />);
    expect(
      document.querySelector("[data-slot='code-block']")
    ).toBeInTheDocument();
  });

  it("renders the code text in a pre element", () => {
    render(<CodeBlock code={SAMPLE_CODE} />);
    const pre = document.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre?.textContent).toContain("function hello()");
  });

  it("shows the language label when language prop is provided", () => {
    render(<CodeBlock code={SAMPLE_CODE} language="tsx" />);
    expect(screen.getByText("tsx")).toBeInTheDocument();
  });

  it("does not show a top bar when language is absent and copyable is false", () => {
    render(<CodeBlock code={SAMPLE_CODE} copyable={false} />);
    expect(screen.queryByText("tsx")).not.toBeInTheDocument();
    // No border-b top bar div
    const topBar = document.querySelector(".border-b");
    expect(topBar).not.toBeInTheDocument();
  });

  it("renders copy button by default", () => {
    render(<CodeBlock code={SAMPLE_CODE} />);
    expect(
      document.querySelector("[data-slot='copy-button']")
    ).toBeInTheDocument();
  });

  it("does not render copy button when copyable={false}", () => {
    render(<CodeBlock code={SAMPLE_CODE} copyable={false} language="bash" />);
    expect(
      document.querySelector("[data-slot='copy-button']")
    ).not.toBeInTheDocument();
  });

  it("renders line numbers when showLineNumbers is true", () => {
    const code = "line one\nline two\nline three";
    render(<CodeBlock code={code} showLineNumbers />);
    // Line numbers 1, 2, 3 should appear
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not render line numbers by default", () => {
    render(<CodeBlock code={SAMPLE_CODE} />);
    // Should not have numbered gutter
    const gutter = document.querySelector(
      "[aria-hidden='true'].select-none.text-right"
    );
    expect(gutter).not.toBeInTheDocument();
  });

  it("renders top bar when language is provided even when copyable is false", () => {
    render(<CodeBlock code="x" copyable={false} language="js" />);
    expect(screen.getByText("js")).toBeInTheDocument();
    expect(document.querySelector(".border-b")).toBeInTheDocument();
  });

  it("applies custom className to root", () => {
    render(<CodeBlock className="my-custom" code="x" />);
    expect(document.querySelector("[data-slot='code-block']")).toHaveClass(
      "my-custom"
    );
  });
});
