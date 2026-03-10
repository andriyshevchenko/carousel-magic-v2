import { useEffect, useRef } from 'react';
import type { FontSet, Theme } from '../types';
import { highlightCode } from '../utils/codeHighlight';

interface CodeBlockProps {
  code: string;
  language: string;
  theme: Theme;
  fontSet: FontSet;
  caption?: string;
  scale: number;
}

export default function CodeBlock({ code, language, theme, fontSet, caption, scale }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.innerHTML = highlightCode(code, language, theme.syntax);
    }
  }, [code, language, theme]);

  const s = scale;
  const dotSize = 12 * s;
  const dotGap = 8 * s;
  const headerPY = 12 * s;
  const headerPX = 16 * s;
  const codePadX = 26 * s;
  const codePadY = 28 * s;
  const fontSize = 24 * s;
  const lineHeight = 1.55;
  const borderRadius = 12 * s;
  const captionSize = 22 * s;

  return (
    <div style={{ width: '100%' }}>
      {/* ── Mac-style window chrome ── */}
      <div
        style={{
          background: theme.editorBg,
          borderRadius: `${borderRadius}px`,
          border: `1.5px solid ${theme.editorBorder}`,
          overflow: 'hidden',
          boxShadow: `0 ${12 * s}px ${32 * s}px rgba(0,0,0,0.35), 0 ${4 * s}px ${12 * s}px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)`,
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: `${headerPY}px ${headerPX}px`,
            background: theme.editorHeaderBg,
            borderBottom: `1px solid ${theme.editorBorder}`,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: `${dotGap}px`, alignItems: 'center' }}>
            <span style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: theme.trafficRed || '#FF5F57', display: 'inline-block' }} />
            <span style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: theme.trafficYellow || '#FEBC2E', display: 'inline-block' }} />
            <span style={{ width: dotSize, height: dotSize, borderRadius: '50%', background: theme.trafficGreen || '#28C840', display: 'inline-block' }} />
          </div>
          {/* File tab */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            color: theme.editorHeaderFg,
            fontFamily: `'${fontSet.code}', monospace`,
            fontSize: `${16 * s}px`,
            letterSpacing: '0.03em',
          }}>
            {language ? `main.${langExt(language)}` : 'untitled'}
          </div>
          {/* Spacer for symmetry */}
          <div style={{ width: dotSize * 3 + dotGap * 2 }} />
        </div>

        {/* Code area */}
        <div style={{ padding: `${codePadY}px ${codePadX}px` }}>
          <pre
            ref={codeRef}
            style={{
              margin: 0,
              padding: 0,
              fontFamily: `'${fontSet.code}', 'Fira Code', monospace`,
              fontSize: `${fontSize}px`,
              lineHeight,
              color: theme.syntax.plain,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              background: 'transparent',
              tabSize: 4,
            }}
          />
        </div>
      </div>

      {/* ── Caption ── */}
      {caption && (
        <div style={{
          marginTop: `${10 * s}px`,
          textAlign: 'center',
          color: theme.muted,
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: `${captionSize}px`,
          lineHeight: 1.4,
          fontStyle: 'italic',
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

function langExt(lang: string): string {
  const map: Record<string, string> = {
    javascript: 'js', typescript: 'ts', csharp: 'cs', python: 'py',
    java: 'java', go: 'go', rust: 'rs', bash: 'sh', json: 'json',
    yaml: 'yml', css: 'css', sql: 'sql', html: 'html', jsx: 'jsx', tsx: 'tsx',
  };
  return map[lang.toLowerCase()] || lang;
}
