"use client";

import { useState } from "react";
import { 
  BookOpen, 
  Library, 
  Bot, 
  Plus, 
  Search, 
  FileText, 
  Link as LinkIcon, 
  Send,
  Sparkles
} from "lucide-react";

type Tab = "jotter" | "bank" | "helper";

export default function StudySpacePage() {
  const [activeTab, setActiveTab] = useState<Tab>("jotter");

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">Study Space</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-gray-400">
          Your personal area for everything you are learning in life. Keep your notes, save important links, and ask for help when school gets tough.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 md:grid md:grid-cols-3 md:gap-4 w-full bg-secondary/20 p-2 rounded-2xl border border-border/50">
        <button
          onClick={() => setActiveTab("jotter")}
          className={`flex-1 flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-bold transition-all ${
            activeTab === "jotter"
              ? "bg-primary text-background shadow-lg scale-[1.02]"
              : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-base md:text-lg">My Jotter</span>
        </button>

        <button
          onClick={() => setActiveTab("bank")}
          className={`flex-1 flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-bold transition-all ${
            activeTab === "bank"
              ? "bg-primary text-background shadow-lg scale-[1.02]"
              : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="text-base md:text-lg">Materials Bank</span>
        </button>

        <button
          onClick={() => setActiveTab("helper")}
          className={`flex-1 flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-bold transition-all ${
            activeTab === "helper"
              ? "bg-primary text-background shadow-lg scale-[1.02]"
              : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
          }`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-base md:text-lg">Homework Helper</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full min-h-[500px]">
        {/* 1. MY JOTTER */}
        {activeTab === "jotter" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out flex flex-col md:flex-row gap-6 h-[600px]">
            {/* Sidebar List */}
            <div className="w-full md:w-1/3 bg-secondary/10 border border-border/50 rounded-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border/30 bg-secondary/20 flex items-center justify-between">
                <h3 className="font-bold text-lg">My Notes</h3>
                <button className="bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 border-b border-border/30 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search notes..." 
                  className="w-full bg-black/40 border border-border/50 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {[
                  { title: "BIO 101 Lecture", date: "Today", active: true },
                  { title: "Ideas for Economics Essay", date: "Yesterday", active: false },
                  { title: "Math Formulas to Cram", date: "Last Week", active: false },
                ].map((note, i) => (
                  <button 
                    key={i} 
                    className={`w-full text-left p-4 rounded-xl transition-colors ${
                      note.active ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary/30 border border-transparent"
                    }`}
                  >
                    <div className="font-bold text-[15px] text-foreground truncate">{note.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{note.date}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor */}
            <div className="w-full md:w-2/3 bg-secondary/5 border border-border/50 rounded-2xl flex flex-col overflow-hidden">
              <div className="p-6 md:p-8 border-b border-border/30">
                <input 
                  type="text" 
                  defaultValue="BIO 101 Lecture" 
                  className="w-full bg-transparent text-3xl font-bold focus:outline-none text-foreground placeholder-muted-foreground/30"
                  placeholder="Note Title"
                />
              </div>
              <textarea 
                className="flex-1 w-full p-6 md:p-8 bg-transparent focus:outline-none resize-none text-[17px] leading-relaxed text-gray-300 placeholder-muted-foreground/30"
                placeholder="Start typing your notes here. Keep it very simple..."
                defaultValue={"Cell Biology is the study of cells structure and function.\n\nThe cell is the basic unit of life. We talked about:\n- Nucleus (Brain of the cell)\n- Mitochondria (Powerhouse)\n- Ribosomes (Make proteins)\n\nI need to remember exactly what mitochondria does for the mid-semester test next week."}
              />
            </div>
          </div>
        )}

        {/* 2. MATERIALS BANK */}
        {activeTab === "bank" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="bg-secondary/10 border border-border/50 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-4 items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Saved Study Links & PDFs</h2>
                  <p className="text-muted-foreground mt-1">Don't lose good reading material. Drop it here.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg">
                  <Plus className="w-5 h-5" /> Save New Link
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Calculus PDF Textbook", type: "pdf", icon: FileText, desc: "Chapter 1-4 for upcoming test." },
                  { title: "How to write a good essay", type: "link", icon: LinkIcon, desc: "Helpful guide from YouTube." },
                  { title: "Past Questions 2023", type: "pdf", icon: FileText, desc: "JAMB past questions for English." },
                  { title: "History of Nigeria Notes", type: "link", icon: LinkIcon, desc: "Wikipedia article to read later offline." },
                ].map((item, i) => (
                  <div key={i} className="bg-black/40 border border-border/40 p-5 rounded-2xl hover:border-primary/40 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] line-clamp-1">{item.title}</h3>
                        <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground">{item.type}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. HOMEWORK HELPER */}
        {activeTab === "helper" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out max-w-3xl mx-auto h-[600px] flex flex-col bg-secondary/10 border border-border/50 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0a1128] via-[#051e2c] to-[#043343] p-6 border-b border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <Bot className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Study Assistant</h2>
                  <p className="text-sm text-cyan-200/80">I will explain things in simple English for you.</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-black/40">
              {/* Bot Msg */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-800 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="bg-secondary/40 border border-border/40 rounded-2xl rounded-tl-sm p-4 max-w-[85%] text-[15px] leading-relaxed">
                  Hello! I am your Homework Helper. If you are stuck on an assignment, or you just don't understand a topic, type it below. <br/><br/>
                  Try asking: <br/>
                  <span className="font-bold text-cyan-400">"Explain gravity to me like I am 5 years old"</span>
                </div>
              </div>
              
              {/* User Msg */}
              <div className="flex items-start gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-background font-bold">
                  U
                </div>
                <div className="bg-primary text-background rounded-2xl rounded-tr-sm p-4 max-w-[85%] text-[15px] font-medium leading-relaxed">
                  Can you help me outline an essay on the impact of social media?
                </div>
              </div>
              
              {/* Bot Msg */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-800 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="bg-secondary/40 border border-border/40 rounded-2xl rounded-tl-sm p-4 max-w-[85%] text-[15px] leading-relaxed">
                  Sure! Here is a very simple outline you can use:<br/><br/>
                  <strong className="text-cyan-400">1. Introduction:</strong> What is social media? Mention platforms like WhatsApp, TikTok, and Twitter.<br/>
                  <strong className="text-cyan-400">2. Body Paragraph 1 (The Good):</strong> How it helps us stay connected with friends and learn new things easily.<br/>
                  <strong className="text-cyan-400">3. Body Paragraph 2 (The Bad):</strong> How it causes distraction from school work and spreading fake news.<br/>
                  <strong className="text-cyan-400">4. Conclusion:</strong> Summarize that social media is a good tool, but we must use it wisely.
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary/20 border-t border-border/30">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your question here..." 
                  className="w-full bg-black/60 border border-border/60 rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-[15px]"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 hover:bg-cyan-400 text-black w-10 h-10 flex items-center justify-center rounded-lg transition-colors">
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
