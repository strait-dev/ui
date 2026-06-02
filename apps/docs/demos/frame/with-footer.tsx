import { Button } from "@strait/ui/components/button";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@strait/ui/components/frame";

export default function FrameWithFooter() {
  return (
    <Frame className="max-w-md">
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Delete workspace</FrameTitle>
          <FrameDescription>
            This action is permanent and cannot be undone. All projects,
            members, and data will be lost.
          </FrameDescription>
        </FrameHeader>
        <FrameFooter>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
          <Button size="sm" variant="destructive-solid">
            Delete workspace
          </Button>
        </FrameFooter>
      </FramePanel>
    </Frame>
  );
}
