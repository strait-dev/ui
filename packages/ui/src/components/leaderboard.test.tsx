import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Leaderboard,
  LeaderboardContent,
  LeaderboardEnd,
  LeaderboardHeader,
  LeaderboardItem,
  LeaderboardStart,
  LeaderboardTitle,
} from "./leaderboard";

const Example = ({ onAction }: { onAction?: () => void }) => (
  <Leaderboard>
    <LeaderboardHeader>
      <LeaderboardTitle>Top pages</LeaderboardTitle>
    </LeaderboardHeader>
    <LeaderboardContent>
      <LeaderboardItem maxValue={4200} onAction={onAction} value={4200}>
        <LeaderboardStart>/home</LeaderboardStart>
        <LeaderboardEnd>4,200</LeaderboardEnd>
      </LeaderboardItem>
      <LeaderboardItem maxValue={4200} value={2100}>
        <LeaderboardStart>/pricing</LeaderboardStart>
        <LeaderboardEnd>2,100</LeaderboardEnd>
      </LeaderboardItem>
    </LeaderboardContent>
  </Leaderboard>
);

describe("Leaderboard", () => {
  it("renders the root and content slots", () => {
    const { container } = render(<Example />);
    expect(
      container.querySelector("[data-slot='leaderboard']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='leaderboard-content']")
    ).toBeInTheDocument();
  });

  it("renders one item per entry", () => {
    const { container } = render(<Example />);
    expect(
      container.querySelectorAll("[data-slot='leaderboard-item']")
    ).toHaveLength(2);
  });

  it("renders the title and value text", () => {
    const { getByText } = render(<Example />);
    expect(getByText("Top pages")).toBeInTheDocument();
    expect(getByText("/home")).toBeInTheDocument();
    expect(getByText("4,200")).toBeInTheDocument();
  });

  it("sizes the fill bar proportionally to the value", () => {
    const { container } = render(
      <LeaderboardItem maxValue={200} value={50}>
        Half-ish
      </LeaderboardItem>
    );
    const fill = container.querySelector(
      "[data-slot='leaderboard-item'] span[aria-hidden]"
    ) as HTMLElement | null;
    expect(fill?.style.width).toBe("25%");
  });

  it("clamps the fill bar to 100%", () => {
    const { container } = render(
      <LeaderboardItem maxValue={100} value={500}>
        Over
      </LeaderboardItem>
    );
    const fill = container.querySelector(
      "span[aria-hidden]"
    ) as HTMLElement | null;
    expect(fill?.style.width).toBe("100%");
  });

  it("exposes a render-prop with value + percentage", () => {
    const { getByText } = render(
      <LeaderboardItem maxValue={100} value={40}>
        {({ percentage }) => <span>{percentage}%</span>}
      </LeaderboardItem>
    );
    expect(getByText("40%")).toBeInTheDocument();
  });

  it("fires onAction on click", () => {
    const onAction = vi.fn();
    const { container } = render(<Example onAction={onAction} />);
    const row = container.querySelector('[role="button"]') as HTMLElement;
    fireEvent.click(row);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("fires onAction on Enter key", () => {
    const onAction = vi.fn();
    const { container } = render(<Example onAction={onAction} />);
    const row = container.querySelector('[role="button"]') as HTMLElement;
    fireEvent.keyDown(row, { key: "Enter" });
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
