import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

import PillSelector from "../components/PillSelector";
import MessageList from "../components/MessageList";
import PillModal from "../components/PillModal";
import Header from "../components/Header";
import LoadingIndicator from "../components/LoadingIndicator";

export type PillLevel = "green" | "blue" | "red" | null;
export type Message = {
  type: "user" | "ai";
  content: string;
  pill?: PillLevel;
};

const Chat = () => {
  const [selectedPill, setSelectedPill] = useState<PillLevel>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatName, setChatName] = useState<string>("New Chat");
  const [showPillModal, setShowPillModal] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Expand chat interface when user starts typing
  useEffect(() => {
    if (inputValue.length > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  }, [inputValue]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle pill selection
  const handlePillSelect = (pill: PillLevel) => {
    setSelectedPill(pill);

    // Generate chat name based on pill
    const pillNames = {
      green: "Beginner Session",
      blue: "Intermediate Journey",
      red: "Advanced Challenge",
    };
    setChatName(pill ? pillNames[pill] : "New Chat");

    // Add system message based on pill
    const systemMessages = {
      green:
        "CodeMentor will provide detailed guidance with step-by-step explanations.",
      blue: "CodeMentor will provide balanced hints while challenging you to grow.",
      red: "CodeMentor will provide minimal guidance, focusing on concepts and pushing your boundaries.",
    };

    if (pill) {
      setMessages([
        {
          type: "ai",
          content: systemMessages[pill],
          pill: pill,
        },
      ]);
    }

    // Focus input after pill selection
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !selectedPill) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: inputValue }]);

    // Update chat name from first message if it's still default
    if (messages.length === 1) {
      // Only 1 message = the system message
      setChatName(
        inputValue.length > 25
          ? inputValue.substring(0, 22) + "..."
          : inputValue
      );
    }

    // Clear input and show loading
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responseGenerators = {
        green: generateGreenResponse,
        blue: generateBlueResponse,
        red: generateRedResponse,
      };

      // Add AI response with pill type
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            responseGenerators[selectedPill as keyof typeof responseGenerators](
              inputValue
            ),
          pill: selectedPill,
        },
      ]);

      setIsLoading(false);
    }, 1500);
  };

  // If not loaded yet, show loading animation
  if (!isLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <div className="overflow-hidden bg-gray-900 text-gray-100 max-h-screen flex flex-col">
      {/* Header - Only visible when expanded */}
      <div className="sticky top-0 z-10 bg-gray-900">
        <Header
          chatName={chatName}
          selectedPill={selectedPill}
          onPillClick={() => setShowPillModal(true)}
        />
      </div>

      {/* Main content area */}
      <main className="flex-grow flex flex-col h-screen">
        {selectedPill && messages.length > 0 ? (
          <div className="flex flex-col h-full">
            {/* Messages container */}
            <div className="flex-grow overflow-hidden flex flex-col">
              <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
                <MessageList
                  messages={messages}
                  isLoading={isLoading}
                  selectedPill={selectedPill}
                />
              </div>

              {/* Input area - fixed at bottom */}
              <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask your coding question..."
                      className="w-full bg-transparent p-4 text-gray-100 resize-none focus:outline-none"
                      rows={2}
                    />
                    <div className="border-t border-gray-700 p-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className={`p-2 rounded-md ${
                          !inputValue.trim()
                            ? "text-gray-600"
                            : "text-gray-200 hover:bg-gray-700"
                        }`}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
            <h1 className="text-2xl font-bold mb-2 text-gray-100 text-center">
              SocrAI
            </h1>
            <p className="text-gray-400 mb-8 text-center max-w-md">
              Select your mentoring level and ask your coding question.
            </p>
            {/* Pill selection */}
            <div className="mb-10 w-full max-w-lg">
              <PillSelector onPillSelect={handlePillSelect} />
            </div>
            {/* Input form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your coding problem or paste your code..."
                  className="w-full bg-transparent p-4 text-gray-100 resize-none focus:outline-none"
                  rows={3}
                  disabled={!selectedPill}
                />
                <div className="border-t border-gray-700 p-2 flex justify-between items-center">
                  <div className="text-xs text-gray-400 pl-2">
                    {selectedPill
                      ? `${
                          selectedPill.charAt(0).toUpperCase() +
                          selectedPill.slice(1)
                        } Level Selected`
                      : "Select a level to begin"}
                  </div>
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || !selectedPill}
                    className={`p-2 rounded-md ${
                      !inputValue.trim() || !selectedPill
                        ? "text-gray-600"
                        : "text-gray-200 hover:bg-gray-700"
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Pill selection modal */}
      {showPillModal && (
        <PillModal
          selectedPill={selectedPill}
          onSelect={(pill) => {
            setSelectedPill(pill);
            setShowPillModal(false);
          }}
          onClose={() => setShowPillModal(false)}
        />
      )}
    </div>
  );
};

// Response generators
const generateGreenResponse = (query: string) => {
  return `## Analyzing your question

I'll guide you through this step-by-step:

### Core Concepts
Let's break down what you need to understand:
- This pattern is commonly used for state management
- The key challenge is managing component lifecycle

### Detailed Solution
Here's a structured approach:

\`\`\`javascript
// Step 1: Initialize our variables
let solution = [];

// Step 2: Core implementation
function solveTheProblem(input) {
  if (!input || input.length === 0) {
    return null; // Handle edge case
  }
  
  for (let i = 0; i < input.length; i++) {
    // Process each element
    solution.push(processedValue);
  }
  
  return solution;
}
\`\`\`

### Practice Exercise
Try implementing this approach with these examples:
- Example 1: [sample input]
- Example 2: [sample input]`;
};

const generateBlueResponse = (query: string) => {
  return `## Examining your question

Since you've chosen the Intermediate level, I'll provide guidance while letting you work through the implementation:

### Key Patterns to Consider
- This problem fits into the reactive pattern category
- Consider how you might optimize rendering

### Framework for Your Solution
\`\`\`javascript
function buildSolution(data) {
  // Consider: what's the most efficient way to initialize?
  
  // Core algorithm structure
  /* 
   * Hint: The time complexity can be improved by
   * using a different approach here
   */
}
\`\`\`

### Key Questions
- What happens when the input is empty?
- How will your solution scale?`;
};

const generateRedResponse = (query: string) => {
  return `## Challenge analysis

Advanced level selected - I'll focus on high-level concepts:

### Critical Analysis Points
- This problem has multiple solution strategies
- The naive approach runs in O(n²) but can be optimized

### Optimization Direction
\`\`\`
// Pseudocode direction only
function optimalApproach() {
  // Consider leveraging memoization here
  
  // Key insight: What if you precompute values?
}
\`\`\`

### Extension Challenges
Once you have a working solution:
- Can you optimize for memory usage?
- How would you handle large datasets?`;
};

export default Chat;
