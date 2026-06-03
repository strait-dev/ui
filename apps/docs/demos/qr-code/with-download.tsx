import { QRCode, QRCodeDownload } from "@strait/ui/components/qr-code";

export default function QRCodeWithDownloadDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <QRCode size={160} value="https://example.com">
        <QRCodeDownload filename="my-qrcode" size="sm" variant="outline" />
      </QRCode>
    </div>
  );
}
