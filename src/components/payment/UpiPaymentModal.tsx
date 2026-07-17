"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, QrCode, CheckCircle2, Loader2 } from "lucide-react";

interface UpiPaymentModalProps {
  courseId: string;
  courseTitle: string;
  price: number;
  onClose: () => void;
}

type Step = "checkout" | "confirm" | "submitted";

export default function UpiPaymentModal({
  courseId,
  courseTitle,
  price,
  onClose,
}: UpiPaymentModalProps) {
  const [step, setStep] = useState<Step>("checkout");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState<{
    orderId: string;
    upiLink: string;
    qrCodeUrl: string;
  } | null>(null);
  const [utr, setUtr] = useState("");

  const handlePayNow = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start payment");
        return;
      }
      setOrderData(data);
      setStep("confirm");
      window.location.href = data.upiLink;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUtr = async () => {
    if (!orderData) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId, utr }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }
      setStep("submitted");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-brand-800 border border-brand-700 rounded-2xl p-6 shadow-card relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>

          {step === "checkout" && (
            <>
              <h2 className="text-lg font-bold text-white mb-1">{courseTitle}</h2>
              <p className="text-3xl font-bold text-brand-accentLight mb-6">
                ₹{price.toLocaleString("en-IN")}
              </p>

              {error && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayNow}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-accent hover:bg-brand-accentLight text-white text-sm font-semibold shadow-glow transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Smartphone size={16} />
                )}
                {loading ? "Starting payment..." : "Pay with UPI"}
              </button>
              <p className="text-[11px] text-slate-500 text-center mt-3">
                Opens your UPI app (GPay, PhonePe, Paytm) to complete payment.
              </p>
            </>
          )}

          {step === "confirm" && orderData && (
            <>
              <h2 className="text-lg font-bold text-white mb-1">Complete Payment</h2>
              <p className="text-sm text-slate-400 mb-4">
                Didn't open your UPI app? Scan this QR from your phone.
              </p>

              <div className="flex justify-center mb-4">
                <img
                  src={orderData.qrCodeUrl}
                  alt="UPI QR Code"
                  className="rounded-lg border border-brand-700"
                  width={200}
                  height={200}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 justify-center">
                <QrCode size={14} /> Scan &amp; pay ₹{price.toLocaleString("en-IN")}
              </div>

              <label className="text-xs text-slate-400 mb-1.5 block">
                After paying, enter your UPI transaction ID (UTR/RRN)
              </label>
              <input
                type="text"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 442112345678"
                className="w-full bg-brand-900 border border-brand-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-accent mb-3"
              />

              {error && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmitUtr}
                disabled={loading || utr.length < 6}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-accent hover:bg-brand-accentLight text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Submitting..." : "I've Paid — Submit for Verification"}
              </button>
            </>
          )}

          {step === "submitted" && (
            <div className="text-center py-4">
              <CheckCircle2 size={40} className="mx-auto text-brand-success mb-4" />
              <h2 className="text-lg font-bold text-white mb-2">
                Payment Submitted
              </h2>
              <p className="text-sm text-slate-400">
                We're verifying your transaction. Your course will unlock in
                your dashboard within a few hours.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full py-2.5 rounded-lg bg-brand-700 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
