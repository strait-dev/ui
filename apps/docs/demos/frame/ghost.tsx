import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@strait/ui/components/frame";

export default function FrameGhost() {
  return (
    <Frame className="max-w-md" variant="ghost">
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Inbox</FrameTitle>
          <FrameDescription>Three new messages.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Sent</FrameTitle>
          <FrameDescription>Last sent 2 hours ago.</FrameDescription>
        </FrameHeader>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Archive</FrameTitle>
          <FrameDescription>1,204 conversations.</FrameDescription>
        </FrameHeader>
      </FramePanel>
    </Frame>
  );
}
