import React from "react";
import { Pill } from "lucide-react";
import { PillLevel } from "../pages/Chat";

interface PillSelectorProps {
  onPillSelect: (pill: PillLevel) => void;
}

const PillSelector: React.FC<PillSelectorProps> = ({ onPillSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <PillOption
        color="green"
        icon={<Pill size={20} />}
        title="Green Pill"
        description="Stay in comfort. Everything will be explained."
        onClick={() => onPillSelect("green")}
      />

      <PillOption
        color="blue"
        icon={<Pill size={20} />}
        title="Blue Pill"
        description="Step deeper. A balance of truth and guidance."
        onClick={() => onPillSelect("blue")}
      />

      <PillOption
        color="red"
        icon={<Pill size={20} />}
        title="Red Pill"
        description="No going back. Learn with full freedom."
        onClick={() => onPillSelect("red")}
      />
    </div>
  );
};

interface PillOptionProps {
  color: "green" | "blue" | "red";
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const PillOption: React.FC<PillOptionProps> = ({
  color,
  icon,
  title,
  description,
  onClick,
}) => {
  const baseColor = {
    green: "border-green-500 text-green-400 hover:bg-green-800/10",
    blue: "border-blue-500 text-blue-400 hover:bg-blue-800/10",
    red: "border-red-500 text-red-400 hover:bg-red-800/10",
  };

  return (
    <button
      onClick={onClick}
      className={`group p-5 rounded-xl border transition-all duration-300 hover:shadow-[0_0_10px] bg-black ${baseColor[color]}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`mb-3 ${baseColor[color].split(" ")[1]}`}>{icon}</div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </button>
  );
};

export default PillSelector;
