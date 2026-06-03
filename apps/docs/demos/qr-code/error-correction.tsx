import { QRCode } from "@strait/ui/components/qr-code";

const levels = ["L", "M", "Q", "H"] as const;

export default function QRCodeErrorCorrectionDemo() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {levels.map((level) => (
        <div className="flex flex-col items-center gap-2" key={level}>
          <QRCode level={level} size={130} value="https://example.com" />
          <span className="font-mono text-muted-foreground text-xs">
            level="{level}"
          </span>
        </div>
      ))}
    </div>
  );
}
