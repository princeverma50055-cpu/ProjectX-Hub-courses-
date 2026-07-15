"use client";

import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";

interface ProgressBarProps {
  percent: number;
  certificateUnlocked: boolean;
  onDownloadCertificate?: () => void;
}

export default function ProgressBar({
  percent,
  certificateUnlocked,
  onDownloadCertificate,
}: ProgressBarProps) {
  return (
    <div className="sticky top-0 z-20 bg-brand-900/95 backdrop-blur border-b border-brand-700 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400">
              Course Progress
            </span>
            <span className="text-xs font-semibold text-brand-accentLight">
              {percent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-brand-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-accentGlow"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        <button
          onClick={onDownloadCertificate}
          disabled={!certificateUnlocked}
          className={
            certificateUnlocked
              ? "flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-gold text-brand-950 text-sm font-semibold shadow-glow hover:brightness-110 transition-all shrink-0"
              : "flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-800 text-slate-500 text-sm font-medium cursor-not-allowed shrink-0"
          }
          title={
            certificateUnlocked
              ? "Download your verified certificate"
              : "Reach 80% completion to unlock your certificate"
          }
        >
          {certificateUnlocked ? <Award size={16} /> : <Lock size={16} />}
          <span className="hidden sm:inline">
            {certificateUnlocked ? "Download Certificate" : "Certificate Locked"}
          </span>
        </button>
      </div>
    </div>
  );
}
