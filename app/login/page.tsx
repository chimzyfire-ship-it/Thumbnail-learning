"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    sessionStorage.removeItem("tt_splash");

    try {
      // Bypass Supabase Auth for now
      localStorage.setItem("tt_user_id", "mock-user-123");
      window.location.href = "/dashboard";
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_5px_15px_rgba(34,211,238,0.3)] select-none">
            Thumbnail Learning
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-gray-950/80 border border-gray-800/60 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {isSignUp ? "Join Thumbnail Learning to start" : "Sign in to continue learning"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-900/80 text-white text-sm border border-gray-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-900/80 text-white text-sm border border-gray-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 bg-gray-900/80 text-white text-sm border border-gray-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 placeholder:text-gray-600 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-4 bg-gray-900/80 text-white text-sm border border-gray-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 placeholder:text-gray-600 transition-all"
              />
            </div>

            {!isSignUp && (
              <div className="flex justify-end pt-1">
                <button type="button" className="text-xs text-teal-500 hover:text-teal-400 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-teal-900/30 hover:shadow-teal-800/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Toggle Form */}
          <p className="text-center text-sm text-gray-500">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-teal-500 hover:text-teal-400 font-medium transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-700 mt-8">
          &copy; 2026 Thumbnail Learning. All rights reserved.
        </p>
      </div>
    </div>
  );
}
