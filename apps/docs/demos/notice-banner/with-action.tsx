import { Button } from "@strait/ui/components/button";
import {
  NoticeBanner,
  NoticeBannerAction,
} from "@strait/ui/components/notice-banner";

export default function NoticeBannerWithAction() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <NoticeBanner
        action={
          <NoticeBannerAction>
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </NoticeBannerAction>
        }
        title="Free plan limit reached"
        variant="warning"
      >
        You have used 90% of your monthly quota.
      </NoticeBanner>

      <NoticeBanner
        action={
          <NoticeBannerAction>
            <Button size="sm">Add card</Button>
          </NoticeBannerAction>
        }
        dismissible
        title="Payment method required"
        variant="destructive"
      >
        Your trial ends in 3 days.
      </NoticeBanner>
    </div>
  );
}
