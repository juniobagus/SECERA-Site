export function applyCdn(url?: string | null, cdnBase?: string | null): string | undefined {
  if (!url) return undefined;
  const base = (cdnBase || '').trim().replace(/\/+$/, '');
  if (!base) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (!url.startsWith('/')) return `${base}/${url}`;
  return `${base}${url}`;
}
