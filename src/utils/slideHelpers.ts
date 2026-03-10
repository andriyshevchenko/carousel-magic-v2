import type { Slide } from '../types';

/** Short human-readable label for a slide (used in sidebar list). */
export function slideLabel(s: Slide): string {
  const typeEmoji = { hook: '🎯', content: '📝', code: '💻', cta: '📢' };
  const title = s.title ? s.title.split('\n')[0].slice(0, 30) : s.code ? s.code.split('\n')[0].slice(0, 30) : 'Untitled';
  return `${typeEmoji[s.type]} ${title}`;
}
