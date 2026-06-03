import {
  Banner,
  BannerContent,
  BannerDescription,
  BannerIcon,
  BannerTitle,
} from "@strait/ui/components/banner";

export default function BannerVariants() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      {(["info", "success", "warning", "destructive"] as const).map(
        (variant) => (
          <Banner key={variant} variant={variant}>
            <BannerIcon />
            <BannerContent>
              <BannerTitle>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} banner
              </BannerTitle>
              <BannerDescription>
                This is a {variant} status message.
              </BannerDescription>
            </BannerContent>
          </Banner>
        )
      )}
    </div>
  );
}
