"use client"; // if you're using Next.js app directory

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision"; // adjust path as needed

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  const navigate = useNavigate();

  const getCookie = (name: any) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        await axios.get(`${BACKEND_URL}/csrf-token`, {
          withCredentials: true,
        });
        const token = getCookie("csrftoken");
        console.log("csrf token is:", token);
        if (token) setCsrfToken(token);
      } catch (err) {
        console.error("Error fetching CSRF token:", err);
      }
    };

    fetchCSRFToken();
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/login/`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      localStorage.setItem("usertoken", res.data.key);

      toast.success("Logged in successfully!");
      navigate("/chat");
    } catch (err: any) {
      console.error("Login error:", err);

      // Show more specific error based on response
      if (err.response && err.response.data) {
        const errorData = err.response.data;

        // Loop through the error object if it's Django-style validation
        for (const key in errorData) {
          if (Array.isArray(errorData[key])) {
            toast.error(`${key}: ${errorData[key][0]}`);
            return;
          }
        }

        // Fallback if error shape is unexpected
        toast.error("Something went wrong. Try again.");
      } else {
        toast.error("Network error or server is unreachable.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <BackgroundBeamsWithCollision>
        <div className="relative z-10 max-w-md w-full bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-10 space-y-6">
          <h1 className="text-center text-shadow-lg/30 text-white text-4xl">
            Log in to SocrAI
          </h1>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-500">
            Welcome Back
          </h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-black/60 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-black/60 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Log In
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
