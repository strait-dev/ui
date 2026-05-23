import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RelativeTimeCard } from "./relative-time-card";

// HoverCard (Base UI PreviewCard) is hover-driven; jsdom can't simulate that,
// so card-content tests force the panel open with the `open` prop.

describe("RelativeTimeCard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  /* ------------------------------------------------------------------ */
  /* Trigger — formatted absolute timestamp                              */
  /* ------------------------------------------------------------------ */

  it("trigger shows the formatted absolute timestamp by default", () => {
    render(<RelativeTimeCard date={new Date("2024-06-01T12:00:00Z")} />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger).toBeInTheDocument();
    // Absolute label includes the year — the relative string lives in the card.
    expect(trigger?.textContent).toMatch(/2024/);
    expect(trigger?.textContent).not.toMatch(/ago/i);
  });

  it("accepts a string ISO date", () => {
    render(<RelativeTimeCard date={"2023-03-15T08:30:00Z"} />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger?.textContent).toMatch(/2023/);
  });

  it("accepts a numeric epoch timestamp", () => {
    const epoch = new Date("2022-11-20T00:00:00Z").getTime();
    render(<RelativeTimeCard date={epoch} />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger?.textContent).toMatch(/2022/);
  });

  it("children overrides the trigger label", () => {
    render(
      <RelativeTimeCard date={new Date("2024-06-01T12:00:00Z")}>
        Created recently
      </RelativeTimeCard>
    );
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger?.textContent).toBe("Created recently");
    expect(trigger?.textContent).not.toMatch(/2024/);
  });

  /* ------------------------------------------------------------------ */
  /* Variants                                                            */
  /* ------------------------------------------------------------------ */

  it("applies the muted variant classes to the trigger", () => {
    render(<RelativeTimeCard date={new Date()} variant="muted" />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger?.className).toContain("text-foreground/50");
  });

  it("applies the ghost variant classes to the trigger", () => {
    render(<RelativeTimeCard date={new Date()} variant="ghost" />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger?.className).toContain("hover:underline");
  });

  /* ------------------------------------------------------------------ */
  /* Card content — relative string + timezone rows                      */
  /* ------------------------------------------------------------------ */

  it("renders the relative string and timezone rows when open", async () => {
    const past = new Date(Date.now() - 5 * 60_000); // 5 minutes ago
    render(<RelativeTimeCard date={past} open />);

    // Relative string surfaces inside the card.
    expect(await screen.findByText(/ago/i)).toBeInTheDocument();
    // Default timezone ("UTC") chip is present.
    expect(screen.getByText("UTC")).toBeInTheDocument();
    // One row per configured timezone (UTC) plus the viewer's local row.
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders one row per timezone plus a local row", async () => {
    const date = new Date("2024-06-01T12:00:00Z");
    render(
      <RelativeTimeCard
        date={date}
        open
        timezones={["UTC", "America/New_York", "Asia/Tokyo"]}
      />
    );
    await screen.findByText("UTC");
    // 3 configured + 1 local
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  /* ------------------------------------------------------------------ */
  /* Auto-refresh                                                        */
  /* ------------------------------------------------------------------ */

  it("schedules setInterval with updateInterval and clears it on unmount", () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

    const { unmount } = render(
      <RelativeTimeCard date={new Date()} updateInterval={30_000} />
    );

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30_000);

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();

    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  /* ------------------------------------------------------------------ */
  /* data-slot                                                           */
  /* ------------------------------------------------------------------ */

  it("applies data-slot='relative-time-card-trigger' to the trigger", () => {
    render(<RelativeTimeCard date={new Date()} />);
    expect(
      document.querySelector("[data-slot='relative-time-card-trigger']")
    ).toBeInTheDocument();
  });
});
