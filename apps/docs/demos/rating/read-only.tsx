import { Rating } from "@strait/ui/components/rating";

export default function RatingReadOnly() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Rating aria-label="Rated 2 out of 5" readOnly value={2} />
        <span className="text-muted-foreground text-sm">2 / 5</span>
      </div>
      <div className="flex items-center gap-3">
        <Rating aria-label="Rated 4 out of 5" readOnly value={4} />
        <span className="text-muted-foreground text-sm">4 / 5</span>
      </div>
      <div className="flex items-center gap-3">
        <Rating aria-label="Rated 5 out of 5" readOnly value={5} />
        <span className="text-muted-foreground text-sm">5 / 5</span>
      </div>
    </div>
  );
}
