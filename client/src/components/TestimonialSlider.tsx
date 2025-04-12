import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  "Akelios helped me actually understand recursion for the first time!",
  "Finally a tool that *teaches* and doesn’t just solve.",
  "Red Pill mode made me feel like I was pair programming with a wise mentor.",
];

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % testimonials.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-20 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-gray-400 italic max-w-xl mx-auto"
        >
          “{testimonials[index]}”
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default TestimonialSlider;
