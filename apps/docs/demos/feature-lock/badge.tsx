import { FeatureBadge } from "@strait/ui/components/feature-lock";

export default function FeatureLockBadge() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FeatureBadge plan="Pro" />
      <FeatureBadge plan="Business" />
      <FeatureBadge plan="Enterprise" />
      <FeatureBadge plan="Pro" size="sm" />
      <FeatureBadge plan="Enterprise" size="lg" />
    </div>
  );
}
