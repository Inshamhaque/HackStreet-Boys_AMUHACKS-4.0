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
    if (!localStorage.getItem("usertoken")) {
      window.location.href = "/";
    }
    setapitoken(localStorage.getItem("usertoken") || "");
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);

      fetchConversations();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (inputValue.length > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  }, [inputValue]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get("/conversations");
      setConversations(response.data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setError("Failed to load conversations. Please try again.");
    }
  };

  const fetchConversation = async (conversationId: number) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/conversations/${conversationId}/`
      );
      const convo = response.data;

      setCurrentConversationId(conversationId);
      setChatName(convo.title);
      setSelectedPill(convo.pill_mode);

      if (convo.messages && convo.messages.length > 0) {
        const formattedMessages: Message[] = [];

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

  const sendMessage = async (conversationId: number, content: string) => {
    if (!content.trim() || !conversationId) return;

    const userMessageExists = messages.some(
      (m) => m.type === "user" && m.content === content
    );

    if (!userMessageExists) {
      setMessages((prev) => [...prev, { type: "user", content }]);
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        `/conversations/${conversationId}/send_message/`,
        {
          content,
        }
      );

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

    const codeMessageExists = messages.some(
      (m) => m.type === "user" && m.content === code
    );

    if (!codeMessageExists) {
      setMessages((prev) => [...prev, { type: "user", content: code }]);
    }

    setIsLoading(true);

    try {
      const requestData: any = {
        code,
        language,
        pill_mode: pillMode,
      };

      if (conversationId) {
        requestData.conversation_id = conversationId;
      }

      const response = await axiosInstance.post(
        "/conversations/analyze_code/",
        requestData
      );

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

  const handlePillSelect = (pill: PillLevel) => {
    setSelectedPill(pill);

    if (!currentConversationId && pill) {
      const defaultTitle = {
        green: "Beginner Session",
        blue: "Intermediate Journey",
        red: "Advanced Challenge",
      }[pill];

      setChatName(defaultTitle);

      const systemMessages = {
        green:
          "SorcAI will provide detailed guidance with step-by-step explanations.",
        blue: "SorcAI will provide balanced hints while challenging you to grow.",
        red: "SorcAI will provide minimal guidance, focusing on concepts and pushing your boundaries.",
      };

      setMessages([
        {
          type: "ai",
          content: systemMessages[pill as keyof typeof systemMessages],
          pill: pill,
        },
      ]);
    }

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !selectedPill) return;

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

    setInputValue("");

    setIsLoading(true);

    try {
      if (!currentConversationId) {
        console.log("Creating new conversation...");

        const newTitle =
          currentMessage.length > 25
            ? currentMessage.substring(0, 22) + "..."
            : currentMessage;

        const response = await axiosInstance.post("/conversations/", {
          title: newTitle,
          pill_mode: selectedPill,
        });

        if (!response.data || typeof response.data.id !== "number") {
          throw new Error(
            "Failed to get a valid conversation ID from API response"
          );
        }

        const newConvoId = response.data.id;
        console.log("New conversation created with ID:", newConvoId);

        setCurrentConversationId(newConvoId);
        setChatName(newTitle);

        if (isCodeSubmission) {
          let language = detectCodeLanguage(currentMessage);

          await analyzeCode(currentMessage, language, selectedPill, newConvoId);
        } else {
          await sendMessage(newConvoId, currentMessage);
        }

        await fetchConversations();
      } else {
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

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setSelectedPill(null);
    setChatName("New Chat");
    setMessages([]);
    setInputValue("");
    setIsExpanded(false);

    if (isMobile) {
      setCloseSideBar(true);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    }
  };

  if (!isLoaded) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-gray-100 overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div
        className={`
          w-64 sm:relative fixed top-0 left-0 z-20 h-full
          bg-[#1a1b1f] border-r border-gray-800 flex flex-col
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
        <div className="sticky top-0 z-10 bg-[#1e1e1e] border-b border-gray-800">
          <div className="flex items-center p-4 w-full">
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
              CloseSidebar={closedSidebar}
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
                <div className="flex-shrink-0 p-6 pt-6 border-t border-gray-800 ">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl mx-auto"
                  >
                    <div className="bg-[#2c2c2c] border border-gray-700 rounded-lg overflow-hidden">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask your coding question... (Enter to send, Shift+Enter for new line)"
                        className="w-full bg-transparent p-8 text-gray-100 resize-none focus:outline-none"
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
                    "SocrAI will provide detailed guidance with step-by-step explanations.",
                  blue: "SocrAI will provide balanced hints while challenging you to grow.",
                  red: "SocrAI will provide minimal guidance, focusing on concepts and pushing your boundaries.",
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
