import { motion } from "framer-motion";

interface CategoryHeadingProps {
  category: string;
  isActive: boolean;
  distance: number;
  onClick: () => void;
}

export const CategoryHeading = ({ category, isActive, distance, onClick }: CategoryHeadingProps) => {
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

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="block w-full text-left cursor-pointer origin-left select-none pr-4"
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
      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)", willChange: "transform" }}
    >
      <span className="flex items-start gap-2">
        <motion.span
          className="w-6 h-0.5 bg-primary rounded-full origin-left mt-4 shrink-0"
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
        <span className="break-words leading-tight">{category}</span>
      </span>
    </motion.button>
  );
};
