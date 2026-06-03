import {
  Banner,
  BannerActions,
  BannerClose,
  BannerContent,
  BannerDescription,
  BannerIcon,
  BannerTitle,
} from "@strait/ui/components/banner";
import { Button } from "@strait/ui/components/button";

export default function BannerFullWidth() {
  return (
    <div className="w-full">
      <Banner layout="full-width" variant="destructive">
        <BannerIcon />
        <BannerContent>
          <BannerTitle>Payment failed</BannerTitle>
          <BannerDescription>
            Your card was declined. Please update your billing info.
          </BannerDescription>
        </BannerContent>
        <BannerActions>
          <Button size="sm" variant="outline">
            Update billing
          </Button>
          <BannerClose />
        </BannerActions>
      </Banner>
    </div>
  );
}
