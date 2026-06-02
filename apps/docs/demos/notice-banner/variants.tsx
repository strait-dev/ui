import { NoticeBanner } from "@strait/ui/components/notice-banner";

export default function NoticeBannerVariants() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      {(["info", "success", "warning", "destructive"] as const).map(
        (variant) => (
          <NoticeBanner
            key={variant}
            title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} banner`}
            variant={variant}
          >
            This is a {variant} message.
          </NoticeBanner>
        )
      )}
    </div>
  );
}
