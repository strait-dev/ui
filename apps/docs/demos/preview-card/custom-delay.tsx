import {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardTrigger,
} from "@strait/ui/components/preview-card";

export default function PreviewCardCustomDelay() {
  return (
    <div className="flex gap-6">
      <PreviewCard>
        <PreviewCardTrigger
          className="cursor-pointer text-primary underline underline-offset-4"
          closeDelay={0}
          delay={0}
        >
          Instant
        </PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>
              <p className="text-sm">Opens immediately on hover.</p>
              <PreviewCardArrow />
            </PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>

      <PreviewCard>
        <PreviewCardTrigger
          className="cursor-pointer text-primary underline underline-offset-4"
          closeDelay={600}
          delay={600}
        >
          Slow (600 ms)
        </PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>
              <p className="text-sm">Opens after 600 ms.</p>
              <PreviewCardArrow />
            </PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>
    </div>
  );
}
