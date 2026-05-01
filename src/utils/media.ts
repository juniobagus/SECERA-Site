export function getGoogleDriveFileId(input: string): string | null {
  const url = (input || '').trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host !== 'drive.google.com' && !host.endsWith('.drive.google.com')) return null;

    const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    const id = fileMatch?.[1] || parsed.searchParams.get('id');
    return id || null;
  } catch {
    return null;
  }
}

export function getGoogleDrivePreviewUrl(input: string): string | null {
  const id = getGoogleDriveFileId(input);
  if (!id) return null;
  // Uses Drive's embedded player (works even when direct download is blocked).
  return `https://drive.google.com/file/d/${id}/preview`;
}

export function normalizeVideoUrl(input: string): string {
  const url = (input || '').trim();
  if (!url) return '';

  // Keep Google Drive links as-is here; they often block direct hotlinking (403 HTML).
  // For Drive, prefer `getGoogleDrivePreviewUrl()` (iframe) on the UI.
  if (getGoogleDriveFileId(url)) return url;

  return url;
}
