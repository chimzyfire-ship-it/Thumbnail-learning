"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, FileText, Link as LinkIcon, X, ExternalLink,
  Upload, Search, Play, Music, FileSpreadsheet, AlertTriangle,
} from "lucide-react";
import { formatMaterialSize, getMaterialCategory, type FileCategory } from "@/lib/materials";

// ── Types ────────────────────────────────────────────────────────────────────

interface Material {
  id: string;
  category: FileCategory;
  name: string;
  url: string;
  localBlob?: string;
  desc: string;
  size?: string;
  mimeType?: string;
  addedAt: string;
}

// ── Category Icon ──────────────────────────────────────────────────────────────

function CategoryIcon({ cat, className = "w-5 h-5" }: { cat: FileCategory; className?: string }) {
  const gold = "text-[#c9a84c]";
  switch (cat) {
    case "image": return <img src="/icon-completed.png" alt="" className={`${className} object-contain`} />;
    case "pdf":   return <img src="/icon-book.png" alt="" className={`${className} object-contain`} />;
    case "audio": return <Music className={`${className} ${gold}`} />;
    case "video": return <Play className={`${className} ${gold}`} />;
    case "office": return <FileSpreadsheet className={`${className} ${gold}`} />;
    case "text":  return <FileText className={`${className} ${gold}`} />;
    case "link":  return <LinkIcon className={`${className} ${gold}`} />;
    default:      return <FileText className={`${className} ${gold}`} />;
  }
}

// ── Preview Modal ─────────────────────────────────────────────────────────────

function PreviewModal({ item, onClose }: { item: Material; onClose: () => void }) {
  const src = item.localBlob || item.url;
  const [textContent, setTextContent] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Fetch text file content
  useEffect(() => {
    if (item.category === "text" && src) {
      fetch(src).then(r => r.text()).then(t => setTextContent(t)).catch(() => setTextContent("Could not load file content."));
    }
  }, [item.category, src]);

  const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(item.url)}&embedded=true`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      style={{ background: "rgba(5,7,14,0.93)", backdropFilter: "blur(14px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex flex-col w-full max-w-5xl bg-[#0d1424] rounded-2xl border border-[#1f2b3e] overflow-hidden shadow-2xl"
        style={{ maxHeight: "92vh" }}>

        {/* Modal Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#1f2b3e] shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
            <CategoryIcon cat={item.category} className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white text-sm truncate">{item.name}</p>
            <p className="text-[11px] text-[#7a8194] uppercase tracking-wider">{item.category}{item.size ? ` · ${item.size}` : ""}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href={src} download={item.category !== "link" ? item.name : undefined}
              target={item.category === "link" ? "_blank" : undefined} rel="noopener noreferrer"
              className="text-xs bg-[#111827] border border-[#1f2b3e] hover:border-[#c9a84c]/40 text-[#c9a84c] px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              {item.category === "link" ? "Open" : "Download"}
            </a>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#111827] border border-[#1f2b3e] text-[#7a8194] hover:text-white flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto min-h-0 flex items-center justify-center bg-[#080c16]">

          {/* IMAGE */}
          {item.category === "image" && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img src={src} alt={item.name} className="max-w-full max-h-full object-contain rounded-xl select-none" />
            </div>
          )}

          {/* PDF */}
          {item.category === "pdf" && (
            <embed src={src} type="application/pdf" className="w-full" style={{ height: "80vh" }} />
          )}

          {/* AUDIO */}
          {item.category === "audio" && (
            <div className="flex flex-col items-center gap-6 p-12">
              <div className="w-24 h-24 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                <Music className="w-10 h-10 text-[#c9a84c]" />
              </div>
              <p className="text-white font-bold text-lg text-center">{item.name}</p>
              <audio controls src={src} className="w-full max-w-md" style={{ colorScheme: "dark" }} />
            </div>
          )}

          {/* VIDEO */}
          {item.category === "video" && (
            <div className="w-full flex items-center justify-center p-4" style={{ maxHeight: "80vh" }}>
              <video controls src={src} className="max-w-full max-h-full rounded-xl" style={{ maxHeight: "75vh" }} />
            </div>
          )}

          {/* TEXT / MARKDOWN */}
          {item.category === "text" && (
            <div className="w-full h-full overflow-auto p-6 md:p-10" style={{ maxHeight: "80vh" }}>
              <pre className="text-sm text-[#d4d8e0] font-mono leading-relaxed whitespace-pre-wrap break-words">
                {textContent ?? "Loading…"}
              </pre>
            </div>
          )}

          {/* OFFICE (Word, PowerPoint, Excel) — Google Docs Viewer */}
          {item.category === "office" && item.url && !item.localBlob && (
            <iframe
              src={googleViewerUrl}
              className="w-full border-0"
              style={{ height: "80vh" }}
              title={item.name}
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          )}
          {item.category === "office" && item.localBlob && (
            <div className="flex flex-col items-center gap-4 p-12 text-center">
              <FileSpreadsheet className="w-16 h-16 text-[#c9a84c]/30" />
              <p className="text-white font-bold">{item.name}</p>
              <p className="text-[#7a8194] text-sm max-w-sm">Office documents can be previewed once uploaded to Supabase. Download the file to open it locally.</p>
              <a href={src} download={item.name}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                <ExternalLink className="w-4 h-4" /> Download to Open
              </a>
            </div>
          )}

          {/* LINK */}
          {item.category === "link" && (
            <div className="flex flex-col items-center gap-5 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                <LinkIcon className="w-9 h-9 text-[#c9a84c]" />
              </div>
              <div>
                <p className="font-bold text-white text-lg mb-1">{item.name}</p>
                <p className="text-[#7a8194] text-sm break-all max-w-md">{item.url}</p>
              </div>
              {item.desc && <p className="text-[#d4d8e0] text-sm max-w-md">{item.desc}</p>}
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-7 py-3 rounded-xl transition-colors">
                <ExternalLink className="w-4 h-4" /> Open in Browser
              </a>
            </div>
          )}

          {/* OTHER */}
          {item.category === "other" && (
            <div className="flex flex-col items-center gap-4 p-12 text-center">
              <FileText className="w-16 h-16 text-[#c9a84c]/30" />
              <p className="text-white font-bold">{item.name}</p>
              <p className="text-[#7a8194] text-sm">This file type can&apos;t be previewed in the browser.</p>
              <a href={src} download={item.name}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                <ExternalLink className="w-4 h-4" /> Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MaterialsBank() {
  const [items, setItems] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkName, setLinkName] = useState("");
  const [linkDesc, setLinkDesc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<Material | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true);
      setUploadError("");

      try {
        const response = await fetch("/api/materials");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load materials.");
        setItems(data.materials || []);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Could not load materials.");
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.desc.toLowerCase().includes(search.toLowerCase())
  );

  async function addLink() {
    if (!linkUrl.trim()) return;
    setUploading(true);
    setUploadError("");

    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: linkUrl.trim(),
          name: linkName.trim(),
          desc: linkDesc.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save link.");

      setItems((current) => [data.material, ...current]);
      setLinkUrl(""); setLinkName(""); setLinkDesc(""); setShowAddLink(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not save link.");
    } finally {
      setUploading(false);
    }
  }

  const processFile = useCallback(async (file: File) => {
    setUploading(true); setUploadError("");
    const category = getMaterialCategory(file.name, file.type);
    const localBlob = URL.createObjectURL(file);
    const tempItem: Material = {
      id: crypto.randomUUID(), category,
      name: file.name, url: localBlob, localBlob,
      desc: `Added ${new Date().toLocaleDateString()}`,
      size: formatMaterialSize(file.size),
      mimeType: file.type,
      addedAt: new Date().toISOString(),
    };
    const withTemp = [tempItem, ...items];
    setItems(withTemp);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const finalItems = withTemp.map(i => i.id === tempItem.id ? data.material : i);
      setItems(finalItems);
    } catch (err) {
      setUploadError(err instanceof Error
        ? err.message
        : "Upload failed.");
      setItems((current) => current.filter((item) => item.id !== tempItem.id));
    } finally {
      URL.revokeObjectURL(localBlob);
      setUploading(false);
    }
  }, [items]);

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  async function remove(id: string) {
    const previous = items;
    setItems(items.filter(i => i.id !== id));
    setUploadError("");

    try {
      const response = await fetch(`/api/materials/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not delete material.");
    } catch (error) {
      setItems(previous);
      setUploadError(error instanceof Error ? error.message : "Could not delete material.");
    }
  }

  const ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.csv,.png,.jpg,.jpeg,.webp,.gif,.svg,.mp3,.m4a,.wav,.ogg,.mp4,.mov,.webm";

  return (
    <div className="space-y-5"
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {preview && <PreviewModal item={preview} onClose={() => setPreview(null)} />}

      {/* Drop zone overlay */}
      {dragOver && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          style={{ background: "rgba(201,168,76,0.08)", border: "2px dashed rgba(201,168,76,0.5)" }}>
          <div className="bg-[#111827] border border-[#c9a84c]/40 rounded-2xl px-10 py-8 text-center">
            <Upload className="w-10 h-10 text-[#c9a84c] mx-auto mb-2" />
            <p className="text-white font-bold">Drop to upload</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8194]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search materials..."
            className="w-full bg-[#111827] border border-[#1f2b3e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 placeholder:text-[#7a8194]" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <input ref={fileRef} type="file" accept={ACCEPT} className="hidden" onChange={handleFileInput} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 bg-[#111827] border border-[#1f2b3e] hover:border-[#c9a84c]/40 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4 text-[#c9a84c]" />
            {uploading ? "Uploading…" : "Upload File"}
          </button>
          <button onClick={() => setShowAddLink(!showAddLink)}
            className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> Save Link
          </button>
        </div>
      </div>

      {/* Supported types hint */}
      <p className="text-[11px] text-[#7a8194]">
        Supports: PDF · Word · PowerPoint · Excel · Images · Audio · Video · Text · Markdown — or drag &amp; drop any file
      </p>

      {uploadError && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-300 flex gap-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{uploadError}</span>
        </div>
      )}

      {/* Add Link Form */}
      {showAddLink && (
        <div className="bg-[#111827] border border-[#c9a84c]/20 rounded-2xl p-5 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white">Save a Link</h3>
            <button onClick={() => setShowAddLink(false)} className="text-[#7a8194] hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..."
            className="w-full bg-[#0a0e1a] border border-[#1f2b3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 placeholder:text-[#7a8194]" />
          <input value={linkName} onChange={e => setLinkName(e.target.value)} placeholder="Label (optional)"
            className="w-full bg-[#0a0e1a] border border-[#1f2b3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 placeholder:text-[#7a8194]" />
          <input value={linkDesc} onChange={e => setLinkDesc(e.target.value)} placeholder="Why are you saving this?"
            className="w-full bg-[#0a0e1a] border border-[#1f2b3e] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 placeholder:text-[#7a8194]" />
          <button onClick={addLink} className="bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">Save Link</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 border-2 border-dashed border-[#1f2b3e] rounded-2xl">
          <p className="text-[#7a8194] font-medium">Loading your materials...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[#1f2b3e] rounded-2xl">
          <img src="/icon-bookmark.png" alt="" className="w-14 h-14 mx-auto opacity-20 mb-4" />
          <p className="text-[#7a8194] font-medium">No materials yet</p>
          <p className="text-[#7a8194]/60 text-sm mt-1">Upload a file or save a link to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id}
              className="bg-[#111827] border border-[#1f2b3e] hover:border-[#c9a84c]/30 rounded-2xl overflow-hidden transition-all group flex flex-col cursor-pointer"
              onClick={() => setPreview(item)}
            >
              {/* Image thumbnail */}
              {item.category === "image" && (
                <div className="h-36 overflow-hidden bg-[#080c16] relative">
                  <img src={item.localBlob || item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              {/* Video thumbnail */}
              {item.category === "video" && (
                <div className="h-36 bg-[#080c16] flex items-center justify-center relative">
                  <Play className="w-12 h-12 text-[#c9a84c]/40" />
                </div>
              )}
              {/* Audio waveform placeholder */}
              {item.category === "audio" && (
                <div className="h-20 bg-gradient-to-r from-[#0a0e1a] to-[#111827] flex items-center justify-center gap-1 px-6">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-1 rounded-full bg-[#c9a84c]/30" style={{ height: `${8 + Math.sin(i * 0.8) * 10 + Math.random() * 8}px` }} />
                  ))}
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <CategoryIcon cat={item.category} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-white truncate leading-tight">{item.name}</p>
                    <p className="text-[11px] text-[#c9a84c]/60 uppercase tracking-wider font-semibold mt-0.5">
                      {item.category}{item.size ? ` · ${item.size}` : ""}
                    </p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); remove(item.id); }}
                    className="opacity-0 group-hover:opacity-100 text-red-400/60 hover:text-red-400 transition-all shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {item.desc && <p className="text-xs text-[#7a8194] line-clamp-2 mt-1">{item.desc}</p>}
                <p className="text-xs text-[#c9a84c]/50 mt-auto pt-3 font-medium">
                  {item.category === "link" ? "Click to open" : item.category === "image" ? "Click to view" : item.category === "audio" ? "Click to play" : item.category === "video" ? "Click to watch" : "Click to open"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
