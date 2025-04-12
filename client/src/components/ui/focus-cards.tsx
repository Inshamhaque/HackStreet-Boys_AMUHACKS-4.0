"use client";
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { CheckCircle, Circle, XCircle } from "lucide-react";

// Card component with color
export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
          {card.title}
        </div>
      </div>
      {/* Color Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: card.color }}
      ></div>
    </div>
  )
);

Card.displayName = "Card";

type Card = {
  title: string;
  color: string;
};

// Pill selector component with icons
function PillSelector({
  selectedPill,
  setSelectedPill,
}: {
  selectedPill: string;
  setSelectedPill: React.Dispatch<React.SetStateAction<string>>;
}) {
  const pills = [
    { label: "Beginner", icon: <Circle size={18} /> },
    { label: "Intermediate", icon: <CheckCircle size={18} /> },
    { label: "Advanced", icon: <XCircle size={18} /> },
  ];

  return (
    <div className="flex space-x-6 mb-8">
      {pills.map((pill) => (
        <button
          key={pill.label}
          onClick={() => setSelectedPill(pill.label)}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all",
            selectedPill === pill.label
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          )}
        >
          {pill.icon}
          <span>{pill.label}</span>
        </button>
      ))}
    </div>
  );
}

// FocusCards component to render cards based on selected pill
export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedPill, setSelectedPill] = useState<string>("Beginner"); // Default to "Beginner"

  return (
    <div className="max-w-5xl mx-auto md:px-8 w-full">
      {/* Pill Selector */}
      <PillSelector
        selectedPill={selectedPill}
        setSelectedPill={setSelectedPill}
      />

      {/* Cards display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cards.map((card, index) => (
          <Card
            key={card.title}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </div>
    </div>
  );
}
