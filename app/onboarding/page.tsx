"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { name } = useApp();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [commitment, setCommitment] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem("aethel_has_onboarded")) {
      router.push("/dashboard");
    }
  }, [router]);

  if (!mounted) return null;

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("aethel_has_onboarded", "true");
      router.push("/dashboard");
    }, 2000);
  };

  const goals = [
    { id: "ai", title: "Master AI Tools", desc: "Learn to use AI to save time and work smarter.", icon: "/icon-ai.png" },
    { id: "productivity", title: "Boost Productivity", desc: "Build systems that get more done in less time.", icon: "/icon-productivity.png" },
    { id: "career", title: "Advance My Career", desc: "Gain high-value skills to stand out.", icon: "/icon-career.png" },
    { id: "knowledge", title: "General Learning", desc: "I just want to learn something new.", icon: "/icon-knowledge.png" },
  ];

  const times = [
    { id: "10m", title: "10 mins / day", desc: "Casual learner" },
    { id: "30m", title: "30 mins / day", desc: "Steady progress" },
    { id: "60m", title: "1 hour / day", desc: "Serious growth" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden text-white selection:bg-[#c9a84c]/30"
      style={{ backgroundColor: "#070b14", backgroundImage: "url('/aethel-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Background overlays */}
      <div className="absolute inset-0 bg-[#070b14]/70 z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9a84c]/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* Progress Bar */}
      <div className="relative z-10 w-full h-1.5 bg-[#1f2b3e]">
        <div
          className="h-full bg-gradient-to-r from-[#c9a84c] to-[#d4b95e] transition-all duration-700 ease-in-out"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="flex-1 relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl relative min-h-[500px]">

          {/* ── STEP 1: Welcome ──────────────────────────────────── */}
          {step === 1 && (
            <div className="flex flex-col justify-center items-center text-center animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(201,168,76,0.15)]">
                <img src="/aethel-logo.png" alt="Aethel" className="w-14 h-14 object-contain" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Welcome to Aethel{name && name !== "User" ? `, ${name.split(' ')[0]}` : ""}.
              </h1>
              <p className="text-lg text-[#9ca3b4] max-w-lg mb-10 leading-relaxed">
                You&apos;re one step away from transforming the way you work, learn, and grow. Let&apos;s personalize your learning path.
              </p>
              <button
                onClick={() => setStep(2)}
                className="bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-10 py-4 rounded-xl text-lg flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(201,168,76,0.25)] shadow-lg"
              >
                Let&apos;s Begin <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Goal Selection ───────────────────────────── */}
          {step === 2 && (
            <div className="flex flex-col justify-center animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">What is your primary goal?</h2>
                <p className="text-[#9ca3b4]">Select the main reason you joined Aethel Solutions today.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {goals.map((g) => {
                  const selected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 ${
                        selected
                          ? 'bg-[#c9a84c]/10 border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.15)]'
                          : 'bg-[#111827]/60 border-[#1f2b3e] hover:border-[#c9a84c]/50 hover:bg-[#111827]'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border transition-all ${selected ? 'border-[#c9a84c]/50 shadow-[0_0_12px_rgba(201,168,76,0.2)]' : 'border-transparent'}`}>
                        <img src={g.icon} alt={g.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg mb-1 transition-colors ${selected ? 'text-[#d4b95e]' : 'text-white'}`}>{g.title}</h3>
                        <p className="text-sm text-[#9ca3b4]">{g.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-[#9ca3b4] hover:text-white font-medium px-4 py-2 transition-colors">Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!goal}
                  className="bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 shadow-lg"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Time Commitment ──────────────────────────── */}
          {step === 3 && (
            <div className="flex flex-col justify-center animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Set your daily target</h2>
                <p className="text-[#9ca3b4]">Consistency beats intensity. How much time can you commit?</p>
              </div>
              <div className="space-y-4 mb-10 max-w-lg mx-auto w-full">
                {times.map((t) => {
                  const selected = commitment === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setCommitment(t.id)}
                      className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all duration-200 ${
                        selected
                          ? 'bg-[#c9a84c]/10 border-[#c9a84c] shadow-[0_0_20px_rgba(201,168,76,0.15)]'
                          : 'bg-[#111827]/60 border-[#1f2b3e] hover:border-[#c9a84c]/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Clock className={`w-6 h-6 transition-colors ${selected ? 'text-[#c9a84c]' : 'text-[#9ca3b4]'}`} />
                        <div className="text-left">
                          <h3 className={`font-bold text-lg transition-colors ${selected ? 'text-[#d4b95e]' : 'text-white'}`}>{t.title}</h3>
                          <p className="text-sm text-[#9ca3b4]">{t.desc}</p>
                        </div>
                      </div>
                      {selected && <CheckCircle2 className="w-6 h-6 text-[#c9a84c]" />}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center max-w-lg mx-auto w-full">
                <button onClick={() => setStep(2)} className="text-[#9ca3b4] hover:text-white font-medium px-4 py-2 transition-colors">Back</button>
                <button
                  onClick={() => { setStep(4); handleFinish(); }}
                  disabled={!commitment || loading}
                  className="bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 shadow-lg"
                >
                  {loading ? "Opening dashboard..." : "Complete Setup"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Personalizing Spinner ────────────────────── */}
          {step === 4 && (
            <div className="flex flex-col justify-center items-center text-center animate-fade-in">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border-4 border-[#1f2b3e] border-t-[#c9a84c] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="/aethel-logo.png" alt="Aethel" className="w-10 h-10 object-contain" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Personalizing your experience...</h2>
              <p className="text-[#9ca3b4] animate-pulse">Setting up your dashboard and learning path.</p>
            </div>
          )}

        </div>
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
