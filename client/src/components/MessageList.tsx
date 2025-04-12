import React, { useRef, useEffect } from "react";
import { Message, PillLevel } from "../pages/Chat";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  selectedPill: PillLevel;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  selectedPill,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {messages.map((message, index) => (
        <MessageComponent key={index} message={message} />
      ))}

      {/* Loading animation */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="flex space-x-2">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                selectedPill === "green"
                  ? "bg-green-500"
                  : selectedPill === "blue"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full animate-pulse delay-150 ${
                selectedPill === "green"
                  ? "bg-green-500"
                  : selectedPill === "blue"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full animate-pulse delay-300 ${
                selectedPill === "green"
                  ? "bg-green-500"
                  : selectedPill === "blue"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

interface MessageComponentProps {
  message: Message;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  const pillColors = {
    green: "border-green-700 bg-green-900/10",
    blue: "border-blue-700 bg-blue-900/10",
    red: "border-red-700 bg-red-900/10",
  };

  return (
    <div
      className={`max-w-3xl mx-auto p-4 ${
        message.type === "user" ? "ml-auto mr-0" : "ml-0 mr-auto"
      }`}
    >
      <div
        className={`rounded-lg ${
          message.type === "user"
            ? "bg-gray-800 border border-gray-700 text-white ml-12"
            : message.pill && pillColors[message.pill]
            ? `border ${pillColors[message.pill]}`
            : "bg-gray-800 border border-gray-700 text-white"
        }`}
      >
        <div className="p-4">
          {message.type === "user" ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose prose-invert max-w-none prose-pre:bg-gray-950">
              {message.content}
            </div>
          )}
        </div>
      </div>
      {message.type === "ai" && message.pill && (
        <div
          className={`mt-1 text-xs ${
            message.pill === "green"
              ? "text-green-500"
              : message.pill === "blue"
              ? "text-blue-500"
              : "text-red-500"
          }`}
        >
          {message.pill.charAt(0).toUpperCase() + message.pill.slice(1)} level
        </div>
      )}
    </div>
  );
};

export default MessageList;
