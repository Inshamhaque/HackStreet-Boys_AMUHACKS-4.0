"use client"; // if you're using Next.js app directory

import React from "react";
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision"; // adjust path as needed

export default function SignupPage() {
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
          <form className="space-y-4">
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
                className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-black/60 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Sign Up
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
