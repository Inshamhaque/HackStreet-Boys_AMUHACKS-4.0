import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  MessageSquare,
  Zap,
  ArrowRight,
  ChevronDown,
  Brain,
  BookOpen,
  Award,
  LightbulbIcon,
} from "lucide-react";
import PillSelector from "../components/PillSelector";
import { PillLevel } from "../pages/Chat";
import { StarsBackground } from "../components/ui/stars-background";

const LandingPage: React.FC = () => {
  const [selectedPill, setSelectedPill] = useState<PillLevel | null>(null);
  const [isFeatureExpanded, setIsFeatureExpanded] = useState(false);

  const handlePillSelect = (pill: PillLevel) => {
    setSelectedPill(pill);
  };

  const handleGetStarted = () => {
    // Navigate to chat or show onboarding
    window.location.href = "/signup";
    console.log("Get started with:", selectedPill);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="fixed top-0 left-0 w-full z-50  shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gray-400">SocrAI</div>
        <a
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
        >
          Login
        </a>
      </div>

      {/* Hero section */}
      <StarsBackground />
      <motion.header
        className="container mx-auto px-4 py-16 md:py-24 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center justify-center p-3 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              <Code size={28} className="text-indigo-400" />
            </div>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            SocrAI
            <br />
          </motion.h1>

          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Think Before You Copy:
            <br />
            <span className="text-indigo-400">Your AI Coding Mentor</span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Guiding your thinking process, not by giving away solutions. Choose
            your guidance style with our unique pill modes.
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h2 className="text-xl mb-6">
              Select your preferred mentoring level:
            </h2>
            <PillSelector onPillSelect={handlePillSelect} />
          </motion.div>

          <motion.button
            onClick={handleGetStarted}
            className={`flex items-center justify-center mx-auto py-4 px-8 rounded-lg text-lg font-medium transition-all duration-300 ${
              selectedPill
                ? selectedPill === "green"
                  ? "bg-green-600 cursor-pointer hover:bg-green-700"
                  : selectedPill === "blue"
                  ? "bg-blue-600n cursor-pointer hover:bg-blue-700"
                  : "bg-red-600 cursor-pointer hover:bg-red-700"
                : "bg-gray-700 cursor-pointer opacity-60"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try It Now <ArrowRight className="ml-2" size={18} />
          </motion.button>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <a
              href="#learn-more"
              className="text-indigo-400 hover:text-indigo-300 underline text-lg"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </motion.header>

      {/* How It Works section - NEW */}
      <motion.section
        id="learn-more"
        className="py-20 bg-gray-900/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            {[
              {
                number: 1,
                title: "Submit Your Problem",
                description:
                  "Paste your coding problem or doubt. Whether it's a LeetCode challenge, a bug in your code, or a conceptual question.",
                icon: <BookOpen className="text-indigo-400" size={24} />,
              },
              {
                number: 2,
                title: "Choose Your Pill Mode",
                description:
                  "Select the level of guidance you want: Green (beginner), Blue (intermediate), or Red (advanced) to customize your learning experience.",
                icon: <Award className="text-indigo-400" size={24} />,
              },
              {
                number: 3,
                title: "Receive Tailored Guidance",
                description:
                  "Our AI mentor provides guidance based on your chosen pill mode, helping you think through the problem without spoon-feeding solutions.",
                icon: <LightbulbIcon className="text-indigo-400" size={24} />,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex mb-16 items-start"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0 mr-6">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-indigo-500/30 text-xl font-bold">
                    {step.number}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-3">
                    <div className="mr-3">{step.icon}</div>
                    <h3 className="text-2xl font-medium">{step.title}</h3>
                  </div>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pill Modes Explained - NEW */}
      <motion.section
        className="py-20 bg-gray-950"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Choose Your Guidance Style
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Green Pill",
                subtitle: "For Beginners",
                description: [
                  "Step-by-step structured explanations",
                  '"Let\'s solve this together" approach',
                  "Full thought process guidance",
                  "Focuses on learning fundamentals",
                ],
                color: "green",
              },
              {
                title: "Blue Pill",
                subtitle: "For Intermediates",
                description: [
                  "Fewer direct hints",
                  "Guiding questions that nudge you forward",
                  "Trains critical thinking skills",
                  "Encourages independent problem-solving",
                ],
                color: "blue",
              },
              {
                title: "Red Pill",
                subtitle: "For Advanced Users",
                description: [
                  "Minimal help and guidance",
                  "Topic classification only",
                  "Encourages full independent problem-solving",
                  "For those who want to truly master coding",
                ],
                color: "red",
              },
            ].map((pill, index) => (
              <motion.div
                key={index}
                className={`border border-${pill.color}-500/30 rounded-xl p-8 bg-gray-900`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-8 h-8 rounded-full bg-${pill.color}-500 mr-3`}
                  ></div>
                  <div>
                    <h3 className={`text-2xl font-bold text-${pill.color}-400`}>
                      {pill.title}
                    </h3>
                    <p className="text-gray-400">{pill.subtitle}</p>
                  </div>
                </div>
                <ul className="text-gray-300">
                  {pill.description.map((item, i) => (
                    <li key={i} className="mb-3 flex items-start">
                      <div
                        className={`w-2 h-2 rounded-full bg-${pill.color}-400 mt-2 mr-3`}
                      ></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features section */}
      <motion.section
        className="py-16 bg-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Adaptive Learning Experience
            </motion.h2>
            <motion.p
              className="text-gray-400 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Choose how SocrAI interacts with you based on your experience
              level
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Beginner Friendly",
                description:
                  "Step-by-step guidance with detailed explanations for those new to coding",
                icon: <MessageSquare className="text-green-400" />,
                color: "green",
              },
              {
                title: "Intermediate Support",
                description:
                  "Balanced help with some explanations but letting you work through concepts",
                icon: <Code className="text-blue-400" />,
                color: "blue",
              },
              {
                title: "Advanced Mentoring",
                description:
                  "Concise, expert-level assistance assuming strong fundamentals",
                icon: <Zap className="text-red-400" />,
                color: "red",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-gray-800 p-6 rounded-xl border border-${feature.color}-900/30`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                viewport={{ once: true }}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-${feature.color}-900/20 flex items-center justify-center mb-4`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Expandable feature section */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => setIsFeatureExpanded(!isFeatureExpanded)}
              className="flex items-center mx-auto text-gray-400 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See more features
              <motion.div
                animate={{ rotate: isFeatureExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="ml-2" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isFeatureExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8 px-4">
                    {[
                      "Syntax highlighting for multiple languages",
                      "Real-time code analysis and suggestions",
                      "Customizable AI responses based on your needs",
                      "Save and reference past coding solutions",
                      "Debugging assistance with clear explanations",
                      "Best practices and performance optimization tips",
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        className="bg-gray-800/50 p-4 rounded-lg"
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-indigo-400 mr-3"></div>
                          {feature}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials - NEW */}
      <motion.section
        className="py-20 bg-gray-950/80"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Developers Are Saying
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "I never truly learned how to solve problems until I started using the Red Pill mode. Now I can tackle any coding challenge.",
                name: "Alex Chen",
                title: "Senior Developer",
                pill: "Red",
              },
              {
                quote:
                  "The Blue Pill mode strikes the perfect balance. It helped me bridge the gap from tutorial hell to independent problem solving.",
                name: "Mei Zhang",
                title: "Full Stack Developer",
                pill: "Blue",
              },
              {
                quote:
                  "As a coding beginner, the Green Pill's step-by-step guidance helped me build confidence and understand core concepts properly.",
                name: "Jordan Smith",
                title: "CS Student",
                pill: "Green",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-6 rounded-xl border border-gray-800"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm flex items-center">
                      {testimonial.title}
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs bg-${testimonial.pill.toLowerCase()}-500/20 text-${testimonial.pill.toLowerCase()}-400`}
                      >
                        {testimonial.pill} Pill User
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center bg-gradient-to-b from-gray-800 to-gray-900 p-10 rounded-2xl border border-gray-700 relative overflow-hidden"
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              viewport={{ once: true }}
            />

            <h2 className="text-3xl font-bold mb-4 relative z-10">
              Ready to elevate your coding skills?
            </h2>
            <p className="text-gray-300 mb-8 relative z-10">
              Start coding with your AI mentor that adapts to your skill level
              and helps you learn to think like a programmer
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">
              <motion.button
                className="py-3 px-8 rounded-lg text-lg font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 w-full md:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try SocrAI Now
              </motion.button>
              <motion.button
                className="py-3 px-8 rounded-lg text-lg font-medium bg-transparent border border-indigo-500 hover:bg-indigo-900/30 transition-colors duration-300 w-full md:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
