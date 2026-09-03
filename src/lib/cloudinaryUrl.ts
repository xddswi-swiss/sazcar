// Injects Cloudinary delivery transforms (auto format/quality + resize) into an
// existing delivery URL. Non-Cloudinary URLs (e.g. Unsplash fallbacks) pass through
// unchanged. Fixes oversized originals being shipped to small thumbnails/cards.
export function cldUrl(url: string, width: number): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_fill,w_${width}/`);
}

// srcset for large, viewport-scaling images (full-bleed galleries) so mobile
// doesn't download the same wide asset needed only on desktop.
export function cldSrcSet(url: string, widths: number[]): string | undefined {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return undefined;
  return widths.map((w) => `${cldUrl(url, w)} ${w}w`).join(', ');
}
