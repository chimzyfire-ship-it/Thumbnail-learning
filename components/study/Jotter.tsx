"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Trash2, Save, ChevronLeft } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

function formatWhen(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString();
}

const STORAGE_KEY = "aethel_notes";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function Jotter() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loaded = loadNotes();
    if (loaded.length === 0) {
      const welcome: Note = {
        id: crypto.randomUUID(),
        title: "Welcome to My Jotter",
        content: "This is your personal notebook. Notes are saved automatically as you type.\n\nUse this space to:\n- Write lecture notes\n- Plan essays and assignments\n- Jot down ideas\n- Create study summaries",
        updatedAt: new Date().toISOString(),
      };
      setNotes([welcome]);
      setActiveId(welcome.id);
      saveNotes([welcome]);
    } else {
      setNotes(loaded);
      setActiveId(loaded[0].id);
    }
  }, []);

  const activeNote = notes.find(n => n.id === activeId) ?? null;
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  function newNote() {
    const note: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      updatedAt: new Date().toISOString(),
    };
    const updated = [note, ...notes];
    setNotes(updated);
    setActiveId(note.id);
    saveNotes(updated);
  }

  function updateActive(field: "title" | "content", value: string) {
    if (!activeId) return;
    const updated = notes.map(n =>
      n.id === activeId ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n
    );
    setNotes(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveNotes(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 800);
  }

  function deleteNote(id: string) {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
    setActiveId(updated[0]?.id ?? null);
  }

  return (
    <div className="phone-card flex h-[calc(100svh-210px)] min-h-[460px] gap-0 overflow-hidden rounded-[1.35rem] border border-[#1f2b3e] md:h-[calc(100vh-280px)] md:min-h-[540px] md:rounded-2xl">
      {/* Sidebar - note list */}
      <div className={`flex w-full shrink-0 flex-col border-r border-[#1f2b3e] bg-[#080c16] md:w-72 ${activeId ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-[#1f2b3e] flex items-center justify-between">
          <span className="font-bold text-white">Notes</span>
          <button
            onClick={newNote}
            className="phone-tap flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9a84c]/20 text-[#c9a84c] transition-colors hover:bg-[#c9a84c]/30 md:h-8 md:w-8 md:rounded-lg"
            title="New note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 border-b border-[#1f2b3e]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a8194]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-[#111827] border border-[#1f2b3e] rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 placeholder:text-[#7a8194]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 && (
            <p className="text-xs text-[#7a8194] text-center p-4">No notes found</p>
          )}
          {filtered.map(note => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveId(note.id)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setActiveId(note.id); }}
              className={`phone-tap group relative w-full cursor-pointer select-none rounded-2xl p-3 text-left transition-all md:rounded-xl ${
                note.id === activeId
                  ? "bg-[#c9a84c]/10 border border-[#c9a84c]/25"
                  : "hover:bg-[#111827] border border-transparent"
              }`}
            >
              <div className="font-semibold text-sm text-white truncate pr-6">{note.title || "Untitled"}</div>
              <div className="text-[11px] text-[#7a8194] mt-0.5 truncate">{note.content.slice(0, 50) || "Empty note"}</div>
              <div className="text-[10px] text-[#c9a84c]/60 mt-1">{formatWhen(note.updatedAt)}</div>
              <button
                onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all"
                aria-label="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className={`flex-1 flex flex-col bg-[#0a0e1a] ${activeId ? "flex" : "hidden md:flex"}`}>
        {activeNote ? (
          <>
            <div className="flex items-center gap-3 border-b border-[#1f2b3e] px-4 pb-4 pt-4 md:gap-4 md:px-8 md:pt-8">
              {/* Back button on mobile only */}
              <button
                onClick={() => setActiveId(null)}
                className="phone-tap rounded-xl border border-[#1f2b3e] bg-[#111827] px-2 text-[#c9a84c] transition-colors hover:bg-[#c9a84c]/10 md:hidden"
                title="Back to notes list"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <input
                value={activeNote.title}
                onChange={e => updateActive("title", e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-lg font-bold text-white placeholder:text-[#7a8194]/40 focus:outline-none md:text-2xl"
                placeholder="Note title..."
              />
              <div className="flex items-center gap-2 text-xs text-[#7a8194] shrink-0">
                {saved && (
                  <span className="flex items-center gap-1 text-green-400">
                    <Save className="w-3 h-3" /> Saved
                  </span>
                )}
                <span className="hidden sm:inline">{formatWhen(activeNote.updatedAt)}</span>
              </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={e => updateActive("content", e.target.value)}
              placeholder="Start typing your notes... Ideas, summaries, plans — anything goes."
              className="w-full flex-1 resize-none bg-transparent px-4 py-4 font-mono text-[15px] leading-7 text-[#d4d8e0] placeholder:text-[#7a8194]/30 focus:outline-none md:px-8 md:py-6 md:text-[16px]"
            />
            <div className="flex items-center justify-between gap-3 border-t border-[#1f2b3e] px-4 py-3 text-[11px] text-[#7a8194] md:px-8 md:text-xs">
              <span>{activeNote.content.split(/\s+/).filter(Boolean).length} words · {activeNote.content.length} chars</span>
              <span className="hidden sm:inline">Auto-saved to browser</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <img src="/icon-book.png" alt="" className="w-16 h-16 opacity-30" />
            <p className="text-[#7a8194]">Select a note or create a new one</p>
            <button onClick={newNote} className="flex items-center gap-2 bg-[#c9a84c]/20 hover:bg-[#c9a84c]/30 text-[#c9a84c] px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
              <Plus className="w-4 h-4" /> New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
