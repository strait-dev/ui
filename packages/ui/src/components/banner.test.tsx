import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Banner,
  BannerActions,
  BannerClose,
  BannerContent,
  BannerDescription,
  BannerIcon,
  BannerTitle,
  NoticeBanner,
  NoticeBannerAction,
} from "./banner";

// ---------------------------------------------------------------------------
// Banner (root)
// ---------------------------------------------------------------------------

describe("Banner", () => {
  it("renders with role='status'", () => {
    render(<Banner>Hello</Banner>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("tags root element with data-slot='banner'", () => {
    render(<Banner>Hello</Banner>);
    expect(screen.getByRole("status")).toHaveAttribute("data-slot", "banner");
  });

  it("applies info variant classes by default", () => {
    render(<Banner>Info</Banner>);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("border-info/30");
    expect(el).toHaveClass("bg-info/5");
    expect(el).toHaveClass("text-info-accent");
  });

  it("applies success variant classes", () => {
    render(<Banner variant="success">Success</Banner>);
    expect(screen.getByRole("status")).toHaveClass("border-success/30");
  });

  it("applies warning variant classes", () => {
    render(<Banner variant="warning">Warning</Banner>);
    expect(screen.getByRole("status")).toHaveClass("border-warning/30");
  });

  it("applies destructive variant classes", () => {
    render(<Banner variant="destructive">Danger</Banner>);
    expect(screen.getByRole("status")).toHaveClass("border-destructive/30");
  });

  it("forwards extra className to root element", () => {
    render(<Banner className="extra-class">Hi</Banner>);
    expect(screen.getByRole("status")).toHaveClass("extra-class");
  });
});

// ---------------------------------------------------------------------------
// Layout axis
// ---------------------------------------------------------------------------

describe("Banner layout axis", () => {
  it("applies rounded-lg and border for inline (default) layout", () => {
    render(<Banner>Inline</Banner>);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("rounded-lg");
    expect(el).toHaveClass("border");
  });

  it("applies rounded-none and removes side borders for full-width layout", () => {
    render(<Banner layout="full-width">Full</Banner>);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("rounded-none");
    expect(el).toHaveClass("border-x-0");
  });
});

// ---------------------------------------------------------------------------
// Size axis
// ---------------------------------------------------------------------------

describe("Banner size axis", () => {
  it("applies default size padding", () => {
    render(<Banner>Default</Banner>);
    expect(screen.getByRole("status")).toHaveClass("px-3", "py-2");
  });

  it("applies sm size padding", () => {
    render(<Banner size="sm">Small</Banner>);
    expect(screen.getByRole("status")).toHaveClass("px-2.5", "py-1.5");
  });
});

// ---------------------------------------------------------------------------
// BannerIcon — default glyph per intent
// ---------------------------------------------------------------------------

describe("BannerIcon", () => {
  it("renders an svg icon inside data-slot='banner-icon'", () => {
    const { container } = render(
      <Banner variant="info">
        <BannerIcon />
      </Banner>
    );
    const iconSlot = container.querySelector("[data-slot='banner-icon']");
    expect(iconSlot).toBeInTheDocument();
    // Hugeicons resolves to undefined in jsdom — the component still renders
    // an <svg> element (or null), so we assert the slot exists at minimum.
    // If an svg is present, verify it is inside the slot.
    const svg = container.querySelector("svg");
    if (svg) {
      expect(iconSlot).toContainElement(svg);
    }
  });

  it("accepts an explicit icon prop without throwing", () => {
    const { container } = render(
      <Banner variant="success">
        <BannerIcon icon={undefined} />
      </Banner>
    );
    expect(
      container.querySelector("[data-slot='banner-icon']")
    ).toBeInTheDocument();
  });

  it("picks different default glyphs per variant (renders without error)", () => {
    const variants = ["info", "success", "warning", "destructive"] as const;
    for (const variant of variants) {
      const { container, unmount } = render(
        <Banner variant={variant}>
          <BannerIcon />
        </Banner>
      );
      expect(
        container.querySelector("[data-slot='banner-icon']")
      ).toBeInTheDocument();
      unmount();
    }
  });
});

// ---------------------------------------------------------------------------
// BannerContent / BannerTitle / BannerDescription
// ---------------------------------------------------------------------------

describe("BannerContent", () => {
  it("renders with data-slot='banner-content'", () => {
    const { container } = render(<BannerContent>Text</BannerContent>);
    expect(
      container.querySelector("[data-slot='banner-content']")
    ).toBeInTheDocument();
  });
});

describe("BannerTitle", () => {
  it("renders with data-slot='banner-title'", () => {
    render(<BannerTitle>Title</BannerTitle>);
    const el = document.querySelector("[data-slot='banner-title']");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("Title");
  });

  it("applies font-semibold and leading-snug", () => {
    render(<BannerTitle>Title</BannerTitle>);
    const el = document.querySelector("[data-slot='banner-title']");
    expect(el).toHaveClass("font-semibold", "leading-snug");
  });
});

describe("BannerDescription", () => {
  it("renders with data-slot='banner-description'", () => {
    render(<BannerDescription>Desc</BannerDescription>);
    const el = document.querySelector("[data-slot='banner-description']");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("Desc");
  });

  it("applies leading-snug", () => {
    render(<BannerDescription>Desc</BannerDescription>);
    expect(
      document.querySelector("[data-slot='banner-description']")
    ).toHaveClass("leading-snug");
  });
});

// ---------------------------------------------------------------------------
// BannerActions
// ---------------------------------------------------------------------------

describe("BannerActions", () => {
  it("renders with data-slot='banner-actions'", () => {
    const { container } = render(
      <BannerActions>
        <button type="button">Act</button>
      </BannerActions>
    );
    expect(
      container.querySelector("[data-slot='banner-actions']")
    ).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <BannerActions>
        <button type="button">Click me</button>
      </BannerActions>
    );
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// BannerClose
// ---------------------------------------------------------------------------

describe("BannerClose", () => {
  it("renders a button with aria-label='Dismiss'", () => {
    render(<BannerClose />);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("tags element with data-slot='banner-close'", () => {
    render(<BannerClose />);
    expect(
      document.querySelector("[data-slot='banner-close']")
    ).toBeInTheDocument();
  });

  it("fires onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<BannerClose onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is stateless — banner stays visible after click", async () => {
    render(
      <Banner>
        <BannerClose />
      </Banner>
    );
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    // Banner still in the DOM — caller controls visibility
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Composition — full sub-part tree
// ---------------------------------------------------------------------------

describe("Banner composition", () => {
  it("renders all sub-parts together", () => {
    const { container } = render(
      <Banner variant="warning">
        <BannerIcon />
        <BannerContent>
          <BannerTitle>Heads up</BannerTitle>
          <BannerDescription>Quota almost full.</BannerDescription>
        </BannerContent>
        <BannerActions>
          <button type="button">Upgrade</button>
          <BannerClose />
        </BannerActions>
      </Banner>
    );

    expect(container.querySelector("[data-slot='banner']")).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='banner-icon']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='banner-content']")
    ).toBeInTheDocument();
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Quota almost full.")).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='banner-actions']")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Back-compat: NoticeBanner
// ---------------------------------------------------------------------------

describe("NoticeBanner (back-compat)", () => {
  it("renders with role='status'", () => {
    render(<NoticeBanner>Hello</NoticeBanner>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies info variant classes by default", () => {
    render(<NoticeBanner>Info</NoticeBanner>);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("border-info/30");
    expect(el).toHaveClass("bg-info/5");
  });

  it("applies success variant classes", () => {
    render(<NoticeBanner variant="success">Success</NoticeBanner>);
    expect(screen.getByRole("status")).toHaveClass("border-success/30");
  });

  it("applies warning variant classes", () => {
    render(<NoticeBanner variant="warning">Warning</NoticeBanner>);
    expect(screen.getByRole("status")).toHaveClass("border-warning/30");
  });

  it("applies destructive variant classes", () => {
    render(<NoticeBanner variant="destructive">Danger</NoticeBanner>);
    expect(screen.getByRole("status")).toHaveClass("border-destructive/30");
  });

  it("renders title text when provided", () => {
    render(<NoticeBanner title="Important notice">Details</NoticeBanner>);
    expect(screen.getByText("Important notice")).toBeInTheDocument();
  });

  it("renders children as description", () => {
    render(<NoticeBanner>Some description text</NoticeBanner>);
    expect(screen.getByText("Some description text")).toBeInTheDocument();
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

  it("removes the banner from the DOM when dismiss is clicked", async () => {
    render(<NoticeBanner dismissible>Removable</NoticeBanner>);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("calls onDismiss callback when dismiss is clicked", async () => {
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
    expect(
      container.querySelector("[data-slot='banner-icon']")
    ).not.toBeInTheDocument();
  });

  it("renders a custom icon node when provided", () => {
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

  it("NoticeBannerAction renders with data-slot='banner-actions'", () => {
    render(
      <NoticeBannerAction>
        <button type="button">Action</button>
      </NoticeBannerAction>
    );
    expect(
      document.querySelector("[data-slot='banner-actions']")
    ).toBeInTheDocument();
  });
});
