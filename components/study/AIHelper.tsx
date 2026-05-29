"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useApp } from "@/lib/app-context";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const QUICK_PROMPTS = [
  "Quiz me on what I've been studying",
  "Help me outline an essay",
  "Explain this topic simply",
  "Create a study schedule for me",
  "Give me 5 memory tricks for learning",
  "What are the best study techniques?",
];

export default function AIHelper() {
  const { name } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content: `Hey **${name || "there"}**. I'm your Aethel AI Study Assistant.\n\nI can help you:\n- **Explain** any topic clearly\n- **Outline** essays and assignments\n- **Quiz** you on what you're learning\n- **Summarize** documents you paste in\n- **Solve** problems step by step\n\nWhat do you need help with today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [docContext, setDocContext] = useState("");
  const [docName, setDocName] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const aiMsgId = crypto.randomUUID();
    setMessages(prev => [...prev, { id: aiMsgId, role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          documentContext: docContext || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(m => m.id === aiMsgId ? { ...m, content: accumulated } : m)
        );
      }
    } catch (err) {
      const errorText = err instanceof Error
        ? err.message
        : "Something went wrong. Please try again shortly.";
      setMessages(prev =>
        prev.map(m => m.id === aiMsgId ? { ...m, content: `Notice: ${errorText}` } : m)
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleFileRead(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "text/plain") {
      const text = await file.text();
      setDocContext(text.slice(0, 8000));
      setDocName(file.name);
    } else {
      setDocName(file.name);
      setDocContext(`[File: ${file.name}] — Non-text file attached. Describe its contents.`);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="phone-card flex h-[calc(100svh-210px)] min-h-[460px] flex-col overflow-hidden rounded-[1.35rem] border border-[#1f2b3e] bg-[#080c16] md:h-[calc(100vh-280px)] md:min-h-[540px] md:rounded-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#1f2b3e] bg-gradient-to-r from-[#0a0e1a] to-[#0d1424] px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <div className="relative">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#c9a84c]/40 shadow-[0_0_20px_rgba(201,168,76,0.25)] sm:h-11 sm:w-11">
            <img src="/icon-brain.png" alt="AI" className="w-full h-full object-cover" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#080c16]" />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-white">Aethel AI</h2>
          <p className="truncate text-xs text-[#c9a84c]/70">Protected helper with daily limits</p>
        </div>
        {docName && (
          <div className="ml-auto flex min-w-0 items-center gap-2 rounded-lg border border-[#c9a84c]/20 bg-[#c9a84c]/10 px-2 py-1.5 sm:px-3">
            <span className="max-w-[80px] truncate text-xs font-semibold text-[#c9a84c] sm:max-w-[140px]">{docName}</span>
            <button onClick={() => { setDocContext(""); setDocName(""); }} className="text-[#c9a84c]/60 hover:text-[#c9a84c]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-3.5 sm:space-y-5 sm:p-5">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" ? (
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#c9a84c]/20 sm:h-9 sm:w-9">
                <img src="/icon-brain.png" alt="AI" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#c9a84c] text-sm font-black text-[#0a0e1a] sm:h-9 sm:w-9">
                {(name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className={`max-w-[86%] break-words ${msg.role === "user"
              ? "bg-[#c9a84c] text-[#0a0e1a] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm font-medium sm:px-4 sm:py-3 sm:text-[15px]"
              : "bg-[#111827] border border-[#1f2b3e] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-[#d4d8e0] sm:px-4 sm:py-3 sm:text-[15px]"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:text-[#c9a84c] prose-strong:text-white prose-code:bg-[#0a0e1a] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[#c9a84c]">
                  {msg.content ? (
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  ) : (
                    <span className="flex gap-1 items-center h-5">
                      <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              ) : msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts (show if only welcome msg) */}
      {messages.length === 1 && (
        <div className="flex gap-2 overflow-x-auto px-3.5 pb-3 sm:flex-wrap sm:px-5">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="phone-tap flex shrink-0 items-center gap-1 rounded-full border border-[#1f2b3e] bg-[#111827] px-3 py-1.5 text-xs text-[#7a8194] transition-colors hover:border-[#c9a84c]/40 hover:text-[#c9a84c]"
            >
              <Sparkles className="w-3 h-3" /> {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-[#1f2b3e] bg-[#0a0e1a] p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-[#1f2b3e] bg-[#111827] px-3 py-3 transition-colors focus-within:border-[#c9a84c]/40 sm:gap-3 sm:px-4">
          <input type="file" ref={fileRef} className="hidden" accept=".txt,.pdf" onChange={handleFileRead} />
          <button
            onClick={() => fileRef.current?.click()}
            className="phone-tap mb-0.5 shrink-0 rounded-xl text-[#7a8194] transition-colors hover:text-[#c9a84c]"
            title="Attach a text file to discuss"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything… or paste text to summarize"
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent text-sm leading-relaxed text-white placeholder:text-[#7a8194] focus:outline-none"
            style={{ minHeight: "24px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="phone-tap flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c9a84c] text-[#0a0e1a] transition-all hover:scale-105 hover:bg-[#d4b95e] disabled:cursor-not-allowed disabled:opacity-30 sm:h-9 sm:w-9"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="mt-2 hidden text-center text-[11px] text-[#7a8194]/50 sm:block">Press Enter to send. Shift+Enter starts a new line.</p>
      </div>
    </div>
  );
}
