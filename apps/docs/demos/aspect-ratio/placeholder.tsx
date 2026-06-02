import { AspectRatio } from "@strait/ui/components/aspect-ratio";

export default function AspectRatioPlaceholder() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio
        className="animate-pulse overflow-hidden rounded-xl bg-muted"
        ratio={16 / 9}
      >
        <span className="sr-only">Loading image…</span>
      </AspectRatio>
    </div>
  );
}
