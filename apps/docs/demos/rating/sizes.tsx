import { Rating } from "@strait/ui/components/rating";

export default function RatingSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-16 text-muted-foreground text-sm">sm</span>
        <Rating aria-label="Small rating" defaultValue={3} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-muted-foreground text-sm">default</span>
        <Rating aria-label="Default rating" defaultValue={3} size="default" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-muted-foreground text-sm">lg</span>
        <Rating aria-label="Large rating" defaultValue={3} size="lg" />
      </div>
    </div>
  );
}
