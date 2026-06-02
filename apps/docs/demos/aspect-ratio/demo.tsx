import { AspectRatio } from "@strait/ui/components/aspect-ratio";

export default function AspectRatioDemo() {
  return (
    <div className="w-80">
      <AspectRatio ratio={16 / 9}>
        <div className="absolute inset-0 flex size-full items-center justify-center rounded-lg bg-muted font-medium text-muted-foreground text-sm">
          16 / 9
        </div>
      </AspectRatio>
    </div>
  );
}
