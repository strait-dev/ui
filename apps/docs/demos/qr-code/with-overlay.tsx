import { QRCode, QRCodeOverlay } from "@strait/ui/components/qr-code";

export default function QRCodeWithOverlayDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <QRCode level="H" size={200} value="https://example.com">
        <QRCodeOverlay>
          <div className="flex size-full items-center justify-center rounded bg-primary font-bold text-[8px] text-primary-foreground">
            LOGO
          </div>
        </QRCodeOverlay>
      </QRCode>
      <p className="text-center text-muted-foreground text-xs">
        Use <code>level="H"</code> (30% error correction) when adding an
        overlay.
      </p>
    </div>
  );
}
