import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Swiss-style thousands grouping ('), fixed instead of Intl('de-CH') to avoid
// server/client apostrophe glyph mismatch (straight ' vs curly ') that broke hydration.
export function formatCH(n: number) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}
