import { Badge } from "@strait/ui/components/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="info-light">Info light</Badge>
        <Badge variant="success-light">Success light</Badge>
        <Badge variant="warning-light">Warning light</Badge>
        <Badge variant="destructive-light">Destructive light</Badge>
        <Badge variant="primary-light">Primary light</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge radius="pill" variant="success">
          Pill
        </Badge>
        <Badge radius="md" variant="outline">
          Rounded MD
        </Badge>
        <Badge size="xs" variant="info">
          xs
        </Badge>
        <Badge size="lg" variant="secondary">
          lg
        </Badge>
      </div>
    </div>
  );
}
