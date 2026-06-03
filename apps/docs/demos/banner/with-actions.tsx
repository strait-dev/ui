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

export default function BannerWithActions() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Banner variant="warning">
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

      <Banner variant="info">
        <BannerIcon />
        <BannerContent>
          <BannerTitle>New feature available</BannerTitle>
          <BannerDescription>
            Export your data as CSV from the settings page.
          </BannerDescription>
        </BannerContent>
        <BannerActions>
          <Button size="sm" variant="outline">
            Learn more
          </Button>
        </BannerActions>
      </Banner>
    </div>
  );
}
