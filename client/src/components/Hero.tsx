// components/Hero.tsx
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="text-center py-20 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold text-neon-green"
      >
        Welcome to Akelios
      </motion.h1>
      <p className="mt-4 text-gray-300 max-w-xl mx-auto text-lg">
        A Socratic-inspired platform that helps you solve coding doubts
        step-by-step — not spoon-feed.
      </p>
    </section>
  );
};
export default Hero;
