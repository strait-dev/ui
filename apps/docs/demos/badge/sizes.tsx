import { Badge } from "@strait/ui/components/badge";

export default function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="xs" variant="info-light">
        xs
      </Badge>
      <Badge size="sm" variant="info-light">
        sm
      </Badge>
      <Badge size="default" variant="info-light">
        default
      </Badge>
      <Badge size="lg" variant="info-light">
        lg
      </Badge>
      <Badge size="xl" variant="info-light">
        xl
      </Badge>
    </div>
  );
}
