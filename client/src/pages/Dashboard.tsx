import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Zap,
  Award,
  Menu,
  Send,
  X,
  ChevronDown,
  Code,
  Moon,
  Power,
  Shield,
} from "lucide-react";

type PillLevel = "green" | "blue" | "red" | null;

const Index = () => {
  const [selectedPill, setSelectedPill] = useState<PillLevel>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    Array<{ type: "user" | "ai"; content: string; pill?: PillLevel }>
  >([]);
  const [pillSelectVisible, setPillSelectVisible] = useState<boolean>(true);
  const [chatName, setChatName] = useState<string>("New Chat");
  const [showPillModal, setShowPillModal] = useState<boolean>(false);
  const [systemStarted, setSystemStarted] = useState<boolean>(false);
  const [bootupPhase, setBootupPhase] = useState<number>(0);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulated boot sequence
  useEffect(() => {
    if (!systemStarted) {
      const bootupTimer = setTimeout(() => {
        setBootupPhase(1);
        setTimeout(() => {
          setBootupPhase(2);
          setTimeout(() => {
            setBootupPhase(3);
            setTimeout(() => {
              setSystemStarted(true);
            }, 1000);
          }, 800);
        }, 1200);
      }, 500);

      return () => clearTimeout(bootupTimer);
    }
  }, [systemStarted]);

  // Matrix digital rain effect
  useEffect(() => {
    if (!canvasRef.current || !systemStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters to display
    const chars = "01".split("");

    // Array of drops - one per column
    const drops: number[] = [];
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // Initialize all drops to start at random positions
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Drawing function
    const draw = () => {
      // Black with alpha for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Text styling
      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px monospace`;

      // Looping through drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = chars[Math.floor(Math.random() * chars.length)];

        // Draw character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Move drops down
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 60);

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reset drops
      for (let i = 0; i < canvas.width / fontSize; i++) {
        drops[i] = Math.random() * -100;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, systemStarted]);

  // Handle pill selection
  const handlePillSelect = (pill: PillLevel) => {
    setSelectedPill(pill);
    setPillSelectVisible(false);

    // Generate chat name based on first message or pill if no messages
    if (messages.length === 0) {
      const pillNames = {
        green: "Beginner Session",
        blue: "Intermediate Journey",
        red: "Pro Challenge",
      };
      setChatName(pill ? pillNames[pill] : "New Chat");
    }

    // Add system message based on pill
    const systemMessages = {
      green:
        "System initialized in Beginner Mode. CodeMentor AI will provide detailed guidance with step-by-step explanations.",
      blue: "System initialized in Intermediate Mode. CodeMentor AI will provide balanced hints while challenging you to grow.",
      red: "System initialized in Advanced Mode. CodeMentor AI will provide minimal guidance, focusing on concepts and pushing your boundaries.",
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

    // Simulate AI typing/thinking time
    setTimeout(() => {
      const pillResponses = {
        green: generateGreenPillResponse(inputValue),
        blue: generateBluePillResponse(inputValue),
        red: generateRedPillResponse(inputValue),
      };

      // Add AI response with pill type
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: pillResponses[selectedPill as keyof typeof pillResponses],
          pill: selectedPill,
        },
      ]);

      setIsLoading(false);
    }, 1500 + Math.random() * 1500); // Random delay between 1.5-3 seconds
  };

  // Response generators for different pill types
  const generateGreenPillResponse = (query: string) => {
    return `## Analyzing: ${query.substring(0, 30)}${
      query.length > 30 ? "..." : ""
    }

I'll guide you through this step-by-step:

### Core Concepts
Let's break down the fundamental principles you need to understand:
- This pattern is commonly used for [specific application]
- The key challenge here is [concept explanation]

### Detailed Solution Path
Here's a structured approach with explanations:

\`\`\`javascript
// Step 1: Initialize our variables
let solution = [];

/* 
 * We're using an array because it allows us to
 * efficiently track multiple elements in sequence
 */

// Step 2: Core algorithm implementation
function solveTheProblem(input) {
  // First we validate the input
  if (!input || input.length === 0) {
    return null; // Handle edge case
  }
  
  // Then we process each element
  for (let i = 0; i < input.length; i++) {
    // Detailed explanation of this step...
    
    // Add to our solution
    solution.push(processedValue);
  }
  
  return solution;
}
\`\`\`

### Practice Exercise
Try implementing this approach with these sample inputs:
- Example 1: [sample input]
- Example 2: [sample input]

Let me know if you'd like me to explain any part in more detail!`;
  };

  const generateBluePillResponse = (query: string) => {
    return `## Examining: ${query.substring(0, 30)}${
      query.length > 30 ? "..." : ""
    }

Since you've chosen the Blue Pill, I'll provide guidance while letting you work through the implementation details:

### Key Patterns to Consider
- This problem fits into the [algorithmic pattern] category
- Consider how you might optimize using [relevant data structure]
- Watch for these edge cases: [examples]

### Framework for Your Solution
\`\`\`javascript
function buildSolution(data) {
  // Consider: what's the most efficient way to initialize?
  
  // Core algorithm structure
  /* 
   * Hint: The time complexity can be improved from O(n²) to O(n log n)
   * by using a different approach here
   */
  
  // What edge cases should you handle?
}
\`\`\`

### Key Questions to Ask Yourself
- What happens when the input is empty?
- How will your solution scale with larger inputs?
- Is there a more memory-efficient approach?

Try implementing this yourself, and I can review your approach or provide more specific hints if needed.`;
  };

  const generateRedPillResponse = (query: string) => {
    return `## Challenge: ${query.substring(0, 30)}${
      query.length > 30 ? "..." : ""
    }

Red Pill selected - I'll focus on high-level concepts and push you to develop your own optimal solution:

### Critical Analysis Points
- This problem has multiple solution strategies with different performance characteristics
- Consider the space-time complexity tradeoffs for each approach
- The naive approach runs in O(n²) but can be optimized to O(n)

### Optimization Direction
\`\`\`
// Pseudocode direction only
function optimalApproach() {
  // Consider leveraging [advanced data structure] here
  
  // Key insight: What if you precompute values instead of recalculating?
  
  // Advanced: How would you parallelize this for multi-threading?
}
\`\`\`

### Extension Challenges
Once you have a working solution:
- Can you optimize for memory usage?
- How would you handle distributed inputs?
- What test cases would break your algorithm?

Implement your solution first, then we can discuss the architectural decisions and optimizations.`;
  };

  // If system is booting up, show boot sequence
  if (!systemStarted) {
    return (
      <div className="bg-black h-screen w-screen font-mono text-green-500 p-8 overflow-hidden">
        <div className="max-w-2xl mx-auto mt-16">
          {bootupPhase >= 1 && (
            <div className="animate-typewriter mb-6">
              <p className="text-green-400">Initializing CodeMentor AI...</p>
              <p className="text-gray-500 text-sm">
                Loading neural networks:{" "}
                <span className="text-green-400">complete</span>
              </p>
              <p className="text-gray-500 text-sm">
                Configuring language models:{" "}
                <span className="text-green-400">complete</span>
              </p>
              <p className="text-gray-500 text-sm">
                Establishing secure connection:{" "}
                <span className="text-green-400">complete</span>
              </p>
            </div>
          )}

          {bootupPhase >= 2 && (
            <div className="animate-flicker my-8">
              <pre className="text-xs text-green-600">
                {`
   ______          __     __  ___           __               ___    __ 
  / ____/___  ____/ /__  /  |/  /__  ____  / /_____  _____  /   |  / / 
 / /   / __ \\/ __  / _ \\/ /|_/ / _ \\/ __ \\/ __/ __ \\/ ___/ / /| | / /  
/ /___/ /_/ / /_/ /  __/ /  / /  __/ / / / /_/ /_/ / /    / ___ |/ /___
\\____/\\____/\\__,_/\\___/_/  /_/\\___/_/ /_/\\__/\\____/_/    /_/  |_/_____/
                                                                        
`}
              </pre>
            </div>
          )}

          {bootupPhase >= 3 && (
            <div className="animate-fadein">
              <div className="flex items-center justify-center space-x-4 my-10">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-ping"></div>
                <div
                  className="h-2 w-2 bg-green-500 rounded-full animate-ping"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-2 w-2 bg-green-500 rounded-full animate-ping"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <p className="text-center text-green-400">
                System ready. Launching interface...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-green-400 font-mono min-h-screen flex flex-col relative overflow-hidden">
      {/* Matrix digital rain canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
      />

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Circuit board patterns */}
        <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>

        {/* Floating glowing elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500 blur-3xl opacity-10 animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-blue-500 blur-3xl opacity-5 animate-pulse-slow"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/3 w-36 h-36 rounded-full bg-purple-500 blur-3xl opacity-5 animate-pulse-slow"
          style={{ animationDelay: "6s" }}
        ></div>

        {/* Grid lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      {/* Navigation bar - Only visible when expanded */}
      <nav
        className={`bg-black bg-opacity-80 backdrop-blur-sm border-b border-green-900/50 transition-all duration-500 ease-in-out z-20 ${
          isExpanded
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full h-0"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="p-1 rounded-md hover:bg-green-950/30 transition-colors text-green-500">
              <Menu size={18} />
            </button>
            <div className="flex items-center">
              <Power size={16} className="mr-2 text-green-500" />
              <h1 className="font-bold truncate max-w-xs animate-pulse-subtle">
                {chatName}
              </h1>
            </div>
          </div>

          <div className="flex items-center">
            {selectedPill && (
              <div
                onClick={() => setShowPillModal(true)}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 cursor-pointer backdrop-blur-sm
                  ${
                    selectedPill === "green"
                      ? "bg-green-950/40 text-green-400 border border-green-700/70"
                      : selectedPill === "blue"
                      ? "bg-blue-950/40 text-blue-400 border border-blue-700/70"
                      : "bg-red-950/40 text-red-400 border border-red-700/70"
                  }`}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    selectedPill === "green"
                      ? "bg-green-400 animate-pulse"
                      : selectedPill === "blue"
                      ? "bg-blue-400 animate-pulse"
                      : "bg-red-400 animate-pulse"
                  }`}
                ></span>
                <span>
                  {selectedPill.charAt(0).toUpperCase() + selectedPill.slice(1)}{" "}
                  Pill
                </span>
                <ChevronDown size={14} />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main className="flex-grow flex flex-col relative z-10 transition-all duration-500">
        {messages.length === 0 && !isExpanded ? (
          <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
            <div className="mb-8 relative">
              <div className="relative">
                <Terminal size={80} className="text-green-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={36} className="text-green-400 animate-pulse" />
                </div>
                <div className="absolute -inset-4 rounded-full border-2 border-green-500/30 animate-spin-slow"></div>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2 text-green-400 glitch-text text-center">
              CodeMentor AI
            </h1>
            <p className="text-gray-400 mb-8 text-center max-w-md hackertype-text">
              Select your guidance level and input your coding challenge to
              begin.
            </p>

            {/* Initial compact UI */}
            <div className="w-full max-w-xl transition-all duration-500 ease-in-out">
              {pillSelectVisible && (
                <div className="mb-10 animate-fadein">
                  <h2 className="text-center text-green-500 mb-6 text-sm uppercase tracking-wider glow-text">
                    Choose Your Path
                  </h2>
                  <div className="flex justify-center gap-6 perspective">
                    <CyberpunkPillButton
                      color="green"
                      icon={<Shield size={20} />}
                      label="Green Pill"
                      description="Detailed guidance for beginners"
                      isSelected={selectedPill === "green"}
                      onClick={() => handlePillSelect("green")}
                    />
                    <CyberpunkPillButton
                      color="blue"
                      icon={<Code size={20} />}
                      label="Blue Pill"
                      description="Balanced hints for intermediates"
                      isSelected={selectedPill === "blue"}
                      onClick={() => handlePillSelect("blue")}
                    />
                    <CyberpunkPillButton
                      color="red"
                      icon={<Zap size={20} />}
                      label="Red Pill"
                      description="Minimal guidance for pros"
                      isSelected={selectedPill === "red"}
                      onClick={() => handlePillSelect("red")}
                    />
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="relative animate-slide-up"
              >
                <div className="bg-black/70 backdrop-blur-sm border border-green-900/50 rounded-lg overflow-hidden">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Describe your coding problem or paste your code..."
                    className="w-full bg-transparent p-4 pr-12 text-green-300 resize-none transition-all duration-300 focus:outline-none"
                    rows={isExpanded ? 3 : 2}
                    disabled={!selectedPill}
                  />
                  <div className="border-t border-green-900/30 p-2 flex justify-between items-center">
                    <div className="text-xs text-green-600 pl-2">
                      {selectedPill
                        ? `${
                            selectedPill.charAt(0).toUpperCase() +
                            selectedPill.slice(1)
                          } Pill Mode Active`
                        : "Select a pill to begin"}
                    </div>
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || !selectedPill}
                      className={`p-2 rounded-md transition-colors ${
                        !inputValue.trim() || !selectedPill
                          ? "text-green-900"
                          : "text-green-400 hover:bg-green-950"
                      }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                {!selectedPill && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
                    <p className="text-green-500 text-sm animate-pulse">
                      Select a pill to begin your journey
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col">
            {/* Messages container */}
            <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black px-4 py-4 space-y-6">
              {messages.map((message, index) => (
                <MessageComponent key={index} message={message} index={index} />
              ))}

              {isLoading && <ThinkingAnimation selectedPill={selectedPill} />}

              <div ref={endOfMessagesRef} />
            </div>

            {/* Input area when expanded */}
            <div className="p-4 border-t border-green-900/30 bg-black/70 backdrop-blur-sm">
              <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto relative"
              >
                <div className="bg-black/50 border border-green-900/50 rounded-lg overflow-hidden">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Continue your conversation..."
                    className="w-full bg-transparent p-4 pr-12 text-green-300 resize-none transition-all duration-300 focus:outline-none"
                    rows={3}
                  />
                  <div className="border-t border-green-900/30 p-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={`p-2 rounded-md transition-colors ${
                        !inputValue.trim()
                          ? "text-green-900"
                          : "text-green-400 hover:bg-green-950"
                      }`}
                    >
                      <Send
                        size={18}
                        className={
                          !inputValue.trim() ? "" : "animate-pulse-subtle"
                        }
                      />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Pill selection modal */}
      {showPillModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadein">
          <div className="bg-black border border-green-800 rounded-lg max-w-md w-full p-6 relative animate-scale-in">
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-green-500"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-green-500"></div>

            <button
              onClick={() => setShowPillModal(false)}
              className="absolute top-4 right-4 text-green-500 hover:text-green-300 transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold mb-6 text-green-400 glow-text">
              Recalibrate Guidance Parameters
            </h2>

            <div className="space-y-4">
              <CyberpunkPillOption
                color="green"
                icon={<Shield size={18} />}
                title="Green Pill"
                description="Detailed guidance with step-by-step explanations. Best for beginners or complex problems."
                isSelected={selectedPill === "green"}
                onClick={() => {
                  setSelectedPill("green");
                  setShowPillModal(false);
                }}
              />

              <CyberpunkPillOption
                color="blue"
                icon={<Code size={18} />}
                title="Blue Pill"
                description="Balanced guidance with helpful hints but room for self-discovery. For intermediate coders."
                isSelected={selectedPill === "blue"}
                onClick={() => {
                  setSelectedPill("blue");
                  setShowPillModal(false);
                }}
              />

              <CyberpunkPillOption
                color="red"
                icon={<Zap size={18} />}
                title="Red Pill"
                description="Minimal guidance focusing on concepts and challenges. For advanced coders seeking to test themselves."
                isSelected={selectedPill === "red"}
                onClick={() => {
                  setSelectedPill("red");
                  setShowPillModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Message Component (continued)
const MessageComponent = ({
  message,
  index,
}: {
  message: {
    type: "user" | "ai";
    content: string;
    pill?: "green" | "blue" | "red" | null;
  };
  index: number;
}) => {
  return (
    <div
      className={`max-w-3xl mx-auto ${
        message.type === "user" ? "ml-auto mr-0" : "ml-0 mr-auto"
      } animate-message-appear perspective`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={`rounded-lg relative ${
          message.type === "user"
            ? "bg-gray-900/80 border border-gray-800 text-white backdrop-blur-sm ml-12 transform hover:scale-102 transition-transform"
            : message.pill === "green"
            ? "bg-green-950/20 border border-green-800/50 text-green-100 backdrop-blur-sm hover:border-green-700 transition-colors"
            : message.pill === "blue"
            ? "bg-blue-950/20 border border-blue-800/50 text-blue-100 backdrop-blur-sm hover:border-blue-700 transition-colors"
            : "bg-red-950/20 border border-red-800/50 text-red-100 backdrop-blur-sm hover:border-red-700 transition-colors"
        }`}
      >
        {/* Corner decorations for AI messages */}
        {message.type === "ai" && (
          <>
            <div
              className={`absolute -top-1 -left-1 w-2 h-2 ${
                message.pill === "green"
                  ? "bg-green-500"
                  : message.pill === "blue"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            ></div>
            <div
              className={`absolute -bottom-1 -right-1 w-2 h-2 ${
                message.pill === "green"
                  ? "bg-green-500"
                  : message.pill === "blue"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            ></div>
          </>
        )}

        <div className="p-4">
          {message.type === "user" ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert max-w-none prose-pre:bg-black/70 prose-pre:text-sm">
              {formatMarkdown(message.content)}
            </div>
          )}
        </div>

        {/* Message border glow effect */}
        {message.type === "ai" && message.pill && (
          <div
            className={`absolute inset-0 rounded-lg ${
              message.pill === "green"
                ? "glow-border-green"
                : message.pill === "blue"
                ? "glow-border-blue"
                : "glow-border-red"
            } opacity-0 group-hover:opacity-100 transition-opacity`}
          ></div>
        )}
      </div>

      <div
        className={`flex items-center mt-1 text-xs ${
          message.type === "user"
            ? "justify-end text-gray-500"
            : "justify-start"
        }`}
      >
        {message.type === "ai" && message.pill && (
          <div
            className={`inline-flex items-center space-x-1 ${
              message.pill === "green"
                ? "text-green-500"
                : message.pill === "blue"
                ? "text-blue-500"
                : "text-red-500"
            }`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${
                message.pill === "green"
                  ? "bg-green-500"
                  : message.pill === "blue"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            ></span>
            <span>
              {message.pill.charAt(0).toUpperCase() + message.pill.slice(1)}{" "}
              Pill Guidance
            </span>
          </div>
        )}

        {message.type === "user" && <span>You</span>}
      </div>
    </div>
  );
};

// Thinking Animation Component
const ThinkingAnimation = ({ selectedPill }: { selectedPill: PillLevel }) => {
  return (
    <div className="max-w-3xl mx-auto ml-0 mr-auto">
      <div
        className={`rounded-lg relative p-4 ${
          selectedPill === "green"
            ? "bg-green-950/10 border border-green-800/30"
            : selectedPill === "blue"
            ? "bg-blue-950/10 border border-blue-800/30"
            : "bg-red-950/10 border border-red-800/30"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`h-2 w-2 rounded-full animate-pulse ${
              selectedPill === "green"
                ? "bg-green-500"
                : selectedPill === "blue"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          ></div>
          <div
            className={`h-2 w-2 rounded-full animate-pulse ${
              selectedPill === "green"
                ? "bg-green-500"
                : selectedPill === "blue"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className={`h-2 w-2 rounded-full animate-pulse ${
              selectedPill === "green"
                ? "bg-green-500"
                : selectedPill === "blue"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
      <div className="mt-1 text-xs">
        <div
          className={`inline-flex items-center space-x-1 ${
            selectedPill === "green"
              ? "text-green-500"
              : selectedPill === "blue"
              ? "text-blue-500"
              : "text-red-500"
          }`}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${
              selectedPill === "green"
                ? "bg-green-500"
                : selectedPill === "blue"
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
          ></span>
          <span>Processing your request...</span>
        </div>
      </div>
    </div>
  );
};

// Cyberpunk Pill Button Component
const CyberpunkPillButton = ({
  color,
  icon,
  label,
  description,
  isSelected,
  onClick,
}: {
  color: "green" | "blue" | "red";
  icon: React.ReactNode;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`pill-card relative w-32 p-4 cursor-pointer transition-transform duration-300 transform ${
        isSelected ? "scale-105" : "hover:scale-105"
      } perspective-child`}
    >
      <div
        className={`absolute inset-0 rounded-lg ${
          isSelected ? "pill-selected" : ""
        } 
          ${
            color === "green"
              ? "pill-green"
              : color === "blue"
              ? "pill-blue"
              : "pill-red"
          }`}
      ></div>

      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`p-3 rounded-full mb-3 ${
            color === "green"
              ? "bg-green-900/50 text-green-400"
              : color === "blue"
              ? "bg-blue-900/50 text-blue-400"
              : "bg-red-900/50 text-red-400"
          }`}
        >
          {icon}
        </div>

        <h3
          className={`text-sm font-bold mb-1 ${
            color === "green"
              ? "text-green-400"
              : color === "blue"
              ? "text-blue-400"
              : "text-red-400"
          }`}
        >
          {label}
        </h3>

        <p className="text-gray-400 text-xs text-center">{description}</p>
      </div>

      {/* Pill capsule shape */}
      <div
        className={`pill-shape absolute w-6 h-12 rounded-full rotate-12 ${
          color === "green"
            ? "bg-green-400/20"
            : color === "blue"
            ? "bg-blue-400/20"
            : "bg-red-400/20"
        }`}
      ></div>

      {/* Pill glow effect */}
      <div
        className={`absolute inset-0 rounded-lg ${
          color === "green"
            ? "glow-green"
            : color === "blue"
            ? "glow-blue"
            : "glow-red"
        } opacity-0 transition-opacity duration-300 ${
          isSelected ? "opacity-100" : "group-hover:opacity-50"
        }`}
      ></div>
    </div>
  );
};

// Cyberpunk Pill Option Component for modal
const CyberpunkPillOption = ({
  color,
  icon,
  title,
  description,
  isSelected,
  onClick,
}: {
  color: "green" | "blue" | "red";
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-4 flex items-center border cursor-pointer transition-all ${
        isSelected
          ? `bg-${color}-950/30 border-${color}-700 rounded-lg`
          : `bg-black border-green-900 rounded-md hover:bg-${color}-950/20 hover:border-${color}-800/50`
      }`}
    >
      <div
        className={`p-2 rounded-full mr-4 ${
          color === "green"
            ? "bg-green-900/50 text-green-400"
            : color === "blue"
            ? "bg-blue-900/50 text-blue-400"
            : "bg-red-900/50 text-red-400"
        }`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <h3
          className={`text-sm font-bold mb-1 ${
            color === "green"
              ? "text-green-400"
              : color === "blue"
              ? "text-blue-400"
              : "text-red-400"
          }`}
        >
          {title}
        </h3>

        <p className="text-gray-400 text-xs">{description}</p>
      </div>

      {isSelected && (
        <div
          className={`h-2 w-2 rounded-full animate-pulse ${
            color === "green"
              ? "bg-green-500"
              : color === "blue"
              ? "bg-blue-500"
              : "bg-red-500"
          }`}
        ></div>
      )}
    </div>
  );
};

// Markdown formatter function
const formatMarkdown = (text: string) => {
  // This is a simplified implementation - in a real app you would use a markdown library
  // Replace code blocks with syntax highlighting
  const withCodeBlocks = text.replace(
    /```(.+?)\n([\s\S]*?)```/g,
    (match, language, code) => {
      return `<div class="bg-black/70 rounded-md p-4 my-4 overflow-x-auto">
        <pre><code class="language-${language}">${code}</code></pre>
      </div>`;
    }
  );

  // Replace headers
  const withHeaders = withCodeBlocks
    .replace(
      /## (.*?)\n/g,
      '<h2 class="text-xl font-bold my-4 text-green-300">$1</h2>'
    )
    .replace(
      /### (.*?)\n/g,
      '<h3 class="text-lg font-bold my-3 text-green-300">$1</h3>'
    )
    .replace(
      /#### (.*?)\n/g,
      '<h4 class="text-base font-bold my-2 text-green-300">$1</h4>'
    );

  // Replace list items
  const withLists = withHeaders.replace(
    /- (.*?)(\n|$)/g,
    '<li class="ml-6 list-disc my-1">$1</li>'
  );

  // Replace line breaks
  const withLineBreaks = withLists.replace(/\n\n/g, '<div class="my-4"></div>');

  return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
};

export default Index;

// Add these CSS classes to your global styles
/*
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.2; }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  
  @keyframes pulse-subtle {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  
  @keyframes message-appear {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scale-in {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
  
  .animate-spin-slow {
    animation: spin-slow 10s linear infinite;
  }
  
  .animate-typewriter {
    overflow: hidden;
    white-space: nowrap;
    animation: typewriter 3s steps(40, end);
  }
  
  .animate-pulse-subtle {
    animation: pulse-subtle 2s ease-in-out infinite;
  }
  
  .animate-message-appear {
    animation: message-appear 0.3s ease-out forwards;
  }
  
  .animate-fadein {
    animation: fadein 0.5s ease-out forwards;
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out forwards;
  }
  
  .animate-slide-up {
    animation: slide-up 0.5s ease-out forwards;
  }
  
  .perspective {
    perspective: 1000px;
  }
  
  .perspective-child {
    transform-style: preserve-3d;
  }
  
  .pill-green {
    background: linear-gradient(135deg, rgba(0, 50, 0, 0.8), rgba(0, 20, 0, 0.9));
    border: 1px solid rgba(0, 255, 0, 0.3);
  }
  
  .pill-blue {
    background: linear-gradient(135deg, rgba(0, 0, 50, 0.8), rgba(0, 0, 20, 0.9));
    border: 1px solid rgba(0, 0, 255, 0.3);
  }
  
  .pill-red {
    background: linear-gradient(135deg, rgba(50, 0, 0, 0.8), rgba(20, 0, 0, 0.9));
    border: 1px solid rgba(255, 0, 0, 0.3);
  }
  
  .pill-selected {
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  }
  
  .pill-shape {
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }
  
  .glow-green {
    box-shadow: 0 0 15px 5px rgba(0, 255, 0, 0.3);
  }
  
  .glow-blue {
    box-shadow: 0 0 15px 5px rgba(0, 0, 255, 0.3);
  }
  
  .glow-red {
    box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.3);
  }
  
  .glow-border-green {
    box-shadow: 0 0 8px 2px rgba(0, 255, 0, 0.3);
  }
  
  .glow-border-blue {
    box-shadow: 0 0 8px 2px rgba(0, 0, 255, 0.3);
  }
  
  .glow-border-red {
    box-shadow: 0 0 8px 2px rgba(255, 0, 0, 0.3);
  }
  
  .glow-text {
    text-shadow: 0 0 8px rgba(0, 255, 0, 0.7);
  }
  
  .glitch-text {
    position: relative;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);
  }
  
  .glitch-text::before,
  .glitch-text::after {
    content: "CodeMentor AI";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .glitch-text::before {
    left: 2px;
    text-shadow: -1px 0 rgba(255, 0, 0, 0.7);
    animation: glitch-animation 0.8s infinite ease-in-out alternate-reverse;
  }
  
  .glitch-text::after {
    left: -2px;
    text-shadow: 2px 0 rgba(0, 0, 255, 0.7);
    animation: glitch-animation 0.5s infinite ease-in-out alternate-reverse;
  }
  
  @keyframes glitch-animation {
    0% {
      clip-path: inset(45% 0 56% 0);
    }
    20% {
      clip-path: inset(66% 0 33% 0);
    }
    40% {
      clip-path: inset(24% 0 77% 0);
    }
    60% {
      clip-path: inset(91% 0 8% 0);
    }
    80% {
      clip-path: inset(3% 0 98% 0);
    }
    100% {
      clip-path: inset(52% 0 45% 0);
    }
  }
  
  .hackertype-text {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid rgba(0, 255, 0, 0.7);
    width: 100%;
    animation: typing 3.5s steps(40, end), blink 0.75s step-end infinite;
  }
  
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }
  
  @keyframes blink {
    from, to { border-color: transparent }
    50% { border-color: rgba(0, 255, 0, 0.7) }
  }
  
  .bg-circuit-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%2300ff41' fill-opacity='0.1' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' mask='url(%23mask)' filter='url(%23filter)'/%3E%3C/svg%3E");
  }
  
  .bg-grid-pattern {
    background-size: 50px 50px;
    background-image: 
      linear-gradient(to right, rgba(0, 255, 65, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 255, 65, 0.05) 1px, transparent 1px);
  }
  
  .transform.hover\:scale-102:hover {
    transform: scale(1.02);
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  
  .scrollbar-thumb-green-900::-webkit-scrollbar-thumb {
    background-color: #064e3b;
    border-radius: 3px;
  }
  
  .scrollbar-track-black::-webkit-scrollbar-track {
    background-color: #000;
  }
  */
