import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeatureBadge, FeatureLock } from "./feature-lock";

describe("FeatureLock", () => {
  it("renders children unchanged when unlocked", () => {
    render(
      <FeatureLock locked={false}>
        <p>Gated content</p>
      </FeatureLock>
    );
    expect(screen.getByText("Gated content")).toBeInTheDocument();
  });

  it("does not render a lock overlay when unlocked", () => {
    const { container } = render(
      <FeatureLock description="Get Pro" locked={false} title="Upgrade">
        <p>Content</p>
      </FeatureLock>
    );
    expect(
      container.querySelector("[data-slot='feature-lock']")
    ).not.toBeInTheDocument();
  });

  it("renders data-slot='feature-lock' when locked", () => {
    const { container } = render(
      <FeatureLock locked={true}>
        <p>Hidden</p>
      </FeatureLock>
    );
    const root = container.querySelector("[data-slot='feature-lock']");
    expect(root).toBeInTheDocument();
  });

  it("sets data-locked to true on the root element", () => {
    const { container } = render(
      <FeatureLock locked={true}>
        <p>Hidden</p>
      </FeatureLock>
    );
    const root = container.querySelector("[data-slot='feature-lock']");
    expect(root).toHaveAttribute("data-locked", "true");
  });

  it("marks the gated content aria-hidden when locked", () => {
    const { container } = render(
      <FeatureLock locked={true}>
        <p>Secret</p>
      </FeatureLock>
    );
    const hidden = container.querySelector("[aria-hidden='true']");
    expect(hidden).toBeInTheDocument();
  });

  it("applies pointer-events-none and select-none to gated content", () => {
    const { container } = render(
      <FeatureLock locked={true}>
        <p>Secret</p>
      </FeatureLock>
    );
    const hidden = container.querySelector("[aria-hidden='true']");
    expect(hidden).toHaveClass("pointer-events-none");
    expect(hidden).toHaveClass("select-none");
  });

  it("applies blur-sm to gated content when blur is true (default)", () => {
    const { container } = render(
      <FeatureLock locked={true}>
        <p>Secret</p>
      </FeatureLock>
    );
    const hidden = container.querySelector("[aria-hidden='true']");
    expect(hidden).toHaveClass("blur-sm");
  });

  it("does not apply blur-sm when blur is false", () => {
    const { container } = render(
      <FeatureLock blur={false} locked={true}>
        <p>Secret</p>
      </FeatureLock>
    );
    const hidden = container.querySelector("[aria-hidden='true']");
    expect(hidden).not.toHaveClass("blur-sm");
  });

  it("renders the overlay title when locked", () => {
    render(
      <FeatureLock locked={true} title="Upgrade to Pro">
        <p>Hidden</p>
      </FeatureLock>
    );
    expect(screen.getByText("Upgrade to Pro")).toBeInTheDocument();
  });

  it("renders the overlay description when locked", () => {
    render(
      <FeatureLock
        description="Get access to advanced features."
        locked={true}
        title="Upgrade"
      >
        <p>Hidden</p>
      </FeatureLock>
    );
    expect(
      screen.getByText("Get access to advanced features.")
    ).toBeInTheDocument();
  });

  it("renders the action slot when locked", () => {
    render(
      <FeatureLock
        action={<button type="button">Upgrade now</button>}
        locked={true}
        title="Upgrade"
      >
        <p>Hidden</p>
      </FeatureLock>
    );
    expect(
      screen.getByRole("button", { name: "Upgrade now" })
    ).toBeInTheDocument();
  });

  it("renders a FeatureBadge when planLabel is provided and locked", () => {
    const { container } = render(
      <FeatureLock locked={true} planLabel="Pro" title="Upgrade to Pro">
        <p>Hidden</p>
      </FeatureLock>
    );
    const badge = container.querySelector("[data-slot='feature-badge']");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Pro");
  });

  it("does not render a FeatureBadge when planLabel is omitted", () => {
    const { container } = render(
      <FeatureLock locked={true} title="Upgrade to Pro">
        <p>Hidden</p>
      </FeatureLock>
    );
    const badge = container.querySelector("[data-slot='feature-badge']");
    expect(badge).not.toBeInTheDocument();
  });
});

describe("FeatureBadge", () => {
  it("renders the plan text", () => {
    render(<FeatureBadge plan="Pro" />);
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("has data-slot='feature-badge'", () => {
    const { container } = render(<FeatureBadge plan="Enterprise" />);
    const badge = container.querySelector("[data-slot='feature-badge']");
    expect(badge).toBeInTheDocument();
  });

  it("renders an svg lock icon", () => {
    const { container } = render(<FeatureBadge plan="Pro" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("accepts and merges a custom className", () => {
    const { container } = render(
      <FeatureBadge className="custom-cls" plan="Pro" />
    );
    const badge = container.querySelector("[data-slot='feature-badge']");
    expect(badge).toHaveClass("custom-cls");
  });
});
