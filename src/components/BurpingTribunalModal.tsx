import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, AlertCircle } from 'lucide-react';
import { Z_INDEX_TOKENS } from '../tokens';

export interface BurpingTribunalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BurpingTribunalModal: React.FC<BurpingTribunalModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="burping-tribunal-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tribunal-modal-title"
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
          style={{ zIndex: Z_INDEX_TOKENS.debugOverlay + 10 }}
        >
          {/* Dark Backdrop with soft blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#04060A]/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-xl bg-[#1a1c1c]/95 border border-white/15 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden text-left"
          >
            {/* Header Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffafd7]/40 to-transparent" />

            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Tribunal Report"
              className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffafd7]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Case Reference */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono-label text-[10px] text-[#ffafd7]">
                Official Tribunal Record • #21-11-2025
              </span>
            </div>

            <h3
              id="tribunal-modal-title"
              className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-wide mb-1"
            >
              The Acoustic Evidence
            </h3>

            <p className="font-body text-xs text-[#e2e2e2]/70 mb-5 italic">
              Disputed late-night vocal resonance showdown.
            </p>

            {/* Structured Evidence Block */}
            <div className="space-y-3.5 mb-6">
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <Award className="w-5 h-5 text-[#ffafd7] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-body text-xs font-semibold text-white tracking-wide block mb-0.5">
                    Official Ruling: He Won
                  </span>
                  <p className="font-body text-xs text-[#e2e2e2]/80 leading-relaxed">
                    By metrics of sheer volume, acoustic confidence, and unmatched audacity at 1:40 AM.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#d3c0e0] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-body text-xs font-semibold text-white tracking-wide block mb-0.5">
                    Defendant&apos;s Legal Appeal
                  </span>
                  <p className="font-body text-xs text-[#e2e2e2]/80 leading-relaxed">
                    Her legal team has formally disputed the verdict, claiming unauthorized decibel boosting and demanding an immediate retrial.
                  </p>
                </div>
              </div>

              <div className="px-3.5 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                <p className="font-editorial italic text-sm text-[#ffafd7]">
                  &ldquo;Case closed. Verdict remains permanently recorded in history.&rdquo;
                </p>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-[4px] bg-[#282a2b] hover:bg-[#333535] border border-white/15 text-[#ffafd7] font-mono-label text-xs tracking-[0.2em] active:scale-95 transition-all shadow-[0_0_20px_rgba(212,108,166,0.2)]"
              >
                Case Closed
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
