import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface ServiceItemProps {
  id: string;
  service: string;
  price: number;
  isSelected: boolean;
  onToggle: () => void;
}

export const ServiceItem = ({ service, price, isSelected, onToggle }: ServiceItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-4 py-4 group cursor-pointer"
      onClick={onToggle}
    >
      {/* Bullet point */}
      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
      
      {/* Service description */}
      <p className="flex-1 text-foreground/80 text-base md:text-lg leading-relaxed group-hover:text-foreground transition-colors">
        {service}
      </p>
      
      {/* Checkbox */}
      <button
        className={`
          mt-1 w-7 h-7 rounded-md border-2 shrink-0 flex items-center justify-center
          transition-all duration-300 ease-out
          ${isSelected 
            ? "check-bg border-transparent" 
            : "border-border hover:border-primary/50 bg-background"
          }
        `}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <AnimatePresence mode="wait">
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      
      {/* Price */}
      <div className="w-28 text-right shrink-0">
        <AnimatePresence mode="wait">
          {isSelected ? (
            <motion.span
              key="selected"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-price-selected font-semibold text-lg"
            >
              + ${price.toLocaleString()}
            </motion.span>
          ) : (
            <motion.span
              key="unselected"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-muted-foreground font-medium"
            >
              ${price.toLocaleString()}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
