import {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardTrigger,
} from "@strait/ui/components/preview-card";

export default function PreviewCardDemo() {
  return (
    <PreviewCard>
      <PreviewCardTrigger className="cursor-pointer text-primary underline underline-offset-4">
        Hover over this link
      </PreviewCardTrigger>
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup>
            <div className="flex flex-col gap-2">
              <div className="h-32 w-full rounded-md bg-muted" />
              <p className="font-semibold text-sm">Preview Title</p>
              <p className="text-muted-foreground text-xs">
                A short description that gives context about the hovered item
                before navigating to it.
              </p>
            </div>
            <PreviewCardArrow />
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  );
}
