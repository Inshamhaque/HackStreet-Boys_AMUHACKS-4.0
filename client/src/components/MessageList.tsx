import React, { useRef, useEffect, useState } from "react";
import { Message, PillLevel } from "../pages/Chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Clipboard, Check, Copy } from "lucide-react";

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
    <div className="flex flex-col items-center w-full h-full overflow-y-auto px-2 sm:px-4">
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

// CodeBlock component for enhanced code snippet display
interface CodeBlockProps {
  language: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get language display name
  const getLanguageDisplay = (lang: string) => {
    if (!lang) return "plaintext";

    const langMap: Record<string, string> = {
      js: "JavaScript",
      ts: "TypeScript",
      jsx: "React JSX",
      tsx: "React TSX",
      py: "Python",
      rb: "Ruby",
      java: "Java",
      cpp: "C++",
      cs: "C#",
      php: "PHP",
      go: "Go",
      rust: "Rust",
      swift: "Swift",
      kotlin: "Kotlin",
      bash: "Bash",
      sh: "Shell",
      html: "HTML",
      css: "CSS",
      sql: "SQL",
      json: "JSON",
      yaml: "YAML",
      md: "Markdown",
    };

    return langMap[lang.toLowerCase()] || lang;
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-700 bg-gray-950">
      {/* Code header with language label and copy button */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="text-sm text-gray-300">
          {getLanguageDisplay(language)}
        </div>
        <button
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white flex items-center gap-1 text-xs"
        >
          {copied ? (
            <>
              <Check size={14} /> Copied!
            </>
          ) : (
            <>
              <Copy size={14} /> Copy code
            </>
          )}
        </button>
      </div>

      {/* Code content with syntax highlighting */}
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono whitespace-pre text-gray-300">
          {value}
        </code>
      </pre>
    </div>
  );
};

const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  const pillColors = {
    green: "border-green-700 bg-green-900/10",
    blue: "border-blue-700 bg-blue-900/10",
    red: "border-red-700 bg-red-900/10",
  };

  // Replace escaped newlines with real line breaks so markdown is parsed properly
  const formattedContent = message.content.replace(/\\n/g, "\n");

  return (
    <div
      className={`w-full mb-4 ${
        message.type === "user" ? "flex justify-end" : "flex justify-start"
      }`}
    >
      <div
        className={`max-w-[90%] sm:max-w-[85%] md:max-w-2xl rounded-lg ${
          message.type === "user"
            ? "bg-gray-800 border border-gray-700 text-white"
            : message.pill && pillColors[message.pill]
            ? `border ${pillColors[message.pill]}`
            : "bg-gray-800 border border-gray-700 text-white"
        }`}
      >
        <div className="p-3 sm:p-4">
          {message.type === "user" ? (
            <p className="whitespace-pre-wrap break-words text-sm sm:text-base">
              {message.content}
            </p>
          ) : (
            <div className="prose prose-invert max-w-none prose-pre:bg-gray-950 prose-sm sm:prose-base prose-headings:text-white prose-a:text-blue-400 prose-strong:text-white prose-em:text-gray-300 prose-ul:text-white prose-ol:text-white">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customize heading components
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold mt-3 mb-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-bold mt-3 mb-1" {...props} />
                  ),
                  // Customize lists
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc ml-6 my-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal ml-6 my-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="my-1" {...props} />
                  ),
                  // Customize other elements
                  a: ({ node, ...props }) => (
                    <a className="text-blue-400 hover:underline" {...props} />
                  ),
                  // Custom code block renderer
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <CodeBlock
                        language={match[1]}
                        value={String(children).replace(/\n$/, "")}
                        {...props}
                      />
                    ) : (
                      <code
                        className="bg-gray-800 px-1 py-0.5 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {formattedContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      {message.type === "ai" && message.pill && (
        <div
          className={`ml-2 text-xs ${
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
