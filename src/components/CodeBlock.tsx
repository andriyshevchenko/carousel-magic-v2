import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import { useEffect, useRef } from 'react';
import type { FontSet, Theme } from '../types';

interface CodeBlockProps {
  code: string;
  language: string;
  theme: Theme;
  fontSet: FontSet;
  caption?: string;
  scale: number;
}

const LANG_MAP: Record<string, string> = {
  csharp: 'csharp', cs: 'csharp', 'c#': 'csharp',
  javascript: 'javascript', js: 'javascript',
  typescript: 'typescript', ts: 'typescript',
  jsx: 'jsx', tsx: 'tsx',
  python: 'python', py: 'python',
  java: 'java', go: 'go', rust: 'rust',
  bash: 'bash', sh: 'bash', shell: 'bash',
  json: 'json', yaml: 'yaml', yml: 'yaml',
  css: 'css', sql: 'sql', html: 'markup', xml: 'markup',
};

function highlightCode(code: string, lang: string, syntax: Theme['syntax']): string {
  const prismLang = LANG_MAP[lang.toLowerCase()] || 'javascript';
  const grammar = Prism.languages[prismLang];
  if (!grammar) return escapeHtml(code);

  // Pre-process: protect C# 11 raw string literals (""" ... """) from being mis-tokenized
  const rawStringPlaceholders: string[] = [];
  let processedCode = code;
  if (prismLang === 'csharp') {
    processedCode = processedCode.replace(/"""[\s\S]*?"""/g, (match) => {
      const idx = rawStringPlaceholders.length;
      rawStringPlaceholders.push(match);
      return `"__RAW_STRING_${idx}__"`;
    });
  }

  let html = Prism.highlight(processedCode, grammar, prismLang);

  // Restore raw string literals with proper string colouring
  for (let i = 0; i < rawStringPlaceholders.length; i++) {
    const placeholder = `__RAW_STRING_${i}__`;
    const rawContent = escapeHtml(rawStringPlaceholders[i]);
    html = html.replace(
      new RegExp(`<span class="token string">"${placeholder}"</span>`, 'g'),
      `<span class="token string" style="color:${syntax.string}">${rawContent}</span>`,
    );
    // Fallback: if Prism didn't wrap it in a string token
    html = html.replace(
      new RegExp(`"${placeholder}"`, 'g'),
      `<span class="token string" style="color:${syntax.string}">${rawContent}</span>`,
    );
  }

  // Map Prism token classes to our theme colours
  // Use a regex that handles compound classes like "generic class-name", "constructor-invocation class-name"
  const tokenMap: Record<string, string> = {
    keyword: syntax.keyword,
    string: syntax.string,
    number: syntax.number,
    comment: syntax.comment,
    function: syntax.function,
    'function-variable': syntax.function,
    'class-name': syntax.type,
    builtin: syntax.type,
    boolean: syntax.number,
    operator: syntax.operator,
    punctuation: syntax.punctuation,
    tag: syntax.tag,
    'attr-name': syntax.attribute,
    'attr-value': syntax.string,
    variable: syntax.variable,
    property: syntax.variable,
    parameter: syntax.variable,
    constant: syntax.number,
    'template-string': syntax.string,
    'template-punctuation': syntax.operator,
    'interpolation-punctuation': syntax.operator,
    regex: syntax.string,
    'doc-comment': syntax.comment,
    prolog: syntax.comment,
    'namespace': syntax.type,
    'annotation': syntax.attribute,
    'decorator': syntax.attribute,
  };

  // Apply colours – match compound classes (e.g. "token generic class-name")
  for (const [cls, color] of Object.entries(tokenMap)) {
    // Match spans where cls appears anywhere in the class list after "token"
    const regex = new RegExp(`<span class="token(?:[^"]*\\s)${cls.replace(/-/g, '\\-')}"`, 'g');
    html = html.replace(regex, (match) => {
      if (match.includes('style=')) return match;
      return match + ` style="color:${color}"`;
    });
    // Also match exact "token cls" (original pattern)
    const exactRegex = new RegExp(`<span class="token ${cls.replace(/-/g, '\\-')}"`, 'g');
    html = html.replace(exactRegex, (match) => {
      if (match.includes('style=')) return match;
      return match + ` style="color:${color}"`;
    });
  }

  return html;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
        <div style={{ padding: `${codePadY}px ${codePadX}px`, overflowX: 'auto' }}>
          <pre
            ref={codeRef}
            style={{
              margin: 0,
              padding: 0,
              fontFamily: `'${fontSet.code}', 'Fira Code', monospace`,
              fontSize: `${fontSize}px`,
              lineHeight,
              color: theme.syntax.plain,
              whiteSpace: 'pre',
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
