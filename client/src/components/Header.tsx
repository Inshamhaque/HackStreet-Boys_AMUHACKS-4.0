import React from "react";
import { Menu, ChevronDown } from "lucide-react";
import { PillLevel } from "../pages/Chat";
import { useUser } from "../context/UserContext";
import { UserIcon } from "lucide-react";
interface HeaderProps {
  chatName: string;
  selectedPill: PillLevel;
  onPillClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  chatName,
  selectedPill,
  onPillClick,
}) => {
  const { user } = useUser();

  return (
    <header className="bg-gray-900 border-b border-gray-800 z-20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="p-1 rounded-md hover:bg-gray-800 transition-colors text-gray-400">
            <Menu size={18} />
          </button>
          <h1 className="font-bold truncate max-w-xs">{chatName}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {selectedPill && (
            <div
              onClick={onPillClick}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 cursor-pointer
                ${
                  selectedPill === "green"
                    ? "bg-green-900/40 text-green-400 border border-green-700/70"
                    : selectedPill === "blue"
                    ? "bg-blue-900/40 text-blue-400 border border-blue-700/70"
                    : "bg-red-900/40 text-red-400 border border-red-700/70"
                }`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  selectedPill === "green"
                    ? "bg-green-400"
                    : selectedPill === "blue"
                    ? "bg-blue-400"
                    : "bg-red-400"
                }`}
              ></span>
              <span>
                {selectedPill === "green"
                  ? "Beginner"
                  : selectedPill === "blue"
                  ? "Intermediate"
                  : "Advanced"}
              </span>
              <ChevronDown size={14} />
            </div>
          )}

          {/* ✅ Username section */}
          {user && (
            <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1 rounded-full text-sm font-medium text-gray-200">
              <UserIcon size={16} className="text-gray-400" />
              <span className="truncate max-w-[100px]">{user.username}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
