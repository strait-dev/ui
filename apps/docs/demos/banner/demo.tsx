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

export default function BannerDemo() {
  return (
    <Banner className="w-full max-w-lg" variant="warning">
      <BannerIcon />
      <BannerContent>
        <BannerTitle>Free plan limit reached</BannerTitle>
        <BannerDescription>
          You have used 90% of your monthly quota.
        </BannerDescription>
      </BannerContent>
      <BannerActions>
        <Button size="sm" variant="outline">
          Upgrade
        </Button>
        <BannerClose />
      </BannerActions>
    </Banner>
  );
}
