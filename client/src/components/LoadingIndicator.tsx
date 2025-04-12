import React from "react";
import { Shield, Code, Zap } from "lucide-react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="bg-gray-900 h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-6">
        <div className="animate-spin-slow">
          <div className="relative flex items-center justify-center">
            <Shield
              size={28}
              className="text-green-500 absolute"
              style={{ transform: "rotate(120deg) translateY(-20px)" }}
            />
            <Code
              size={28}
              className="text-blue-500 absolute"
              style={{ transform: "translateY(-20px)" }}
            />
            <Zap
              size={28}
              className="text-red-500 absolute"
              style={{ transform: "rotate(-120deg) translateY(-20px)" }}
            />
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">CodeMentor AI</h1>
      <p className="text-gray-400">Loading...</p>
    </div>
  );
};

export default LoadingIndicator;
