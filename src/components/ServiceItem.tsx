import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { ServiceItem as ServiceItemData } from "../data/servicesData";
import { Input } from "./ui/input";

type ServiceItemProps = Omit<ServiceItemData, 'price'> & {
  price: number;
  originalPrice: number;
  isSelected: boolean;
  onToggle: () => void;
  onCustomPriceChange: (price: number) => void;
  scopeOfWork?: string;
};

export const ServiceItem = ({ service, price, originalPrice, billingCycle, isSelected, onToggle, onCustomPriceChange, scopeOfWork }: ServiceItemProps) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value);
    if (!isNaN(newPrice)) {
      onCustomPriceChange(newPrice);
    }
  };

  const handleResetPrice = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCustomPriceChange(originalPrice);
  };
  
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
      <div className="flex-1">
        <p className="text-foreground/80 text-base md:text-lg leading-relaxed group-hover:text-foreground transition-colors">
          {service}
        </p>
        {scopeOfWork && (
          <p className="text-sm text-muted-foreground mt-1">{scopeOfWork}</p>
        )}
      </div>
      
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
      <div className="w-36 text-right shrink-0 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isSelected ? (
            <motion.div
              key="selected-price"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-price-selected font-semibold text-lg">+ $</span>
                <Input
                  type="number"
                  value={price}
                  onChange={handlePriceChange}
                  className="text-price-selected font-semibold text-lg pl-10 pr-2 py-1 h-auto bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <p className="text-xs text-muted-foreground -mt-1">{billingCycle}</p>
            </motion.div>
          ) : (
            <motion.div
              key="unselected-price"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1"
            >
              <span className="text-muted-foreground font-medium">
                ${price.toLocaleString()}
              </span>
              <p className="text-xs text-muted-foreground/80">{billingCycle}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isSelected && price !== originalPrice && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={handleResetPrice}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Reset price"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};