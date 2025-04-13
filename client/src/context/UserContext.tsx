import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  // Add more fields as needed
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  csrfToken: string | null;
}

export const UserContext = createContext<UserContextType | null>(null);
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  };

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await axios.get(`${BACKEND_URL}/csrf-token`, {
          withCredentials: true,
        });
        const token = getCookie("csrftoken");
        if (token) setCsrfToken(token);
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        if (!token) return;

        const res = await axios.get(`${BACKEND_URL}/api/auth/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setUser(res.data);
        console.log("user from provider", user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchCSRFToken();
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, csrfToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
