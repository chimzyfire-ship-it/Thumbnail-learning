"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";

type Screen = "auth" | "check-email" | "forgot-sent";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [screen, setScreen] = useState<Screen>("auth");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName, last_name: lastName } },
        });
        if (error) throw error;
        // If session exists immediately (email confirmation disabled), go to dashboard
        if (data.session) {
          localStorage.setItem("tt_user_id", data.session.user.id);
          router.push("/dashboard");
        } else {
          setScreen("check-email");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        localStorage.setItem("tt_user_id", data.user.id);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setErrorMsg("Enter your email address first, then click Forgot password."); return; }
    setLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setScreen("forgot-sent");
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "Could not send reset email. Try again."));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full h-12 bg-[#0c1222] text-white text-sm border border-[#1f2b3e] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/60 transition-all placeholder:text-[#3d4555]";

  // ── Check-email confirmation screen ──────────────────────────
  if (screen === "check-email" || screen === "forgot-sent") {
    const isForgot = screen === "forgot-sent";
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundImage: "url('/aethel-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "#070b14" }}>
        <div className="absolute inset-0 bg-[#070b14]/40" />
        <div className="w-full max-w-md relative z-10">
          <div className="relative rounded-2xl p-10 text-center shadow-2xl" style={{ background: "linear-gradient(145deg, rgba(14,20,36,0.92), rgba(10,14,26,0.96))", border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 0 80px rgba(201,168,76,0.06), 0 25px 50px rgba(0,0,0,0.5)" }}>
            <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-[#c9a84c]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{isForgot ? "Reset link sent" : "Check your inbox"}</h1>
            <p className="text-[#7a8194] text-sm leading-relaxed mb-6">
              {isForgot
                ? `We sent a password reset link to ${email}. Follow the link in the email to set a new password.`
                : `We sent a confirmation link to ${email}. Open it to activate your account, then come back here to sign in.`}
            </p>
            <button
              onClick={() => { setScreen("auth"); setIsSignUp(false); }}
              className="w-full h-12 font-semibold text-sm rounded-xl text-[#0a0e1a] gold-shimmer transition-all duration-200 hover:scale-[1.01]"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main auth form ───────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundImage: "url('/aethel-bg.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "#070b14" }}>
      <div className="absolute inset-0 bg-[#070b14]/40" />
      <div className="w-full max-w-md relative z-10">
        <div className="relative rounded-2xl p-8 md:p-10 shadow-2xl" style={{ background: "linear-gradient(145deg, rgba(14,20,36,0.92), rgba(10,14,26,0.96))", border: "1px solid rgba(201,168,76,0.25)", boxShadow: "0 0 80px rgba(201,168,76,0.06), 0 25px 50px rgba(0,0,0,0.5)" }}>
          <div className="flex justify-center mb-6">
            <img src="/aethel-logo.png" alt="Aethel Solutions" className="h-24 w-auto object-contain sm:h-32" style={{ filter: "drop-shadow(0 4px 20px rgba(201,168,76,0.3))" }} />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">{isSignUp ? "Create Account" : "Welcome back"}</h1>
            <p className="text-sm text-[#7a8194] mt-2">{isSignUp ? "Join Aethel Solutions to start your journey" : "Sign in to continue your learning journey"}</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-5">
            {errorMsg && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">{errorMsg}</div>}
            {isSignUp && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#9ca3b4] mb-1.5">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={`${inputCls} px-4`} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9ca3b4] mb-1.5">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`${inputCls} px-4`} />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[#9ca3b4] mb-1.5">Email address</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a5568]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className={`${inputCls} pl-11 pr-4`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9ca3b4] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4a5568]" />
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} className={`${inputCls} pl-11 pr-12`} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a5568] hover:text-[#c9a84c] transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" onClick={handleForgotPassword} disabled={loading} className="text-xs text-[#c9a84c] hover:text-[#d4b95e] transition-colors font-medium disabled:opacity-50">
                  Forgot password?
                </button>
              </div>
            )}
            {isSignUp && (
              <p className="text-[11px] text-[#4a5568] leading-relaxed">
                By creating an account you agree to our{" "}
                <a href="/terms" target="_blank" className="text-[#c9a84c] hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="/privacy" target="_blank" className="text-[#c9a84c] hover:underline">Privacy Policy</a>.
              </p>
            )}
            <button type="submit" disabled={loading} className="w-full h-12 mt-1 font-semibold text-sm rounded-xl transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[#0a0e1a] gold-shimmer hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:scale-[1.01]">
              {loading ? <div className="h-5 w-5 border-2 border-[#0a0e1a]/30 border-t-[#0a0e1a] rounded-full animate-spin" /> : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1f2b3e]" /><span className="text-xs text-[#4a5568]">or</span><div className="flex-1 h-px bg-[#1f2b3e]" />
          </div>
          <p className="text-center text-sm text-[#7a8194]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(""); }} className="text-[#c9a84c] hover:text-[#d4b95e] font-medium transition-colors">{isSignUp ? "Sign In" : "Sign up"}</button>
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs text-[#4a5568]">
          <span>&copy; 2026 Aethel Solutions</span>
          <a href="/support" className="hover:text-[#c9a84c] hover:underline">Support</a>
          <a href="/terms" className="hover:text-[#c9a84c] hover:underline">Terms</a>
          <a href="/privacy" className="hover:text-[#c9a84c] hover:underline">Privacy</a>
        </div>
      </div>
    </div>
  );
}
