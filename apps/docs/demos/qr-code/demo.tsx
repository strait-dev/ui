import { QRCode, QRCodeDownload } from "@strait/ui/components/qr-code";

export default function QRCodeDemo() {
  return (
    <div className="flex items-center gap-8">
      <QRCode size={160} value="https://strait-dev.github.io/ui/">
        <QRCodeDownload filename="strait-ui-qr" />
      </QRCode>
      <QRCode level="M" size={120} value="https://github.com/strait-dev/ui" />
    </div>
  );
}
