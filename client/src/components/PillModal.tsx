import React from "react";
import { X, Shield, Code, Zap } from "lucide-react";
import { PillLevel } from "../pages/Chat";

interface PillModalProps {
  selectedPill: PillLevel;
  onSelect: (pill: PillLevel) => void;
  onClose: () => void;
}

const PillModal: React.FC<PillModalProps> = ({
  selectedPill,
  onSelect,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black border border-gray-800 rounded-xl max-w-md w-full p-6 relative shadow-[0_0_20px_#00ffcc33]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 tracking-wide text-center">
          Choose Your Pill
        </h2>

        <div className="space-y-4">
          <PillOption
            color="green"
            icon={<Shield size={18} />}
            title="Green Pill"
            description="Safe guidance. Stay in the known. Learn slowly, securely."
            isSelected={selectedPill === "green"}
            onClick={() => onSelect("green")}
          />

          <PillOption
            color="blue"
            icon={<Code size={18} />}
            title="Blue Pill"
            description="Dive deeper. A balance of reality and comfort."
            isSelected={selectedPill === "blue"}
            onClick={() => onSelect("blue")}
          />

          <PillOption
            color="red"
            icon={<Zap size={18} />}
            title="Red Pill"
            description="Truth. Chaos. Complete freedom. No hand-holding."
            isSelected={selectedPill === "red"}
            onClick={() => onSelect("red")}
          />
        </div>
      </div>
    </div>
  );
};

interface PillOptionProps {
  color: "green" | "blue" | "red";
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const PillOption: React.FC<PillOptionProps> = ({
  color,
  icon,
  title,
  description,
  isSelected,
  onClick,
}) => {
  const baseColor =
    color === "green"
      ? "text-green-400 border-green-500 hover:border-green-400"
      : color === "blue"
      ? "text-blue-400 border-blue-500 hover:border-blue-400"
      : "text-red-400 border-red-500 hover:border-red-400";

  const bgSelected =
    color === "green"
      ? "bg-green-900/20"
      : color === "blue"
      ? "bg-blue-900/20"
      : "bg-red-900/20";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start space-x-3 ${
        isSelected
          ? `${bgSelected} ${baseColor}`
          : `border-gray-700 ${baseColor}`
      }`}
    >
      <div className="p-2 rounded-full bg-black/50">{icon}</div>
      <div>
        <div className="text-white font-semibold text-lg">{title}</div>
        <div className="text-sm text-gray-400 mt-1">{description}</div>
      </div>
    </button>
  );
};

export default PillModal;
