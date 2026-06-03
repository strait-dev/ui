import { NoticeBanner } from "@strait/ui/components/notice-banner";

export default function NoticeBannerDismissible() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <NoticeBanner dismissible title="Deployed successfully" variant="success">
        Your changes are live at app.example.com.
      </NoticeBanner>
      <NoticeBanner dismissible title="Payment failed" variant="destructive">
        Your card was declined. Please update your billing info.
      </NoticeBanner>
    </div>
  );
}
