import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NoticeBanner, NoticeBannerAction } from "./notice-banner";

describe("NoticeBanner", () => {
  it("renders with data-slot='notice-banner'", () => {
    render(<NoticeBanner>Hello</NoticeBanner>);
    expect(
      document.querySelector("[data-slot='notice-banner']")
    ).toBeInTheDocument();
  });

  it("renders with role='status'", () => {
    render(<NoticeBanner>Status</NoticeBanner>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies info variant classes by default", () => {
    render(<NoticeBanner>Info</NoticeBanner>);
    const banner = screen.getByRole("status");
    expect(banner).toHaveClass("border-info/30");
    expect(banner).toHaveClass("bg-info/5");
  });

  it("applies success variant classes", () => {
    render(<NoticeBanner variant="success">Success</NoticeBanner>);
    const banner = screen.getByRole("status");
    expect(banner).toHaveClass("border-success/30");
  });

  it("applies warning variant classes", () => {
    render(<NoticeBanner variant="warning">Warning</NoticeBanner>);
    const banner = screen.getByRole("status");
    expect(banner).toHaveClass("border-warning/30");
  });

  it("applies destructive variant classes", () => {
    render(<NoticeBanner variant="destructive">Danger</NoticeBanner>);
    const banner = screen.getByRole("status");
    expect(banner).toHaveClass("border-destructive/30");
  });

  it("renders title text when provided", () => {
    render(<NoticeBanner title="Important notice">Details here</NoticeBanner>);
    expect(screen.getByText("Important notice")).toBeInTheDocument();
  });

  it("renders children as description", () => {
    render(<NoticeBanner>Some description text</NoticeBanner>);
    expect(screen.getByText("Some description text")).toBeInTheDocument();
  });

  it("renders both title and children", () => {
    render(<NoticeBanner title="Title">Description</NoticeBanner>);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("does not render dismiss button when dismissible is false", () => {
    render(<NoticeBanner>Content</NoticeBanner>);
    expect(
      screen.queryByRole("button", { name: "Dismiss" })
    ).not.toBeInTheDocument();
  });

  it("renders dismiss button when dismissible is true", () => {
    render(<NoticeBanner dismissible>Content</NoticeBanner>);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("removes the banner when dismiss is clicked", async () => {
    render(<NoticeBanner dismissible>Removable</NoticeBanner>);
    const dismissBtn = screen.getByRole("button", { name: "Dismiss" });
    await userEvent.click(dismissBtn);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("calls onDismiss when dismiss is clicked", async () => {
    const onDismiss = vi.fn();
    render(
      <NoticeBanner dismissible onDismiss={onDismiss}>
        Content
      </NoticeBanner>
    );
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("hides the icon when icon={false}", () => {
    const { container } = render(
      <NoticeBanner icon={false}>No icon</NoticeBanner>
    );
    // With icon={false}, no SVG icon is rendered in the banner
    const banner = container.querySelector("[data-slot='notice-banner']");
    expect(banner?.querySelector("svg")).not.toBeInTheDocument();
  });

  it("renders a custom icon when provided", () => {
    render(
      <NoticeBanner icon={<span data-testid="custom-icon" />}>
        Custom
      </NoticeBanner>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders the action slot", () => {
    render(
      <NoticeBanner
        action={
          <NoticeBannerAction>
            <button type="button">Act</button>
          </NoticeBannerAction>
        }
      >
        Content
      </NoticeBanner>
    );
    expect(screen.getByRole("button", { name: "Act" })).toBeInTheDocument();
  });

  it("NoticeBannerAction renders with correct data-slot", () => {
    render(
      <NoticeBannerAction>
        <button type="button">Action</button>
      </NoticeBannerAction>
    );
    // NoticeBannerAction is now an alias for BannerActions, so the slot name
    // updated to "banner-actions".
    const action = document.querySelector("[data-slot='banner-actions']");
    expect(action).toBeInTheDocument();
  });
});
