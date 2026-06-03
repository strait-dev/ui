"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@strait/ui/components/carousel";

const slides = [
  { id: 1, label: "Slide 1", bg: "bg-primary/10" },
  { id: 2, label: "Slide 2", bg: "bg-info/10" },
  { id: 3, label: "Slide 3", bg: "bg-success/10" },
  { id: 4, label: "Slide 4", bg: "bg-warning/10" },
  { id: 5, label: "Slide 5", bg: "bg-destructive/10" },
];

export default function CarouselMultiSlide() {
  return (
    <div className="w-96 px-12">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {slides.map(({ id, label, bg }) => (
            <CarouselItem className="basis-1/2" key={id}>
              <div
                className={`flex h-36 items-center justify-center rounded-xl font-medium text-sm ${bg}`}
              >
                {label}
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
