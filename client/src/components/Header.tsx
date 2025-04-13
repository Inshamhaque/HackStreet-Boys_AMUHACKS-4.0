import React, { useEffect } from "react";
import { Menu, X, UserIcon, LogOut } from "lucide-react";
import { PillLevel } from "../pages/Chat";
import { useUser } from "../context/UserContext";

interface HeaderProps {
  chatName: string;
  selectedPill: PillLevel;
  onPillClick: () => void;
  setCloseSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  CloseSidebar: boolean;
}

const Header: React.FC<HeaderProps> = ({
  chatName,
  selectedPill,
  setCloseSideBar,
  CloseSidebar,
}) => {
  const { user } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    window.location.href = "/";
  };

  function capitalizeString(str: string): string {
    if (str.length === 0) return str; // Handle empty string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const toggleSidebar = () => {
    setCloseSideBar((prev) => !prev);
  };

  // Close sidebar when user resizes to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !CloseSidebar) {
        setCloseSideBar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [CloseSidebar, setCloseSideBar]);

  return (
    <>
      {/* Overlay for mobile - shown when sidebar is open */}
      {!CloseSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      <div className="flex justify-between z-20 relative">
        <div
          className={`mx-auto px-4 py-3 ${
            CloseSidebar ? "w-[100vw]" : "w-[80vw]"
          } flex justify-between items-center`}
        >
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-800 text-gray-400 transition-colors"
              aria-label="Toggle Sidebar"
            >
              {CloseSidebar ? <Menu size={20} /> : <X size={20} />}
            </button>
            <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[150px] sm:max-w-md text-white">
              {chatName}
            </h1>
            {/* Pill */}
            {selectedPill && (
              <div
                className={`ml-2 flex items-center space-x-2 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors border
            ${
              selectedPill === "green"
                ? "bg-green-900/40 text-green-400 border-green-700/60"
                : selectedPill === "blue"
                ? "bg-blue-900/40 text-blue-400 border-blue-700/60"
                : "bg-red-900/40 text-red-400 border-red-700/60"
            }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedPill === "green"
                      ? "bg-green-400"
                      : selectedPill === "blue"
                      ? "bg-blue-400"
                      : "bg-red-400"
                  }`}
                ></span>
                <span className="capitalize hidden sm:inline">
                  {selectedPill === "green"
                    ? "Beginner"
                    : selectedPill === "blue"
                    ? "Intermediate"
                    : "Advanced"}
                </span>
              </div>
            )}
          </div>

          {/* Right Section */}
          {user && (
            <div className="flex items-center space-x-2">
              {/* Username - Desktop Only */}
              <div className="hidden sm:flex items-center space-x-2 bg-gray-800/40 px-3 py-1.5 rounded-full text-sm font-medium text-gray-200">
                {/* <UserIcon size={16} className="text-gray-400" /> */}
                <span className="truncate max-w-[100px]">
                  {capitalizeString(user.first_name)}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm bg-gray-800/50 hover:bg-red-900/40 text-red-400 px-3 py-1.5 rounded-full transition"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
