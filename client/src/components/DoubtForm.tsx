// components/DoubtForm.tsx
import { useState } from "react";

const DoubtForm = ({
  selectedPill,
  onSubmit,
}: {
  selectedPill: string | null;
  onSubmit: (doubt: string) => void;
}) => {
  const [doubt, setDoubt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (doubt.trim()) {
      onSubmit(doubt);
      setDoubt("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4">
      <textarea
        className="w-full h-32 p-4 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none"
        placeholder="Enter your coding doubt..."
        value={doubt}
        onChange={(e) => setDoubt(e.target.value)}
        disabled={!selectedPill}
      />
      <button
        type="submit"
        className="mt-4 bg-neon-green hover:bg-green-600 text-black font-semibold py-2 px-6 rounded-md transition-all"
        disabled={!selectedPill}
      >
        Get Guidance
      </button>
    </form>
  );
};

export default DoubtForm;
