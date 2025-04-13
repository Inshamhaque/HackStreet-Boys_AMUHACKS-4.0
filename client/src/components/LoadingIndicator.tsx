import React from "react";
import { Pill } from "lucide-react";
import { motion } from "framer-motion";

const LoadingIndicator: React.FC = () => {
  // Radius of the circular path
  const radius = 40;

  return (
    <div className="bg-gray-900 h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-6">
        <div className="relative h-32 w-32 flex items-center justify-center">
          {/* Rotating container */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Shield */}
            <motion.div
              className="absolute"
              style={{
                x: radius * Math.cos(Math.PI / 1.5),
                y: radius * Math.sin(Math.PI / 1.5),
              }}
            >
              <Pill size={28} className="text-green-500" />
            </motion.div>

            {/* Code */}
            <motion.div
              className="absolute"
              style={{
                x: radius * Math.cos(0),
                y: radius * Math.sin(0),
              }}
            >
              <Pill size={28} className="text-blue-500" />
            </motion.div>

            {/* Zap */}
            <motion.div
              className="absolute"
              style={{
                x: radius * Math.cos(-Math.PI / 1.5),
                y: radius * Math.sin(-Math.PI / 1.5),
              }}
            >
              <Pill size={28} className="text-red-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.h1
        className="text-2xl font-bold text-white mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        SocrAI
      </motion.h1>

      <motion.p
        className="text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingIndicator;
