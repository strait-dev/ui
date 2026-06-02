import { Badge } from "@strait/ui/components/badge";

export default function BadgeDot() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge dot variant="success-light">
        Online
      </Badge>
      <Badge dot variant="destructive-light">
        Busy
      </Badge>
      <Badge dot variant="warning-light">
        Away
      </Badge>
      <Badge dot variant="outline">
        Offline
      </Badge>
      <Badge dot radius="pill" variant="info-light">
        Pill dot
      </Badge>
    </div>
  );
}
