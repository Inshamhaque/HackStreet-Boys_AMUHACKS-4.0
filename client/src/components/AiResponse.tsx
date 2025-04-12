// components/AiResponse.tsx
import { motion } from "framer-motion";

const AiResponse = ({
  response,
  selectedPill,
}: {
  response: string | null;
  selectedPill: string | null;
}) => {
  if (!response) return null;

  const colors = {
    green: "text-green-400",
    blue: "text-blue-400",
    red: "text-red-400",
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto mt-12 p-6 rounded-lg bg-gray-900 border border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3
        className={`text-xl font-bold mb-4 ${
          colors[selectedPill as keyof typeof colors]
        }`}
      >
        AI Guidance:
      </h3>
      <p className="whitespace-pre-wrap text-gray-200">{response}</p>
    </motion.div>
  );
};

export default AiResponse;
