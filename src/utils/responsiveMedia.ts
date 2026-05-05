const CANDIDATE_WIDTHS = [480, 768, 1080, 1440, 2000];

export function buildDerivedSrcSet(url?: string | null, format: 'webp' | 'avif' = 'webp'): string | undefined {
  if (!url) return undefined;

  // Expected upload URL: /uploads/derived/<assetId>-w<width>.webp
  const m = url.match(/^\/uploads\/derived\/(.+)-w\d+\.(webp|avif)$/i);
  if (!m) return undefined;

  const assetId = m[1];
  return CANDIDATE_WIDTHS
    .map((w) => `/uploads/derived/${assetId}-w${w}.${format} ${w}w`)
    .join(', ');
}

export function defaultResponsiveSizes(kind: 'hero' | 'product' = 'product'): string {
  if (kind === 'hero') return '(max-width: 768px) 100vw, 100vw';
  return '(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw';
}
