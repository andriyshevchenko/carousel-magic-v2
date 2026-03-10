import type { FontSet, Theme } from '../types';

// ── Rich inline text: **bold** renders in accent, `code` renders in code font ──

interface RichTextProps {
  text: string;
  theme: Theme;
  fontSet: FontSet;
  scale: number;
  fontSize: number;
}

export default function RichText({ text, theme, fontSet, scale, fontSize }: RichTextProps) {
  const parts = parseRichText(text);

  return (
    <span>
      {parts.map((p, i) => {
        if (p.type === 'bold') {
          return (
            <span key={i} style={{ color: theme.accent, fontWeight: 700 }}>{p.value}</span>
          );
        }
        if (p.type === 'code') {
          return (
            <span key={i} style={{
              fontFamily: `'${fontSet.code}', monospace`,
              fontSize: (fontSize - 2) * scale,
              background: `${theme.accent}18`,
              color: theme.accent,
              padding: `${1 * scale}px ${6 * scale}px`,
              borderRadius: 4 * scale,
              fontWeight: 500,
            }}>{p.value}</span>
          );
        }
        return <span key={i}>{p.value}</span>;
      })}
    </span>
  );
}

// ── Parse **bold** and `code` segments from plain text ──

interface TextSegment {
  type: 'plain' | 'bold' | 'code';
  value: string;
}

export function parseRichText(text: string): TextSegment[] {
  const parts: TextSegment[] = [];
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'plain', value: text.slice(lastIndex, match.index) });
    }
    if (match[2]) {
      parts.push({ type: 'bold', value: match[2] });
    } else if (match[3]) {
      parts.push({ type: 'code', value: match[3] });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'plain', value: text.slice(lastIndex) });
  }
  if (parts.length === 0) parts.push({ type: 'plain', value: text });
  return parts;
}
