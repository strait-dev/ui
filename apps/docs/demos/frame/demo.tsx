import { Button } from "@strait/ui/components/button";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@strait/ui/components/frame";

export default function FrameDemo() {
  return (
    <Frame className="max-w-md" stacked>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Storage</FrameTitle>
          <FrameDescription>Using 12 GB of 100 GB.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Bandwidth</FrameTitle>
          <FrameDescription>3 TB / month plan.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>API calls</FrameTitle>
          <FrameDescription>240 K of 1 M this month.</FrameDescription>
        </FrameHeader>
        <FrameFooter>
          <Button size="sm" variant="outline">
            View details
          </Button>
        </FrameFooter>
      </FramePanel>
    </Frame>
  );
}
