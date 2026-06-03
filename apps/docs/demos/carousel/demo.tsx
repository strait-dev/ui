"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@strait/ui/components/carousel";

const slides = [
  {
    id: 1,
    title: "Design Tokens",
    description: "Semantic color, spacing, and radius variables.",
  },
  {
    id: 2,
    title: "Base UI Primitives",
    description: "Accessible headless components as the foundation.",
  },
  {
    id: 3,
    title: "Tailwind v4",
    description: "Utility-first styling with @theme tokens.",
  },
  {
    id: 4,
    title: "Tree-shakeable",
    description: "One subpath export per component for minimal bundles.",
  },
];

export default function CarouselDemo() {
  return (
    <div className="w-96 px-8">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="flex h-36 flex-col items-center justify-center gap-2 rounded-lg border bg-card p-6 text-center">
                <p className="font-semibold">{slide.title}</p>
                <p className="text-muted-foreground text-sm">
                  {slide.description}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
