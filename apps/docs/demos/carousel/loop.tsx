"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@strait/ui/components/carousel";

const slides = [1, 2, 3, 4, 5];

export default function CarouselLoop() {
  return (
    <div className="w-80 px-12">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((n) => (
            <CarouselItem key={n}>
              <div className="flex aspect-video items-center justify-center rounded-xl bg-muted font-semibold text-2xl text-muted-foreground">
                {n}
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
