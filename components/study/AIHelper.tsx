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
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[520px] rounded-2xl border border-[#1f2b3e] overflow-hidden bg-[#080c16] md:h-[calc(100vh-280px)] md:min-h-[540px]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#1f2b3e] bg-gradient-to-r from-[#0a0e1a] to-[#0d1424] flex items-center gap-4">
        <div className="relative">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#c9a84c]/40 shadow-[0_0_20px_rgba(201,168,76,0.25)]">
            <img src="/icon-brain.png" alt="AI" className="w-full h-full object-cover" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#080c16]" />
        </div>
        <div>
          <h2 className="font-bold text-white">Aethel AI</h2>
          <p className="text-xs text-[#c9a84c]/70">Protected helper with daily limits</p>
        </div>
        {docName && (
          <div className="ml-auto flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-lg px-3 py-1.5">
            <span className="text-xs text-[#c9a84c] font-semibold truncate max-w-[140px]">{docName}</span>
            <button onClick={() => { setDocContext(""); setDocName(""); }} className="text-[#c9a84c]/60 hover:text-[#c9a84c]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" ? (
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#c9a84c]/20">
                <img src="/icon-brain.png" alt="AI" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full shrink-0 bg-[#c9a84c] text-[#0a0e1a] font-black flex items-center justify-center text-sm">
                {(name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className={`max-w-[80%] ${msg.role === "user"
              ? "bg-[#c9a84c] text-[#0a0e1a] rounded-2xl rounded-tr-sm px-4 py-3 text-[15px] font-medium"
              : "bg-[#111827] border border-[#1f2b3e] rounded-2xl rounded-tl-sm px-4 py-3 text-[15px] text-[#d4d8e0]"
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
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="text-xs bg-[#111827] border border-[#1f2b3e] hover:border-[#c9a84c]/40 text-[#7a8194] hover:text-[#c9a84c] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-[#1f2b3e] bg-[#0a0e1a]">
        <div className="flex items-end gap-3 bg-[#111827] border border-[#1f2b3e] focus-within:border-[#c9a84c]/40 rounded-2xl px-4 py-3 transition-colors">
          <input type="file" ref={fileRef} className="hidden" accept=".txt,.pdf" onChange={handleFileRead} />
          <button
            onClick={() => fileRef.current?.click()}
            className="shrink-0 text-[#7a8194] hover:text-[#c9a84c] transition-colors mb-0.5"
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
            className="flex-1 bg-transparent text-white text-sm focus:outline-none resize-none leading-relaxed placeholder:text-[#7a8194] max-h-32"
            style={{ minHeight: "24px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="shrink-0 w-9 h-9 bg-[#c9a84c] hover:bg-[#d4b95e] disabled:opacity-30 disabled:cursor-not-allowed text-[#0a0e1a] rounded-xl flex items-center justify-center transition-all hover:scale-105"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-center text-[11px] text-[#7a8194]/50 mt-2">Press Enter to send. Shift+Enter starts a new line.</p>
      </div>
    </div>
  );
}
