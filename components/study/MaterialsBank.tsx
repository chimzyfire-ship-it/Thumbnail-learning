"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, FileText, Link as LinkIcon, X, ExternalLink,
  Upload, Search, Play, Music, FileSpreadsheet, AlertTriangle,
  Loader2, RefreshCw, CheckCircle2,
} from "lucide-react";
import { formatMaterialSize, getMaterialCategory, type FileCategory } from "@/lib/materials";
import { createClient } from "@/lib/supabase/client";
import { checkDatabaseConnection, isOnline } from "@/lib/sync-manager";

// ── Offline IndexedDB Helpers ────────────────────────────────────────────────

const DB_NAME = "aethel_offline_db";
const STORE_NAME = "materials";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveLocalFile(id: string, file: File): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, file });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getLocalFile(id: string): Promise<File | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result?.file || null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

async function deleteLocalFile(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {}
}

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
  local?: boolean;
}

interface PendingFile {
  id: string;
  file: File;
  name: string;
  size: string;
  category: FileCategory;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
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
        <div className="flex items-center gap-3 border-b border-[#1f2b3e] px-3.5 py-3.5 sm:px-5">
          <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
            <CategoryIcon cat={item.category} className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white text-sm truncate">{item.name}</p>
            <p className="text-[11px] text-[#7a8194] uppercase tracking-wider">{item.category}{item.size ? ` · ${item.size}` : ""}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a href={src} download={item.category !== "link" ? item.name : undefined}
              target={item.category === "link" ? "_blank" : undefined} rel="noopener noreferrer"
              className="phone-tap flex items-center gap-1.5 rounded-lg border border-[#1f2b3e] bg-[#111827] px-2.5 py-1.5 text-xs font-semibold text-[#c9a84c] transition-colors hover:border-[#c9a84c]/40 sm:px-3">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{item.category === "link" ? "Open" : "Download"}</span>
            </a>
            <button onClick={onClose}
              className="phone-tap flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2b3e] bg-[#111827] text-[#7a8194] transition-colors hover:text-white sm:h-8 sm:w-8">
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
              <p className="text-center text-lg font-bold text-white">{item.name}</p>
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
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<Material | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pending files list state
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  // Hydrate local files from IndexedDB
  const loadOfflineMaterials = useCallback(async () => {
    const localData = localStorage.getItem("aethel_materials");
    if (localData) {
      try {
        const parsed: Material[] = JSON.parse(localData);
        const hydrated = await Promise.all(parsed.map(async (item) => {
          if (item.local) {
            const fileBlob = await getLocalFile(item.id);
            if (fileBlob) {
              const objectUrl = URL.createObjectURL(fileBlob);
              return { ...item, url: objectUrl, localBlob: objectUrl };
            }
          }
          return item;
        }));
        setItems(hydrated);
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, []);

  // background sync helper: uploads local IndexedDB file to Supabase when active connectivity is restored
  const uploadLocalToCloud = useCallback(async (localItem: Material, file: File) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const storagePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("study-materials")
        .upload(storagePath, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data: signedData, error: signedError } = await supabase.storage
        .from("study-materials")
        .createSignedUrl(uploadData.path, 60 * 60);

      if (signedError) throw new Error(signedError.message);

      const { data: materialData, error: dbError } = await supabase
        .from("study_materials")
        .insert({
          user_id: user.id,
          category: localItem.category,
          name: file.name,
          description: localItem.desc,
          storage_path: uploadData.path,
          mime_type: file.type || null,
          size_bytes: file.size,
        })
        .select("id, category, name, description, mime_type, size_bytes, created_at")
        .single();

      if (dbError) {
        await supabase.storage.from("study-materials").remove([uploadData.path]);
        throw new Error(dbError.message);
      }

      const syncedMaterial: Material = {
        id: materialData.id,
        category: materialData.category as FileCategory,
        name: materialData.name,
        url: signedData.signedUrl,
        desc: materialData.description || "",
        size: formatMaterialSize(materialData.size_bytes),
        mimeType: materialData.mime_type || undefined,
        addedAt: materialData.created_at,
      };

      setItems(prev => {
        const updated = prev.map(i => i.id === localItem.id ? syncedMaterial : i);
        localStorage.setItem("aethel_materials", JSON.stringify(updated.map(i => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { localBlob, ...rest } = i;
          return rest;
        })));
        return updated;
      });

      await deleteLocalFile(localItem.id);
      if (localItem.localBlob) {
        URL.revokeObjectURL(localItem.localBlob);
      }
      console.log(`Material '${file.name}' synced successfully to Supabase in background.`);
    } catch (err) {
      console.warn(`Failed to background sync '${file.name}':`, err);
    }
  }, []);

  // Fetch materials on mount and register background sync listener
  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true);
      setUploadError("");

      try {
        const response = await fetch("/api/materials");
        const data = await response.json();
        
        if (!response.ok) {
          console.warn("Supabase database not fully migrated, falling back to local storage:", data.error);
          await loadOfflineMaterials();
        } else {
          setItems(data.materials || []);
        }
      } catch (error) {
        console.warn("Network error or server error, falling back to local storage:", error);
        await loadOfflineMaterials();
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [loadOfflineMaterials]);

  // Background Sync Event Listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnlineSync = async () => {
      if (!isOnline()) return;
      
      const dbConnected = await checkDatabaseConnection();
      if (!dbConnected) return;

      console.log("Database online, checking for offline materials to sync...");
      const localData = localStorage.getItem("aethel_materials");
      if (localData) {
        try {
          const parsed: Material[] = JSON.parse(localData);
          const unsyncedItems = parsed.filter(item => item.local);
          if (unsyncedItems.length > 0) {
            console.log(`Auto-syncing ${unsyncedItems.length} materials in background...`);
            for (const item of unsyncedItems) {
              const fileBlob = await getLocalFile(item.id);
              if (fileBlob) {
                await uploadLocalToCloud(item, fileBlob);
              }
            }
          }
        } catch {}
      }
    };

    window.addEventListener("online", handleOnlineSync);
    // Trigger optimistic background check on load
    handleOnlineSync();

    return () => {
      window.removeEventListener("online", handleOnlineSync);
    };
  }, [uploadLocalToCloud]);

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.desc.toLowerCase().includes(search.toLowerCase())
  );

  async function addLink() {
    if (!linkUrl.trim()) return;
    setUploadError("");

    const newLinkItem: Material = {
      id: crypto.randomUUID(),
      category: "link",
      name: linkName.trim() || linkUrl.trim(),
      url: linkUrl.trim(),
      desc: linkDesc.trim() || `Saved on ${new Date().toLocaleDateString()}`,
      addedAt: new Date().toISOString(),
    };

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
      
      if (!response.ok) {
        console.warn("Supabase database save failed, falling back to local storage:", data.error);
        setItems(current => {
          const updated = [newLinkItem, ...current];
          localStorage.setItem("aethel_materials", JSON.stringify(updated.map(i => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { localBlob, ...rest } = i;
            return rest;
          })));
          return updated;
        });
      } else {
        setItems((current) => [data.material, ...current]);
      }
      setLinkUrl(""); setLinkName(""); setLinkDesc(""); setShowAddLink(false);
    } catch (error) {
      console.warn("Network error, falling back to local storage:", error);
      setItems(current => {
        const updated = [newLinkItem, ...current];
        localStorage.setItem("aethel_materials", JSON.stringify(updated.map(i => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { localBlob, ...rest } = i;
          return rest;
        })));
        return updated;
      });
      setLinkUrl(""); setLinkName(""); setLinkDesc(""); setShowAddLink(false);
    }
  }

  // Handle direct-to-Supabase upload for a pending file with automatic offline fallback
  const savePendingFile = async (pendingId: string) => {
    const pendingItem = pendingFiles.find(p => p.id === pendingId);
    if (!pendingItem) return;

    setPendingFiles(prev => prev.map(p => p.id === pendingId ? { ...p, status: "uploading", error: undefined } : p));

    try {
      const { file, category } = pendingItem;
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to save materials.");

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const storagePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      // 1. Direct browser-to-Supabase Storage upload - avoids all Next.js server payload limits & timeouts!
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("study-materials")
        .upload(storagePath, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload file to storage.");
      }

      // 2. Obtain a signed URL for secure, temporary browser access
      const { data: signedData, error: signedError } = await supabase.storage
        .from("study-materials")
        .createSignedUrl(uploadData.path, 60 * 60);

      if (signedError) {
        throw new Error(signedError.message || "Failed to generate signed URL.");
      }

      // 3. Save file metadata directly to user's database records
      const { data: materialData, error: dbError } = await supabase
        .from("study_materials")
        .insert({
          user_id: user.id,
          category,
          name: file.name,
          description: `Added ${new Date().toLocaleDateString()}`,
          storage_path: uploadData.path,
          mime_type: file.type || null,
          size_bytes: file.size,
        })
        .select("id, category, name, description, mime_type, size_bytes, created_at")
        .single();

      if (dbError) {
        await supabase.storage.from("study-materials").remove([uploadData.path]);
        throw new Error(dbError.message || "Failed to save file metadata.");
      }

      const newMaterial: Material = {
        id: materialData.id,
        category: materialData.category as FileCategory,
        name: materialData.name,
        url: signedData.signedUrl,
        desc: materialData.description || "",
        size: formatMaterialSize(materialData.size_bytes),
        mimeType: materialData.mime_type || undefined,
        addedAt: materialData.created_at,
      };

      // Add to active materials and clear from pending
      setItems(prev => [newMaterial, ...prev]);
      setPendingFiles(prev => prev.filter(p => p.id !== pendingId));
    } catch (err) {
      // Offline / Missing Table Fallback!
      console.warn("Direct upload failed, saving to local browser storage:", err);
      try {
        const { file, category } = pendingItem;
        const objectUrl = URL.createObjectURL(file);
        
        // Save binary file blob to IndexedDB
        await saveLocalFile(pendingItem.id, file);

        const newLocalMaterial: Material = {
          id: pendingItem.id,
          category,
          name: file.name,
          url: objectUrl,
          localBlob: objectUrl,
          desc: `Saved locally on ${new Date().toLocaleDateString()}`,
          size: pendingItem.size,
          mimeType: file.type,
          addedAt: new Date().toISOString(),
          local: true,
        };

        setItems(prev => {
          const updated = [newLocalMaterial, ...prev];
          localStorage.setItem("aethel_materials", JSON.stringify(updated.map(i => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { localBlob, ...rest } = i;
            return rest;
          })));
          return updated;
        });

        // Remove from pending list
        setPendingFiles(prev => prev.filter(p => p.id !== pendingId));
      } catch (fallbackErr) {
        const errMsg = fallbackErr instanceof Error ? fallbackErr.message : "Save failed.";
        setPendingFiles(prev => prev.map(p => p.id === pendingId ? { ...p, status: "error", error: errMsg } : p));
      }
    }
  };

  // Upload all idle/error pending files in parallel
  const saveAllPending = async () => {
    const targets = pendingFiles.filter(p => p.status === "idle" || p.status === "error");
    await Promise.all(targets.map(p => savePendingFile(p.id)));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPendings: PendingFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const category = getMaterialCategory(file.name, file.type);
        newPendings.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: formatMaterialSize(file.size) || "0 KB",
          category,
          status: "idle",
        });
      }
      setPendingFiles(prev => [...prev, ...newPendings]);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      const newPendings: PendingFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const category = getMaterialCategory(file.name, file.type);
        newPendings.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: formatMaterialSize(file.size) || "0 KB",
          category,
          status: "idle",
        });
      }
      setPendingFiles(prev => [...prev, ...newPendings]);
    }
  };

  async function remove(id: string) {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    setUploadError("");

    const targetItem = items.find(i => i.id === id);
    if (targetItem?.local) {
      localStorage.setItem("aethel_materials", JSON.stringify(updated.map(i => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { localBlob, ...rest } = i;
        return rest;
      })));
      await deleteLocalFile(id);
      if (targetItem.localBlob) {
        URL.revokeObjectURL(targetItem.localBlob);
      }
      return;
    }

    try {
      const response = await fetch(`/api/materials/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not delete material.");
    } catch (error) {
      console.warn("Could not delete from server, updating local copy:", error);
      // Update local storage copy
      localStorage.setItem("aethel_materials", JSON.stringify(updated.map(i => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { localBlob, ...rest } = i;
        return rest;
      })));
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8194]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search materials..."
            className="w-full bg-[#111827] border border-[#1f2b3e] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a84c]/40 placeholder:text-[#7a8194]" />
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          <input ref={fileRef} type="file" accept={ACCEPT} multiple className="hidden" onChange={handleFileInput} />
          <button onClick={() => fileRef.current?.click()}
            className="phone-tap flex items-center justify-center gap-2 rounded-xl border border-[#1f2b3e] bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-[#c9a84c]/40">
            <Upload className="w-4 h-4 text-[#c9a84c]" />
            Add Files
          </button>
          <button onClick={() => setShowAddLink(!showAddLink)}
            className="phone-tap flex items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-4 py-2.5 text-sm font-bold text-[#0a0e1a] transition-colors hover:bg-[#d4b95e]">
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
        <div className="phone-card space-y-3 rounded-2xl border border-[#c9a84c]/20 bg-[#111827] p-4 animate-in slide-in-from-top-2 duration-200 sm:p-5">
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
          <button onClick={addLink} className="phone-tap w-full rounded-xl bg-[#c9a84c] px-6 py-2.5 text-sm font-bold text-[#0a0e1a] transition-colors hover:bg-[#d4b95e] sm:w-auto">Save Link</button>
        </div>
      )}

      {/* ── PENDING UPLOADS AREA ── */}
      {pendingFiles.length > 0 && (
        <div className="bg-[#111827]/80 border border-[#c9a84c]/20 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex shrink-0 flex-col gap-3 border-b border-[#1f2b3e] pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Ready to Save</h3>
              <p className="text-xs text-[#7a8194] mt-0.5">These files won&apos;t disappear—click Save to store them securely in your account.</p>
            </div>
            {pendingFiles.filter(p => p.status === "idle" || p.status === "error").length > 1 && (
              <button onClick={saveAllPending}
                className="phone-tap flex items-center justify-center gap-1.5 rounded-xl bg-[#c9a84c] px-4 py-2 text-xs font-bold text-[#0a0e1a] shadow-md transition-colors hover:bg-[#d4b95e]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save All ({pendingFiles.filter(p => p.status === "idle" || p.status === "error").length})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingFiles.map(pending => {
              const isUploading = pending.status === "uploading";
              const isError = pending.status === "error";

              return (
                <div key={pending.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#1f2b3e] bg-[#0a0e1a] p-3.5 transition-all hover:border-[#c9a84c]/20 sm:flex-row sm:items-center sm:justify-between sm:gap-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 text-[#c9a84c] animate-spin" />
                      ) : (
                        <CategoryIcon cat={pending.category} className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-white truncate leading-tight pr-2">{pending.name}</p>
                      <p className="text-[10px] text-[#7a8194] uppercase tracking-wider font-semibold mt-1">
                        {pending.category} · {pending.size}
                      </p>
                      {isError && pending.error && (
                        <p className="text-[10px] text-red-400 font-medium mt-0.5 truncate max-w-[200px]" title={pending.error}>
                          {pending.error}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                    {!isUploading ? (
                      <>
                        <button onClick={() => savePendingFile(pending.id)}
                          className="bg-[#c9a84c] hover:bg-[#d4b95e] text-[#0a0e1a] font-black px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-sm flex items-center gap-1">
                          {isError ? <RefreshCw className="w-3.5 h-3.5" /> : null}
                          {isError ? "Retry" : "Save"}
                        </button>
                        <button onClick={() => setPendingFiles(prev => prev.filter(p => p.id !== pending.id))}
                          className="phone-tap flex h-9 w-9 items-center justify-center rounded-lg border border-[#1f2b3e] text-[#7a8194] transition-colors hover:text-white sm:h-7 sm:w-7">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-bold text-[#c9a84c] animate-pulse pr-2">Saving…</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <div key={item.id}
              className="phone-card group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#1f2b3e] bg-[#111827] transition-all hover:border-[#c9a84c]/30"
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
                    <p className="font-semibold text-sm text-white truncate leading-tight pr-2">{item.name}</p>
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
