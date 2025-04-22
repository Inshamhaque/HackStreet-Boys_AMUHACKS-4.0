import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Utility to get a cookie
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

export default function SignupPage() {
  const [fullname, setFullname] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  const navigate = useNavigate();

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

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [first_name = "", last_name = ""] = fullname.trim().split(" ");
    if (last_name == "") {
      toast.error("Please Enter full name", {
        position: "top-right",
      });
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/auth/registration/`,
        {
          username,
          email,
          password1,
          password2,
          first_name,
          last_name,
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
      toast.success("User created successfully!");
      navigate("/chat");
    } catch (err: any) {
      console.error("Signup error:", err);

      if (err.response && err.response.data) {
        const errorData = err.response.data;

        for (const key in errorData) {
          if (Array.isArray(errorData[key])) {
            errorData[key].forEach((msg: string) =>
              toast.error(`${key}: ${msg}`)
            );
          } else if (typeof errorData[key] === "string") {
            toast.error(`${key}: ${errorData[key]}`);
          }
        }
      } else {
        toast.error("Network error or server is unreachable.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <BackgroundBeamsWithCollision>
        <div className="relative z-10 max-w-md w-full bg-white/80 dark:bg-black/40 backdrop-blur-sm shadow-xl rounded-2xl p-8 md:p-10 space-y-6">
          <h1 className="text-center text-shadow-lg/30 text-white text-4xl">
            Sign up to SocrAI
          </h1>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-500">
            Create an Account
          </h2>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-black/60 dark:text-white"
                required
              />
            </div>
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
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-black/60 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password1"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password1"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-black/60 dark:text-white"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-black/60 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
