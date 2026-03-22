import { getYouTubeVideoId } from "@/lib/utils";
import { YoutubeTranscript } from "youtube-transcript";

export interface YouTubeMetadata {
  videoId: string;
  title: string;
  thumbnail: string;
  description?: string;
}

export async function getYouTubeMetadata(
  url: string
): Promise<YouTubeMetadata | null> {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
    const response = await fetch(oembedUrl);
    if (!response.ok) return null;

    const data = await response.json();

    // Try to fetch description from watch page
    let description = "";
    try {
      const pageRes = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
      });
      const html = await pageRes.text();
      // Extract description from meta tag
      const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
      if (descMatch) {
        description = descMatch[1]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
      }
      // Also try to extract from JSON-LD
      if (!description) {
        const jsonLdMatch = html.match(/"shortDescription"\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (jsonLdMatch) {
          description = JSON.parse(`"${jsonLdMatch[1]}"`);
        }
      }
    } catch {
      // Description fetch is best-effort
    }

    return {
      videoId,
      title: data.title || "Untitled Video",
      thumbnail: `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/maxresdefault.jpg`,
      description: description || undefined,
    };
  } catch {
    return {
      videoId,
      title: "YouTube Video",
      thumbnail: `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/maxresdefault.jpg`,
    };
  }
}

export async function getYouTubeTranscript(
  url: string
): Promise<string | null> {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  try {
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    if (!transcriptItems || transcriptItems.length === 0) return null;
    return transcriptItems.map((t) => t.text).join(" ");
  } catch (error) {
    console.error("[YouTube] Failed to fetch transcript:", error);
    return null;
  }
}
