import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RelativeTimeCard } from "./relative-time-card";

describe("RelativeTimeCard", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  /* ------------------------------------------------------------------ */
  /* Trigger text — past / future                                        */
  /* ------------------------------------------------------------------ */

  it("trigger shows 'ago' for a past date", () => {
    const past = new Date(Date.now() - 5 * 60_000); // 5 minutes ago
    render(<RelativeTimeCard date={past} />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger).toBeInTheDocument();
    expect(trigger?.textContent).toMatch(/ago/i);
  });

  it("trigger shows 'in' prefix for a future date", () => {
    const future = new Date(Date.now() + 10 * 60_000); // 10 minutes from now
    render(<RelativeTimeCard date={future} />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger).toBeInTheDocument();
    expect(trigger?.textContent).toMatch(/^in /i);
  });

  /* ------------------------------------------------------------------ */
  /* Prop normalisation — string and number dates                        */
  /* ------------------------------------------------------------------ */

  it("accepts a string ISO date and renders a relative time", () => {
    const iso = new Date(Date.now() - 2 * 60_000).toISOString();
    render(<RelativeTimeCard date={iso} />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger?.textContent).toMatch(/ago/i);
  });

  it("accepts a numeric epoch timestamp and renders a relative time", () => {
    const epoch = Date.now() - 3 * 60_000;
    render(<RelativeTimeCard date={epoch} />);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger?.textContent).toMatch(/ago/i);
  });

  /* ------------------------------------------------------------------ */
  /* children override                                                   */
  /* ------------------------------------------------------------------ */

  it("children overrides the relative-time label on the trigger", () => {
    const past = new Date(Date.now() - 60_000);
    render(<RelativeTimeCard date={past}>Created recently</RelativeTimeCard>);
    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    expect(trigger?.textContent).toBe("Created recently");
    // Should NOT contain "ago"
    expect(trigger?.textContent).not.toMatch(/ago/i);
  });

  /* ------------------------------------------------------------------ */
  /* Auto-refresh via fake timers                                        */
  /* ------------------------------------------------------------------ */

  it("auto-refresh: setInterval is scheduled and clears on unmount", () => {
    vi.useFakeTimers();

    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

    const past = new Date(Date.now() - 2 * 60_000);
    const { unmount } = render(
      <RelativeTimeCard date={past} updateInterval={30_000} />
    );

    // setInterval should have been called once with our updateInterval
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30_000);

    unmount();

    // clearInterval should be called on cleanup
    expect(clearIntervalSpy).toHaveBeenCalled();

    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  it("auto-refresh: trigger text updates after the interval elapses", () => {
    vi.useFakeTimers();

    // Pin "now" at a known point — must be set BEFORE the date is created
    // and BEFORE render so date-fns computes from the same origin.
    const fixedNow = new Date("2024-01-15T12:00:00Z").getTime();
    vi.setSystemTime(fixedNow);

    // Date is 20 seconds ago — date-fns renders this as "less than a minute ago".
    const past = new Date(fixedNow - 20_000);
    render(<RelativeTimeCard date={past} updateInterval={5000} />);

    const trigger = document.querySelector(
      "[data-slot='relative-time-card-trigger']"
    );
    const textBefore = trigger?.textContent ?? "";
    expect(textBefore).toMatch(/less than a minute ago/i);

    // Advance system time by 15 seconds so "now" is 35 s after `past`,
    // then fire the interval inside act() so React flushes the state update.
    act(() => {
      vi.setSystemTime(fixedNow + 15_000);
      vi.advanceTimersByTime(5000);
    });

    const textAfter = trigger?.textContent ?? "";
    // Now past is 35 s ago → "1 minute ago" (threshold crossed at 30 s)
    expect(textAfter).toMatch(/1 minute ago/i);
  });

  /* ------------------------------------------------------------------ */
  /* data-slot attributes                                                */
  /* ------------------------------------------------------------------ */

  it("applies data-slot='relative-time-card-trigger' to the trigger element", () => {
    render(<RelativeTimeCard date={new Date()} />);
    expect(
      document.querySelector("[data-slot='relative-time-card-trigger']")
    ).toBeInTheDocument();
  });
});
