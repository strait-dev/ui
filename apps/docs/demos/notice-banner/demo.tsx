import { Button } from "@strait/ui/components/button";
import {
  NoticeBanner,
  NoticeBannerAction,
} from "@strait/ui/components/notice-banner";

export default function NoticeBannerDemo() {
  return (
    <NoticeBanner
      action={
        <NoticeBannerAction>
          <Button size="sm" variant="outline">
            Learn more
          </Button>
        </NoticeBannerAction>
      }
      className="w-full max-w-lg"
      dismissible
      title="New feature available"
      variant="info"
    >
      Try the redesigned dashboard for a faster workflow.
    </NoticeBanner>
  );
}
