import { motion, AnimatePresence } from "framer-motion";

interface TotalBarProps {
  total: number;
  selectedCount: number;
  onGeneratePdf: () => void;
  onPrepareProposal?: () => void;
  isGenerating?: boolean;
  isPreparing?: boolean;
}

export const TotalBar = ({ total, selectedCount, onGeneratePdf, onPrepareProposal, isGenerating, isPreparing }: TotalBarProps) => {
  const disabledGenerate = selectedCount === 0 || isGenerating || isPreparing;
  const disabledPrepare = isGenerating || isPreparing;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="total-gradient backdrop-blur-lg border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onPrepareProposal && (
              <button 
                type="button"
                onClick={onPrepareProposal}
                disabled={disabledPrepare}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-opacity shrink-0 ${
                  disabledPrepare
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary-foreground text-primary hover:opacity-90"
                }`}
              >
                {isPreparing ? "Preparing..." : "Prepare Proposal"}
              </button>
            )}
            <button 
              type="button"
              onClick={onGeneratePdf}
              disabled={disabledGenerate}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-opacity shrink-0 ${
                disabledGenerate
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary-foreground text-primary hover:opacity-90"
              }`}
            >
              {isGenerating ? "Generating..." : "Generate Engagement Letter"}
            </button>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <AnimatePresence mode="wait">
              <motion.span
                key={selectedCount}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-primary-foreground/80 text-sm md:text-base whitespace-nowrap"
              >
                {selectedCount} service{selectedCount !== 1 ? "s" : ""} selected
              </motion.span>
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-primary-foreground/70 text-sm md:text-base font-medium">Total</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={total}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-primary-foreground text-2xl md:text-3xl font-bold"
              >
                ${total.toLocaleString()}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
