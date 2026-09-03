// Injects Cloudinary delivery transforms (auto format/quality + resize) into an
// existing delivery URL. Non-Cloudinary URLs (e.g. Unsplash fallbacks) pass through
// unchanged. Fixes oversized originals being shipped to small thumbnails/cards.
export function cldUrl(url: string, width: number): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_fill,w_${width}/`);
}
