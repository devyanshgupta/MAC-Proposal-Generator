import { motion } from "framer-motion";

interface CategoryHeadingProps {
  category: string;
  isActive: boolean;
  distance: number; // 0 = active, 1 = adjacent, 2 = further away, etc.
  onClick: () => void;
}

export const CategoryHeading = ({ category, isActive, distance, onClick }: CategoryHeadingProps) => {
  // Calculate size based on distance from active heading
  const getSize = () => {
    if (distance === 0) return "text-4xl md:text-5xl lg:text-6xl";
    if (distance === 1) return "text-2xl md:text-3xl";
    if (distance === 2) return "text-xl md:text-2xl";
    if (distance === 3) return "text-lg md:text-xl";
    return "text-base md:text-lg";
  };

  const getOpacity = () => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.7;
    if (distance === 2) return 0.5;
    if (distance === 3) return 0.35;
    return 0.2;
  };

  const getFontWeight = () => {
    if (distance === 0) return "font-bold";
    if (distance === 1) return "font-semibold";
    return "font-medium";
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        block text-left transition-all duration-500 ease-out cursor-pointer
        ${getSize()} ${getFontWeight()}
        ${isActive ? "heading-active" : "heading-inactive"}
        hover:opacity-100
      `}
      style={{ opacity: getOpacity() }}
      whileHover={{ x: isActive ? 0 : 5 }}
      transition={{ duration: 0.2 }}
    >
      <span className="flex items-center gap-3">
        {isActive && (
          <motion.span
            layoutId="activeIndicator"
            className="w-8 h-1 bg-primary rounded-full"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 32 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <span>{category}</span>
      </span>
    </motion.button>
  );
};
