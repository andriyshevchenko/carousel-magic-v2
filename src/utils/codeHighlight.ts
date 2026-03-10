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
import type { Theme } from '../types';

export const LANG_MAP: Record<string, string> = {
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

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlightCode(code: string, lang: string, syntax: Theme['syntax']): string {
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
