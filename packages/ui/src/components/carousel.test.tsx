import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  globalThis.IntersectionObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
  // Embla carousel uses window.matchMedia for media query breakpoint options
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (q: string): MediaQueryList => ({
      matches: false,
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

function BasicCarousel() {
  return (
    <Carousel>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
        <CarouselItem>Slide 3</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

describe("Carousel", () => {
  it("renders with data-slot='carousel' and role='region'", () => {
    render(<BasicCarousel />);
    const carousel = screen.getByRole("region");
    expect(carousel).toHaveAttribute("data-slot", "carousel");
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("renders slide content", () => {
    render(<BasicCarousel />);
    expect(screen.getByText("Slide 1")).toBeInTheDocument();
    expect(screen.getByText("Slide 2")).toBeInTheDocument();
    expect(screen.getByText("Slide 3")).toBeInTheDocument();
  });

  it("renders CarouselContent with data-slot='carousel-content'", () => {
    const { container } = render(<BasicCarousel />);
    expect(
      container.querySelector("[data-slot='carousel-content']")
    ).toBeInTheDocument();
  });

  it("renders slides with role='group' and aria-roledescription='slide'", () => {
    render(<BasicCarousel />);
    const slides = screen.getAllByRole("group");
    expect(slides.length).toBe(3);
    for (const slide of slides) {
      expect(slide).toHaveAttribute("aria-roledescription", "slide");
      expect(slide).toHaveAttribute("data-slot", "carousel-item");
    }
  });

  it("renders Previous button with data-slot='carousel-previous'", () => {
    const { container } = render(<BasicCarousel />);
    expect(
      container.querySelector("[data-slot='carousel-previous']")
    ).toBeInTheDocument();
  });

  it("renders Next button with data-slot='carousel-next'", () => {
    const { container } = render(<BasicCarousel />);
    expect(
      container.querySelector("[data-slot='carousel-next']")
    ).toBeInTheDocument();
  });

  it("renders Previous button with sr-only text", () => {
    render(<BasicCarousel />);
    expect(screen.getByText("Previous slide")).toBeInTheDocument();
  });

  it("renders Next button with sr-only text", () => {
    render(<BasicCarousel />);
    expect(screen.getByText("Next slide")).toBeInTheDocument();
  });

  it("renders vertical carousel with orientation prop", () => {
    render(
      <Carousel orientation="vertical">
        <CarouselContent>
          <CarouselItem>Slide A</CarouselItem>
        </CarouselContent>
      </Carousel>
    );
    const carousel = screen.getByRole("region");
    expect(carousel).toBeInTheDocument();
    expect(screen.getByText("Slide A")).toBeInTheDocument();
  });
});
