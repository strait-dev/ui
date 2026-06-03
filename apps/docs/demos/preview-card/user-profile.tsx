import {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardTrigger,
} from "@strait/ui/components/preview-card";

export default function PreviewCardUserProfile() {
  return (
    <PreviewCard>
      <PreviewCardTrigger className="cursor-pointer font-medium text-primary underline underline-offset-4">
        @janedoe
      </PreviewCardTrigger>
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-sm">Jane Doe</p>
                <p className="text-muted-foreground text-xs">
                  Senior Product Designer
                </p>
                <p className="mt-1 text-xs">
                  Building accessible and delightful user interfaces. Open to
                  opportunities.
                </p>
              </div>
            </div>
            <PreviewCardArrow />
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  );
}
