"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";

/** The Embla carousel API instance (imperative scroll controls). */
type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
/** Embla carousel initialization options forwarded to `useEmblaCarousel`. */
type CarouselOptions = UseCarouselParameters[0];
/** Embla plugin array forwarded to `useEmblaCarousel`. */
type CarouselPlugin = UseCarouselParameters[1];

/** Props for {@link Carousel}. */
export type CarouselProps = {
  /** Embla options forwarded directly to `useEmblaCarousel`. */
  opts?: CarouselOptions;
  /** Embla plugins (e.g. autoplay, wheel gestures). */
  plugins?: CarouselPlugin;
  /** Scroll axis — `"horizontal"` (default) or `"vertical"`. */
  orientation?: "horizontal" | "vertical";
  /**
   * Callback that receives the Embla API instance once it is ready.
   * Use this to call imperative methods (e.g. `api.scrollTo(index)`).
   */
  setApi?: (api: CarouselApi) => void;
};

/** Internal context value shared between {@link Carousel} sub-components. */
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

/**
 * Hook that reads the nearest {@link Carousel} context.
 *
 * Useful for building custom navigation controls outside the built-in
 * {@link CarouselPrevious} / {@link CarouselNext} buttons.
 */
function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

/**
 * Accessible, touch-friendly carousel built on Embla Carousel.
 *
 * Wrap slides in {@link CarouselContent} > {@link CarouselItem} and
 * optionally add {@link CarouselPrevious} / {@link CarouselNext} buttons
 * outside {@link CarouselContent}. The root element receives
 * `role="region"` and `aria-roledescription="carousel"` following the
 * WAI-ARIA APG carousel pattern; keyboard arrow navigation is wired
 * automatically.
 *
 * @remarks
 * - Pass `opts` for Embla configuration (loop, align, drag-free, etc.).
 * - Pass `plugins` to add Embla plugins such as autoplay or wheel gestures.
 * - Use `setApi` to obtain the Embla API instance for imperative scrolling.
 * - The `orientation` prop maps to Embla's `axis` option (`"x"` / `"y"`).
 *
 * @example
 * ```tsx
 * <Carousel opts={{ loop: true }}>
 *   <CarouselContent>
 *     {slides.map((s) => (
 *       <CarouselItem key={s.id}>{s.content}</CarouselItem>
 *     ))}
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 * </Carousel>
 * ```
 */
function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  // Translate the orientation prop to Embla's axis option, merging with
  // any other opts the consumer may have provided.
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  // Re-evaluate scroll-ability after every slide selection or reInit.
  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  // Expose the Embla API to the consumer via setApi once it is ready.
  React.useEffect(() => {
    if (!(api && setApi)) {
      return;
    }
    setApi(api);
  }, [api, setApi]);

  // Subscribe to Embla's "select" and "reInit" events to keep the
  // canScrollPrev/Next flags in sync with the current scroll position.
  React.useEffect(() => {
    if (!api) {
      return;
    }
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: WAI-ARIA APG carousel pattern uses role="region" with aria-roledescription, not a generic <section>. */}
      <div
        aria-roledescription="carousel"
        className={cn("relative", className)}
        data-slot="carousel"
        onKeyDownCapture={handleKeyDown}
        role="region"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

/**
 * Scrollable container for {@link CarouselItem} slides within a
 * {@link Carousel}. Attaches the Embla viewport ref and flexes items in
 * the correct axis direction.
 */
function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      className="overflow-hidden"
      data-slot="carousel-content"
      ref={carouselRef}
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
}

/**
 * A single slide inside {@link CarouselContent}. Receives
 * `role="group"` and `aria-roledescription="slide"` per the WAI-ARIA
 * carousel pattern. Basis defaults to `100%`; override with Tailwind
 * `basis-*` utilities for multi-slide views.
 */
function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA APG carousel pattern uses role="group" with aria-roledescription="slide" for each slide; no native element fits.
    <div
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      data-slot="carousel-item"
      role="group"
      {...props}
    />
  );
}

/**
 * Absolutely-positioned button that scrolls a {@link Carousel} to the
 * previous slide. Disabled automatically when no previous slide exists.
 * Positioned to the left (horizontal) or top (vertical) of the viewport.
 */
function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      data-slot="carousel-previous"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      size={size}
      variant={variant}
      {...props}
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

/**
 * Absolutely-positioned button that scrolls a {@link Carousel} to the
 * next slide. Disabled automatically when no next slide exists.
 * Positioned to the right (horizontal) or bottom (vertical) of the viewport.
 */
function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      className={cn(
        "absolute touch-manipulation rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      data-slot="carousel-next"
      disabled={!canScrollNext}
      onClick={scrollNext}
      size={size}
      variant={variant}
      {...props}
    >
      <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
};
