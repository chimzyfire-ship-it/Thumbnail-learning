export type FileCategory = "image" | "pdf" | "text" | "office" | "audio" | "video" | "link" | "other";

export function getMaterialCategory(filename: string, mime = ""): FileCategory {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext) || mime.startsWith("image/")) return "image";
  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (["txt", "md", "csv"].includes(ext) || mime.startsWith("text/")) return "text";
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext)) return "office";
  if (["mp3", "m4a", "wav", "ogg", "aac"].includes(ext) || mime.startsWith("audio/")) return "audio";
  if (["mp4", "mov", "webm", "avi", "mkv"].includes(ext) || mime.startsWith("video/")) return "video";

  return "other";
}

export function formatMaterialSize(bytes?: number | null) {
  if (!bytes) return undefined;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}
