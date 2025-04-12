// components/PillSelection.tsx
import { motion } from "framer-motion";

type PillProps = {
  selectedPill: "green" | "blue" | "red" | null;
  onPillSelect: (pill: "green" | "blue" | "red") => void;
};

const PillSelection = ({ selectedPill, onPillSelect }: PillProps) => {
  const pills = [
    { color: "green", label: "Green Pill (Beginner)" },
    { color: "blue", label: "Blue Pill (Intermediate)" },
    { color: "red", label: "Red Pill (Pro)" },
  ];

  return (
    <div className="flex justify-center gap-6 flex-wrap py-12">
      {pills.map(({ color, label }) => (
        <motion.button
          key={color}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => onPillSelect(color as any)}
          className={`px-6 py-3 rounded-full border-2 text-white transition-all duration-300 
            ${
              selectedPill === color
                ? "border-white scale-105"
                : `border-${color}-500`
            } 
            hover:bg-${color}-700`}
        >
          {label}
        </motion.button>
      ))}
    </div>
  );
};

export default PillSelection;
