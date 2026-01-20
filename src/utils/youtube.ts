/**
 * YouTube Video Extraction Utilities
 * Extracts YouTube video information from MDX/markdown content
 * Used for generating VideoSchema structured data for SEO
 */

export interface YouTubeVideoInfo {
  id: string;
  embedUrl: string;
  watchUrl: string;
  thumbnailUrl: string;
}

/**
 * Extract YouTube video ID from various URL formats or raw ID
 * Supports:
 * - Raw video ID: dQw4w9WgXcQ
 * - Standard URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - Short URL: https://youtu.be/dQw4w9WgXcQ
 * - Embed URL: https://www.youtube.com/embed/dQw4w9WgXcQ
 * - Shorts URL: https://youtube.com/shorts/dQw4w9WgXcQ
 * - No-cookie embed: https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;

  // Clean the input
  const cleaned = input.trim();

  // If it's already just an ID (11 characters, alphanumeric with - and _)
  if (/^[\w-]{11}$/.test(cleaned)) {
    return cleaned;
  }

  // Try to extract from various URL patterns
  const patterns = [
    // Standard watch URL: youtube.com/watch?v=ID
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([\w-]{11})/,
    // Short URL: youtu.be/ID
    /youtu\.be\/([\w-]{11})/,
    // Embed URL: youtube.com/embed/ID or youtube-nocookie.com/embed/ID
    /youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/,
    // Shorts URL: youtube.com/shorts/ID
    /youtube\.com\/shorts\/([\w-]{11})/,
    // Live URL: youtube.com/live/ID
    /youtube\.com\/live\/([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract all YouTube video IDs from MDX/markdown content
 * Looks for patterns like:
 * - <YouTube id="..." />
 * - <YouTube id='...' />
 * - <YouTube id={`...`} />
 */
export function extractYouTubeVideosFromContent(content: string): YouTubeVideoInfo[] {
  if (!content) return [];

  const videos: YouTubeVideoInfo[] = [];
  const seen = new Set<string>();

  // Pattern to match <YouTube id="..." /> component usage
  // Handles: id="...", id='...', id={`...`}
  const patterns = [
    /<YouTube\s+[^>]*id\s*=\s*["']([^"']+)["']/gi,
    /<YouTube\s+[^>]*id\s*=\s*\{`([^`]+)`\}/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const rawId = match[1];
      const videoId = extractYouTubeId(rawId);

      if (videoId && !seen.has(videoId)) {
        seen.add(videoId);
        videos.push(createVideoInfo(videoId));
      }
    }
  }

  return videos;
}

/**
 * Create full video info object from video ID
 */
export function createVideoInfo(videoId: string): YouTubeVideoInfo {
  return {
    id: videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

/**
 * Get high-quality thumbnail URL for a video
 * YouTube provides multiple thumbnail sizes:
 * - default.jpg (120x90)
 * - mqdefault.jpg (320x180)
 * - hqdefault.jpg (480x360)
 * - sddefault.jpg (640x480)
 * - maxresdefault.jpg (1280x720) - may not exist for all videos
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'hq'
): string {
  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  };
  return `https://i.ytimg.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
