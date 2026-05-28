const YOUTUBE_EMBED_BASE = "https://www.youtube.com/embed";

function extractYouTubeVideoId(url: string): string | null {
  const value = url.trim();
  if (!value) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
    return value;
  }

  try {
    const parsed = new URL(value);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const videoId = parsed.searchParams.get("v");
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      const marker = parts[0];
      if (["embed", "shorts", "live", "v"].includes(marker)) {
        const id = parts[1];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function toYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;

  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  return `${YOUTUBE_EMBED_BASE}/${videoId}?rel=0&modestbranding=1`;
}

