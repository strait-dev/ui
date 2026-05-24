import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DirectionProvider, useDirection } from "./direction";

function DirectionConsumer() {
  const dir = useDirection();
  return (
    <div data-direction={dir} data-testid="dir-output">
      {dir}
    </div>
  );
}

describe("DirectionProvider", () => {
  it("provides ltr direction by default (no provider)", () => {
    render(<DirectionConsumer />);
    expect(screen.getByTestId("dir-output")).toHaveTextContent("ltr");
  });

  it("provides ltr direction when direction='ltr'", () => {
    render(
      <DirectionProvider direction="ltr">
        <DirectionConsumer />
      </DirectionProvider>
    );
    expect(screen.getByTestId("dir-output")).toHaveTextContent("ltr");
  });

  it("provides rtl direction when direction='rtl'", () => {
    render(
      <DirectionProvider direction="rtl">
        <DirectionConsumer />
      </DirectionProvider>
    );
    expect(screen.getByTestId("dir-output")).toHaveTextContent("rtl");
  });

  it("renders children inside the provider", () => {
    render(
      <DirectionProvider direction="ltr">
        <p>Child content</p>
      </DirectionProvider>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
