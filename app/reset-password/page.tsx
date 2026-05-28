"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Status = "checking" | "ready" | "saving" | "success" | "error";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState("Checking your reset link...");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const prepareSession = async () => {
      try {
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (window.location.hash.includes("access_token")) {
          const hash = new URLSearchParams(window.location.hash.slice(1));
          const accessToken = hash.get("access_token");
          const refreshToken = hash.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (error) throw error;
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setStatus("error");
          setMessage("This reset link has expired or has already been used. Request a new link from the sign in page.");
          return;
        }

        setStatus("ready");
        setMessage("Choose a new password for your account.");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Could not open this reset link.");
      }
    };

    prepareSession();
  }, [searchParams, supabase.auth]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      setStatus("error");
      setMessage("Your new password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("The two passwords do not match.");
      return;
    }

    setStatus("saving");
    setMessage("Saving your new password...");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    await supabase.auth.signOut();
    localStorage.removeItem("tt_user_id");
    setStatus("success");
    setMessage("Your password has been changed. You can now sign in with the new password.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundImage: "url('/aethel-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "#070b14" }}>
      <div className="absolute inset-0 bg-[#070b14]/45" />
      <div className="w-full max-w-md relative z-10">
        <div className="relative rounded-2xl p-8 md:p-10 shadow-2xl" style={{ background: "linear-gradient(145deg, rgba(14,20,36,0.94), rgba(10,14,26,0.97))", border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 0 80px rgba(201,168,76,0.06), 0 25px 50px rgba(0,0,0,0.5)" }}>
          <div className="flex justify-center mb-6">
            <img src="/aethel-logo.png" alt="Aethel Solutions" className="h-24 w-auto object-contain" style={{ filter: "drop-shadow(0 4px 20px rgba(201,168,76,0.3))" }} />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Reset password</h1>
            <p className="text-sm text-[#7a8194] mt-2">{message}</p>
          </div>

          {(status === "error" || status === "success") && (
            <div className={`mb-5 p-3 rounded-lg border text-xs font-medium flex gap-2 ${status === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
              {status === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              <span>{message}</span>
            </div>
          )}

          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#9ca3b4] mb-1.5">New password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a5568]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                    disabled={status === "checking" || status === "saving"}
                    className="w-full h-12 bg-[#0c1222] text-white text-sm border border-[#1f2b3e] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/60 transition-all placeholder:text-[#3d4555] pl-11 pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a5568] hover:text-[#c9a84c] transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9ca3b4] mb-1.5">Confirm password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  minLength={8}
                  disabled={status === "checking" || status === "saving"}
                  className="w-full h-12 bg-[#0c1222] text-white text-sm border border-[#1f2b3e] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/60 transition-all placeholder:text-[#3d4555] px-4"
                />
              </div>

              <button
                type="submit"
                disabled={status === "checking" || status === "saving"}
                className="w-full h-12 mt-1 font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[#0a0e1a] gold-shimmer hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:scale-[1.01]"
              >
                {status === "saving" ? "Saving..." : "Save new password"}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="w-full h-12 font-semibold text-sm rounded-xl text-[#0a0e1a] gold-shimmer transition-all duration-200 hover:scale-[1.01]"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
