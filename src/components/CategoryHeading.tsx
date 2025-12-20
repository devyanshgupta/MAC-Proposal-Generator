import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { Minus } from "lucide-react";

interface CategoryHeadingProps {
  category: string;
  isActive: boolean;
  distance: number;
  onClick: () => void;
  checked: boolean;
  indeterminate: boolean;
  onCheckboxChange: (e: React.MouseEvent) => void;
}

export const CategoryHeading = ({ 
  category, 
  isActive, 
  distance, 
  onClick, 
  checked, 
  indeterminate, 
  onCheckboxChange 
}: CategoryHeadingProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  // Calculate scale based on distance from active heading
  const getScale = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.65;
    if (distance === 2) return 0.5;
    if (distance === 3) return 0.42;
    return 0.35;
  };

  const getOpacity = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.7;
    if (distance === 2) return 0.5;
    if (distance === 3) return 0.35;
    return 0.2;
  };

  const getFontWeight = () => {
    if (distance === 0) return 700;
    if (distance === 1) return 600;
    return 500;
  };

  // Set indeterminate state on checkbox
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="block w-full text-left cursor-pointer origin-left select-none pr-6"
      initial={false}
      animate={{
        scale: getScale(),
        opacity: getOpacity(),
        fontWeight: getFontWeight(),
        color: isActive ? "hsl(var(--heading-active))" : "hsl(var(--heading-inactive))",
      }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ opacity: 1 }}
      style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)", willChange: "transform" }}
    >
      <span className="flex items-start gap-2.5">
        <motion.span
          className="w-5 h-0.5 bg-primary rounded-full origin-left shrink-0"
          initial={false}
          animate={{
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          style={{ marginTop: '0.7em' }}
        />
        <span 
          className="relative shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onCheckboxChange(e);
          }}
          style={{ marginTop: '0.4em' }}
        >
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            onChange={() => {}}
            className="w-4 h-4 rounded border-2 border-primary/40 cursor-pointer accent-primary appearance-none checked:bg-primary checked:border-primary hover:border-primary/60 transition-colors relative"
            style={{
              backgroundImage: checked && !indeterminate 
                ? 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3E%3C/svg%3E")'
                : 'none',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          {indeterminate && (
            <Minus 
              className="absolute inset-0 m-auto w-2.5 h-2.5 text-primary pointer-events-none" 
              strokeWidth={3}
            />
          )}
        </span>
        <span className="break-words leading-tight flex-1 min-w-0">{category}</span>
      </span>
    </motion.button>
  );
};
