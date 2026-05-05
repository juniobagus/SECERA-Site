export function buildDerivedSrcSet(url?: string | null, _format: 'webp' | 'avif' = 'webp'): string | undefined {
  if (!url) return undefined;

  // Expected upload URL: /uploads/derived/<assetId>-w<width>.webp
  const m = url.match(/^\/uploads\/derived\/(.+)-w(\d+)\.(webp|avif)$/i);
  if (!m) return undefined;
  // NOTE:
  // We previously inferred multiple widths from a single URL. After slot-based
  // processing, generated widths are profile-specific and not safely inferable
  // from filename alone, causing 404s. Return undefined until variant arrays
  // are fully wired through CMS/storefront.
  return undefined;
}

export function defaultResponsiveSizes(kind: 'hero' | 'product' = 'product'): string {
  if (kind === 'hero') return '(max-width: 768px) 100vw, 100vw';
  return '(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw';
}
