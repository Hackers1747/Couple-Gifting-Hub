import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import QRCard from "@/components/QRCard";

export default function Success() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const shareUrl = params.get("url") || "heartdrop.in/card/demo";
  const shareToken = params.get("token") || "demo";
  const planType = params.get("plan") || "per_card";
  const recipientName = params.get("recipient") || "someone special";
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.4 },
        colors: ["#B76E79", "#fff", "#f9a8d4", "#fecdd3"],
      });
    }, 400);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`https://${shareUrl}`);
    } catch {
      // fallback for non-https
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function generatePDF() {
    const doc = new jsPDF("p", "mm", "a5");

    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 148, 210, "F");

    doc.setTextColor(183, 110, 121);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("HeartDrop", 74, 22, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(`For ${recipientName}`, 74, 38, { align: "center" });

    doc.setTextColor(156, 163, 175);
    doc.setFontSize(10);
    doc.text("A surprise is waiting for you at:", 74, 55, { align: "center" });

    doc.setTextColor(183, 110, 121);
    doc.setFontSize(11);
    doc.text(`https://${shareUrl}`, 74, 65, { align: "center" });

    try {
      const qrDataUrl = await QRCode.toDataURL(`https://${shareUrl}`, {
        width: 180,
        margin: 1,
        color: { dark: "#B76E79", light: "#0A0A0A" },
      });
      doc.addImage(qrDataUrl, "PNG", 49, 80, 50, 50);
    } catch {}

    doc.setTextColor(156, 163, 175);
    doc.setFontSize(9);
    doc.text("Scan to open your HeartDrop ↑", 74, 140, { align: "center" });

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.text("heartdrop.in — Made with ❤", 74, 200, { align: "center" });

    doc.save(`heartdrop-${recipientName.replace(/\s+/g, "-")}.pdf`);
  }

  const whatsappText = encodeURIComponent(
    `I made something special for you 💝\n\nhttps://${shareUrl}`
  );

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  async function nativeShare() {
    try {
      await navigator.share({
        title: "HeartDrop 💝",
        text: `I made something special for ${recipientName}!`,
        url: `https://${shareUrl}`,
      });
    } catch {
      // dismissed — no-op
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center px-4 py-12" style={{ maxWidth: 430, margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="w-full text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h1 className="font-serif text-3xl text-white mb-2">Your card is ready!</h1>
        <p className="text-gray-400 text-sm mb-8">
          Share the link with {recipientName} and watch their reaction live ✨
        </p>

        <div className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ background: "rgba(183,110,121,0.08)", border: "1px solid rgba(183,110,121,0.25)" }}>
          <span className="text-[#B76E79] text-xs flex-1 truncate text-left font-mono">
            https://{shareUrl}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={copyLink}
            className="text-xs px-3 py-1.5 rounded-xl font-medium shrink-0"
            style={{ background: copied ? "rgba(74,222,128,0.15)" : "rgba(183,110,121,0.2)", color: copied ? "#4ade80" : "#B76E79" }}
          >
            {copied ? "Copied! ✓" : "📋 Copy"}
          </motion.button>
        </div>

        <div className="space-y-3 mb-8">
          {canNativeShare && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={nativeShare}
              className="w-full py-4 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #B76E79 0%, #8B4E5A 100%)",
                boxShadow: "0 4px 24px rgba(183,110,121,0.4)",
              }}
            >
              <span>📤</span> Share
            </motion.button>
          )}

          <motion.a
            whileTap={{ scale: 0.97 }}
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", boxShadow: "0 4px 20px rgba(37,211,102,0.3)" }}
          >
            <span>💚</span> Share on WhatsApp
          </motion.a>

          {planType !== "per_card" && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={generatePDF}
              className="w-full py-4 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-2"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span>📄</span> Download PDF
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/dashboard")}
            className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2"
            style={{ background: "rgba(183,110,121,0.08)", border: "1px solid rgba(183,110,121,0.2)", color: "#B76E79" }}
          >
            <span>📊</span> Go to Dashboard
          </motion.button>
        </div>

        <div className="mb-6">
          <QRCard token={shareToken} recipientName={recipientName} />
          <p className="text-gray-500 text-xs text-center mt-2">
            Print this QR and put it in a physical card 🎁<br />
            Receiver scans → digital experience opens
          </p>
        </div>

        <div className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-gray-400 text-xs mb-3">You'll be notified when</p>
          <div className="flex justify-around">
            {[["👁", "Opened"], ["❤️", "Reacted"], ["💬", "Replied"]].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{icon}</span>
                <span className="text-gray-500 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-700 text-xs mt-6">
          Made with ❤ on HeartDrop
        </p>
      </motion.div>
    </div>
  );
}
