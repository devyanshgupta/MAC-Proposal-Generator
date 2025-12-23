import { motion } from "framer-motion";
import { Checkbox } from "./ui/checkbox";

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
  
  const getScale = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.65;
    if (distance === 2) return 0.5;
    return 0.42; // for 3+ away
  };

  const getOpacity = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.8;
    if (distance === 2) return 0.65;
    return 0.5; // for 3+ away
  };

  const getFontWeight = () => {
    if (distance === 0) return 700;
    if (distance === 1) return 600;
    return 500;
  };

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
      <span className="flex items-center gap-2.5">
        <div className="h-4 flex items-center">
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
          />
        </div>
        <span 
          className="relative shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onCheckboxChange(e);
          }}
        > 
          <Checkbox
            checked={checked || indeterminate}
            onCheckedChange={() => {}}
            className="w-4 h-4"
          />
        </span>
        <span className="break-words leading-tight flex-1 min-w-0">{category}</span>
      </span>
    </motion.button>
  );
};


