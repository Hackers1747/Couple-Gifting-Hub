import { QRCodeCanvas } from "qrcode.react";

interface QRCardProps {
  token: string;
  recipientName: string;
}

export default function QRCard({ token, recipientName }: QRCardProps) {
  const url = `https://heartdrop.in/card/${token}`;

  function downloadQR() {
    const canvas = document.getElementById("heartdrop-qr") as HTMLCanvasElement | null;
    if (!canvas) return;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `heartdrop-${recipientName.replace(/\s+/g, "-")}.png`;
    link.click();
  }

  return (
    <div className="rounded-2xl p-6 text-center"
      style={{ background: "#141414", border: "1px solid #2A2A2A" }}>
      <p className="text-gray-400 text-sm mb-4">Scan to open surprise 💝</p>

      <div className="flex justify-center">
        <QRCodeCanvas
          id="heartdrop-qr"
          value={url}
          size={180}
          bgColor="#141414"
          fgColor="#B76E79"
          level="H"
          includeMargin={true}
        />
      </div>

      <p className="text-[#B76E79] text-xs mt-3">heartdrop.in</p>

      <button
        onClick={downloadQR}
        className="mt-4 w-full py-3 rounded-full font-medium text-white text-sm transition-opacity hover:opacity-90 active:scale-95"
        style={{ background: "linear-gradient(135deg, #B76E79 0%, #8B4E5A 100%)" }}
      >
        Download QR 📥
      </button>
    </div>
  );
}
