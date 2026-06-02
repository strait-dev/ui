import {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardTrigger,
} from "@strait/ui/components/preview-card";

export default function PreviewCardLinkPreview() {
  return (
    <PreviewCard>
      <PreviewCardTrigger className="cursor-pointer font-medium text-primary underline underline-offset-4">
        React documentation
      </PreviewCardTrigger>
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup>
            <div className="flex flex-col gap-2">
              <div className="h-32 w-full rounded-md bg-blue-100 dark:bg-blue-900/20" />
              <p className="font-semibold text-sm">React</p>
              <p className="text-muted-foreground text-xs">
                The library for web and native user interfaces. Declarative,
                component-based, and learn-once-write-anywhere.
              </p>
            </div>
            <PreviewCardArrow />
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  );
}
