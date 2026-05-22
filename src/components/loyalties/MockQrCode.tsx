import { QRCodeSVG } from "qrcode.react";

const SIDEOUT_GREEN = "#02332f";
const SIDEOUT_CREAM = "#d3ccc2";

type MockQrCodeProps = {
  value: string;
  size?: number;
  label?: string;
};

export function MockQrCode({
  value,
  size = 300,
  label = "QR code",
}: MockQrCodeProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      fgColor={SIDEOUT_GREEN}
      bgColor={SIDEOUT_CREAM}
      level="M"
      role="img"
      aria-label={label}
    />
  );
}
