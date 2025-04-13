import React, { useState, useEffect, useRef } from "react";
import { Send, Plus, ChevronLeft, PlusCircle } from "lucide-react";
import axios from "axios";

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

type Conversation = {
  id: number;
  title: string;
  pill_mode: PillLevel;
  created_at: string;
  updated_at: string;
};
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api`;

const Chat = () => {
  const [API_TOKEN, setapitoken] = useState(
    localStorage.getItem("usertoken") || ""
  );
  const [selectedPill, setSelectedPill] = useState<PillLevel>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatName, setChatName] = useState<string>("New Chat");
  const [showPillModal, setShowPillModal] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [closedSidebar, setCloseSideBar] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Token ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  useEffect(() => {
    setapitoken(localStorage.getItem("usertoken") || "");
  }, []);

  // Check if mobile on initial load
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Fetch conversations on initial load
      fetchConversations();
    }, 1000);

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

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get("/conversations");
      setConversations(response.data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setError("Failed to load conversations. Please try again.");
    }
  };

  // Fetch a single conversation and its messages
  const fetchConversation = async (conversationId: number) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/conversations/${conversationId}/`
      );
      const convo = response.data;

      // Update current conversation
      setCurrentConversationId(conversationId);
      setChatName(convo.title);
      setSelectedPill(convo.pill_mode);

      // Format messages
      if (convo.messages && convo.messages.length > 0) {
        const formattedMessages: Message[] = [];

        // Process message pairs
        for (let i = 0; i < convo.messages.length; i += 2) {
          const userMsg = convo.messages[i];

          if (userMsg) {
            formattedMessages.push({
              type: "user",
              content: userMsg.content,
            });
          }

          const aiMsg = convo.messages[i + 1];

          if (aiMsg) {
            formattedMessages.push({
              type: "ai",
              content: aiMsg.content,
              pill: convo.pill_mode,
            });
          }
        }

        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }

      // On mobile, hide sidebar after selection
      if (isMobile) {
        setShowSidebar(false);
      }
    } catch (error) {
      console.error(`Failed to fetch conversation ${conversationId}:`, error);
      setError("Failed to load conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new conversation
  const createConversation = async (
    title: string,
    pillMode: PillLevel,
    initialMessage?: string
  ) => {
    if (!pillMode) return null;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/conversations/", {
        title,
        pill_mode: pillMode,
      });

      const newConversation = response.data;

      // Ensure the API provided a valid ID
      if (!newConversation || !newConversation.id) {
        throw new Error("Failed to get a valid conversation ID from the API");
      }

      // Update conversations list
      await fetchConversations();

      // Set current conversation
      setCurrentConversationId(newConversation.id);
      setChatName(newConversation.title);

      // Add initial system message
      const systemMessages = {
        green:
          "CodeMentor will provide detailed guidance with step-by-step explanations.",
        blue: "CodeMentor will provide balanced hints while challenging you to grow.",
        red: "CodeMentor will provide minimal guidance, focusing on concepts and pushing your boundaries.",
      };

      const initialMessages: Message[] = [
        {
          type: "ai",
          content: systemMessages[pillMode as keyof typeof systemMessages],
          pill: pillMode,
        },
      ];

      // Add user message if provided
      if (initialMessage) {
        initialMessages.push({
          type: "user",
          content: initialMessage,
        });
      }

      setMessages(initialMessages);

      // On mobile, hide sidebar after creation
      if (isMobile) {
        setShowSidebar(false);
      }

      return newConversation.id;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setError("Failed to create new conversation. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message to a conversation
  const sendMessage = async (conversationId: number, content: string) => {
    if (!content.trim() || !conversationId) return;

    // Add user message to UI immediately - only if it doesn't already exist
    const userMessageExists = messages.some(
      (m) => m.type === "user" && m.content === content
    );

    if (!userMessageExists) {
      setMessages((prev) => [...prev, { type: "user", content }]);
    }

    // Show loading
    setIsLoading(true);

    try {
      // Send message to API
      const response = await axiosInstance.post(
        `/conversations/${conversationId}/send_message/`,
        {
          content,
        }
      );

      // Add AI response to UI
      if (response.data && response.data.ai_message) {
        // Use the correct response format
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: response.data.ai_message.content,
            pill: selectedPill,
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message. Please try again.");
      // Show error in UI
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          pill: selectedPill,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze code
  const analyzeCode = async (
    code: string,
    language: string,
    pillMode: PillLevel,
    conversationId?: number
  ) => {
    if (!code.trim() || !pillMode) return;

    // Check if this code is already in the messages
    const codeMessageExists = messages.some(
      (m) => m.type === "user" && m.content === code
    );

    // Add user message to UI only if it doesn't already exist
    if (!codeMessageExists) {
      setMessages((prev) => [...prev, { type: "user", content: code }]);
    }

    // Show loading
    setIsLoading(true);

    try {
      const requestData: any = {
        code,
        language,
        pill_mode: pillMode,
      };

      // Only add conversation_id if it's provided and valid
      if (conversationId) {
        requestData.conversation_id = conversationId;
      }

      const response = await axiosInstance.post(
        "/conversations/analyze_code/",
        requestData
      );

      // Add AI response to UI
      if (response.data && response.data.analysis) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: response.data.analysis,
            pill: pillMode,
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to analyze code:", error);
      setError("Failed to analyze code. Please try again.");
      // Show error in UI
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            "Sorry, there was an error analyzing your code. Please try again.",
          pill: pillMode,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pill selection for new conversations
  const handlePillSelect = (pill: PillLevel) => {
    setSelectedPill(pill);

    // If starting a new conversation
    if (!currentConversationId && pill) {
      const defaultTitle = {
        green: "Beginner Session",
        blue: "Intermediate Journey",
        red: "Advanced Challenge",
      }[pill];

      setChatName(defaultTitle);

      // Add initial system message
      const systemMessages = {
        green:
          "CodeMentor will provide detailed guidance with step-by-step explanations.",
        blue: "CodeMentor will provide balanced hints while challenging you to grow.",
        red: "CodeMentor will provide minimal guidance, focusing on concepts and pushing your boundaries.",
      };

      setMessages([
        {
          type: "ai",
          content: systemMessages[pill as keyof typeof systemMessages],
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

  // Handle form submission - Fixed version
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !selectedPill) return;

    // Check if code analysis is needed (simple heuristic)
    const isCodeSubmission =
      inputValue.includes("{") &&
      inputValue.includes("}") &&
      (inputValue.includes("function") ||
        inputValue.includes("class") ||
        inputValue.includes("def") ||
        inputValue.includes("var") ||
        inputValue.includes("let") ||
        inputValue.includes("const"));

    const currentMessage = inputValue;
    // Clear input right away to prevent double-submission
    setInputValue("");

    // Add user message to UI immediately for better UX
    // setMessages((prev) => [...prev, { type: "user", content: currentMessage }]);

    // Show loading state
    setIsLoading(true);

    try {
      if (!currentConversationId) {
        // CASE 1: Create a new conversation first
        console.log("Creating new conversation...");

        const newTitle =
          currentMessage.length > 25
            ? currentMessage.substring(0, 22) + "..."
            : currentMessage;

        // Create a new conversation with proper error handling
        const response = await axiosInstance.post("/conversations/", {
          title: newTitle,
          pill_mode: selectedPill,
        });

        // Verify we have a valid response and ID
        if (!response.data || typeof response.data.id !== "number") {
          throw new Error(
            "Failed to get a valid conversation ID from API response"
          );
        }

        const newConvoId = response.data.id;
        console.log("New conversation created with ID:", newConvoId);

        // Update state with the new conversation ID
        setCurrentConversationId(newConvoId);
        setChatName(newTitle);

        // Now handle the user's message based on whether it's code or regular text
        if (isCodeSubmission) {
          // For code submissions
          let language = detectCodeLanguage(currentMessage);

          // Use the conversation ID we just created
          await analyzeCode(currentMessage, language, selectedPill, newConvoId);
        } else {
          // For regular messages, send to the new conversation
          await sendMessage(newConvoId, currentMessage);
        }

        // Update conversations list
        await fetchConversations();
      } else {
        // CASE 2: Using an existing conversation
        console.log("Using existing conversation ID:", currentConversationId);

        if (isCodeSubmission) {
          let language = detectCodeLanguage(currentMessage);
          await analyzeCode(
            currentMessage,
            language,
            selectedPill,
            currentConversationId
          );
        } else {
          await sendMessage(currentConversationId, currentMessage);
        }
      }
    } catch (error: any) {
      console.error("Error in conversation workflow:", error);
      setError(
        error.message || "Failed to process your message. Please try again."
      );

      // Add error message to UI
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          pill: selectedPill,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to detect code language
  const detectCodeLanguage = (code: string): string => {
    if (code.includes("def ") || code.includes("import ")) {
      return "Python";
    } else if (
      code.includes("function") ||
      code.includes("const ") ||
      code.includes("let ")
    ) {
      return "JavaScript";
    } else if (code.includes("public class") || code.includes("void main")) {
      return "Java";
    } else {
      return "Unknown";
    }
  };

  // Start a new chat
  const handleNewChat = () => {
    setCurrentConversationId(null);
    setSelectedPill(null);
    setChatName("New Chat");
    setMessages([]);
    setInputValue("");
    setIsExpanded(false);

    // On mobile, hide sidebar after creating new chat
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Handle key press in textarea for Enter and Shift+Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
      }
      // If Shift+Enter, do nothing (default behavior creates new line)
    }
  };

  // If not loaded yet, show loading animation
  if (!isLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div
        className={`
          w-64 sm:relative fixed top-0 left-0 z-20 h-full
          bg-gray-950 border-r border-gray-800 flex flex-col
          transition-all duration-300 ease-in-out
          ${!closedSidebar ? "flex" : "hidden sm:hidden"}
        `}
      >
        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg border border-gray-700 text-sm font-medium text-white"
          >
            <PlusCircle size={18} />
            <span className="font-semibold">
              Choose a Pill and Start New Chat
            </span>
          </button>
        </div>

        {/* Recent Conversations Label */}
        <div className="px-3 pt-3 pb-1">
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Recent conversations
          </h3>
        </div>

        {/* Conversations List */}
        <div className="flex-grow overflow-y-auto px-2">
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => fetchConversation(convo.id)}
              className={`flex items-center py-3 px-3 rounded-lg cursor-pointer hover:bg-gray-800 my-1 text-sm truncate transition-colors duration-150 ${
                currentConversationId === convo.id
                  ? convo.pill_mode === "green"
                    ? "bg-green-900/30 text-white"
                    : convo.pill_mode === "blue"
                    ? "bg-blue-900/30 text-white"
                    : "bg-red-900/30 text-white"
                  : "text-gray-300"
              }`}
            >
              <div className="flex-grow truncate">{convo.title}</div>
              <div
                className={`w-2 h-2 rounded-full ml-2 flex-shrink-0 ${
                  convo.pill_mode === "green"
                    ? "bg-green-500"
                    : convo.pill_mode === "blue"
                    ? "bg-blue-500"
                    : "bg-red-500"
                }`}
              ></div>
            </div>
          ))}

          {conversations.length === 0 && (
            <div className="text-center text-gray-500 p-4 text-sm">
              No conversations yet
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Error notification */}
        {error && (
          <div className="bg-red-900 text-white p-2 text-center">{error}</div>
        )}

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center p-4">
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="mr-3 p-1 hover:bg-gray-800 rounded-full"
              >
                {showSidebar ? <ChevronLeft size={18} /> : <Plus size={18} />}
              </button>
            )}
            <Header
              chatName={chatName}
              selectedPill={selectedPill}
              onPillClick={() => setShowPillModal(true)}
              setCloseSideBar={setCloseSideBar}
            />
          </div>
        </div>

        {/* Main chat content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedPill ? (
            <div className="flex flex-col h-full">
              {/* Messages container */}
              <div className="flex-grow overflow-hidden flex flex-col max-w-4xl mx-auto px-4 py-4 w-full">
                <div className="flex-grow overflow-y-auto max-w-4xl w-full">
                  <MessageList
                    messages={messages}
                    isLoading={isLoading}
                    selectedPill={selectedPill}
                  />
                  <div ref={endOfMessagesRef} />
                </div>

                {/* Input area - fixed at bottom */}
                <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl mx-auto"
                  >
                    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask your coding question... (Enter to send, Shift+Enter for new line)"
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
            <div className="flex flex-col items-center justify-center flex-grow px-4 py-12 overflow-y-auto">
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
              <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
                <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Describe your coding problem or paste your code... (Enter to send, Shift+Enter for new line)"
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

              // If changing pill on existing conversation (this would require a backend API)
              if (currentConversationId && pill) {
                // Add system message based on new pill
                const systemMessages = {
                  green:
                    "CodeMentor will provide detailed guidance with step-by-step explanations.",
                  blue: "CodeMentor will provide balanced hints while challenging you to grow.",
                  red: "CodeMentor will provide minimal guidance, focusing on concepts and pushing your boundaries.",
                };

                setMessages([
                  {
                    type: "ai",
                    content:
                      systemMessages[pill as keyof typeof systemMessages],
                    pill: pill,
                  },
                ]);
              }
            }}
            onClose={() => setShowPillModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
