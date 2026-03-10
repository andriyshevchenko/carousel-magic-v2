import { FONT_SETS } from '../data/fonts';
import { getTheme } from '../data/themes';
import type { CarouselConfig, FontSet, Slide, Theme } from '../types';
import CodeBlock from './CodeBlock';

interface SlideCanvasProps {
  slide: Slide;
  config: CarouselConfig;
  slideIndex: number;
  totalSlides: number;
  /** Real pixel width the canvas div is rendered at (for scaling) */
  renderWidth: number;
  /** If true, render at full 1080px for export */
  fullSize?: boolean;
}

export default function SlideCanvas({ slide, config, slideIndex, totalSlides, renderWidth, fullSize }: SlideCanvasProps) {
  const rawTheme = getTheme(config.themeId);
  const fontSet = FONT_SETS.find(f => f.id === config.fontSetId) ?? FONT_SETS[0];
  const [canvasW, canvasH] = config.format === '1080x1350' ? [1080, 1350] : [1080, 1080];
  const scale = fullSize ? 1 : renderWidth / canvasW;

  const w = fullSize ? canvasW : renderWidth;
  const h = fullSize ? canvasH : canvasH * scale;

  const isGradient = rawTheme.bg.startsWith('linear-gradient');

  // Derive a contrast-safe theme: ensure muted text is readable against the background
  const bgForContrast = isGradient ? '#1a1a2e' : rawTheme.bg; // approximate gradient bg for contrast calc
  const theme: typeof rawTheme = {
    ...rawTheme,
    muted: ensureContrast(rawTheme.muted, bgForContrast, 4),
  };

  return (
    <div
      className="slide-canvas"
      style={{
        width: w,
        height: h,
        position: 'relative',
        overflow: 'hidden',
        ...(isGradient
          ? { backgroundImage: theme.bg }
          : { backgroundColor: theme.bg }),
        fontFamily: `'${fontSet.body}', sans-serif`,
        color: theme.fg,
      }}
    >
      {/* Decorative subtle dot pattern for gradient themes */}
      {theme.patternOpacity && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${theme.fg} 0.5px, transparent 0.5px)`,
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          opacity: theme.patternOpacity,
          pointerEvents: 'none',
        }} />
      )}

      {/* ── Author badge (top-left) ── */}
      {config.showAuthorBadge && (
        <div style={{
          position: 'absolute',
          top: 28 * scale,
          left: 36 * scale,
          display: 'flex',
          alignItems: 'center',
          gap: 14 * scale,
          zIndex: 10,
        }}>
          <div style={{
            width: 60 * scale,
            height: 60 * scale,
            borderRadius: '50%',
            background: theme.accent,
            color: isLight(theme.accent) ? '#000' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: `'${fontSet.heading}', sans-serif`,
            fontSize: 22 * scale,
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}>
            {config.authorInitials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 * scale }}>
            {config.authorName && (
              <span style={{
                fontSize: 22 * scale,
                color: theme.fg,
                fontWeight: 700,
                fontFamily: `'${fontSet.heading}', sans-serif`,
                lineHeight: 1.2,
              }}>
                {config.authorName}
              </span>
            )}
            <span style={{
              fontSize: 17 * scale,
              color: theme.muted,
              fontWeight: 500,
              lineHeight: 1.2,
            }}>
              {config.authorHandle}
            </span>
          </div>
        </div>
      )}

      {/* ── Author handle (bottom-left) ── removed: duplicates top badge info */}

      {/* ── Slide content ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: (() => {
          const top = (config.showAuthorBadge ? 110 : 80) * scale;
          const sides = (slide.type === 'code' ? 48 : 60) * scale;
          const bottom = 100 * scale;
          return `${top}px ${sides}px ${bottom}px`;
        })(),
        overflow: 'hidden',
      }}>
        {slide.type === 'hook' && (
          <HookSlide slide={slide} theme={theme} fontSet={fontSet} scale={scale} />
        )}
        {slide.type === 'content' && (
          <ContentSlide slide={slide} theme={theme} fontSet={fontSet} scale={scale} />
        )}
        {slide.type === 'code' && (
          <CodeSlide slide={slide} theme={theme} fontSet={fontSet} scale={scale} />
        )}
        {slide.type === 'cta' && (
          <CtaSlide slide={slide} theme={theme} fontSet={fontSet} scale={scale} config={config} />
        )}
      </div>

      {/* ── Navigation dots (bottom center) ── */}
      {config.showNavDots && (
        <div style={{
          position: 'absolute',
          bottom: 28 * scale,
          left: '50%',
          zIndex: 10,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 8 * scale,
          alignItems: 'center',
        }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === slideIndex ? 26 * scale : 10 * scale,
                height: 10 * scale,
                borderRadius: 5 * scale,
                background: i === slideIndex ? theme.accent : `${theme.muted}55`,
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Slide number (bottom-right, offset for arrow button) ── */}
      {config.showSlideNumbers && (
        <div style={{
          position: 'absolute',
          bottom: 28 * scale,
          right: (config.showSwipeHint && slideIndex < totalSlides - 1) ? 100 * scale : 36 * scale,
          fontSize: 14 * scale,
          color: theme.muted,
          fontWeight: 500,
          fontFamily: `'${fontSet.body}', sans-serif`,
          opacity: 0.7,
          display: 'flex',
          alignItems: 'center',
          height: 52 * scale,          zIndex: 10,        }}>
          {slideIndex + 1}/{totalSlides}
        </div>
      )}

      {/* ── Swipe / Next button (hidden on last slide) ── */}
      {config.showSwipeHint && slideIndex < totalSlides - 1 && (
        <div style={{
          position: 'absolute',
          bottom: 28 * scale,
          right: 32 * scale,
          zIndex: 10,
          width: 52 * scale,
          height: 52 * scale,
          borderRadius: '50%',
          background: theme.accent,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 2px ${10 * scale}px ${theme.accent}44`,
        }}>
          <span style={{
            fontSize: 22 * scale,
            color: isLight(theme.accent) ? '#000' : '#fff',
            fontWeight: 700,
            lineHeight: 1,
            marginTop: -1 * scale,
          }}>→</span>
        </div>
      )}
    </div>
  );
}

/* ── Slide type components ─────────────────────────── */

function HookSlide({ slide, theme, fontSet, scale }: { slide: Slide; theme: Theme; fontSet: FontSet; scale: number }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: '86%' }}>
      <h1 style={{
        fontFamily: `'${fontSet.heading}', sans-serif`,
        fontSize: 84 * scale,
        fontWeight: 800,
        lineHeight: 1.08,
        color: brightenColor(theme.fg, 1.25),
        margin: 0,
        whiteSpace: 'pre-line',
      }}>
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: 34 * scale,
          color: theme.muted,
          marginTop: 28 * scale,
          lineHeight: 1.35,
          fontWeight: 400,
        }}>
          {slide.subtitle}
        </p>
      )}
      {/* Decorative accent line */}
      <div style={{
        width: 180 * scale,
        height: 6 * scale,
        borderRadius: 3 * scale,
        background: theme.accent,
        margin: `${28 * scale}px auto 0`,
      }} />
    </div>
  );
}

function ContentSlide({ slide, theme, fontSet, scale }: { slide: Slide; theme: Theme; fontSet: FontSet; scale: number }) {
  return (
    <div style={{ maxWidth: '88%', width: '100%' }}>
      {slide.title && (
        <h2 style={{
          fontFamily: `'${fontSet.heading}', sans-serif`,
          fontSize: 52 * scale,
          fontWeight: 700,
          color: theme.fg,
          margin: 0,
          marginBottom: 36 * scale,
          lineHeight: 1.15,
        }}>
          <span style={{ color: theme.accent, marginRight: 12 * scale }}>—</span>
          <RichText text={slide.title} theme={theme} fontSet={fontSet} scale={scale} fontSize={52} />
        </h2>
      )}
      {slide.body && (
        <div style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: 34 * scale,
          lineHeight: 1.55,
          color: theme.fg,
          whiteSpace: 'pre-line',
        }}>
          {slide.body.split('\n').map((line, i) => {
            const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14 * scale,
                marginBottom: 20 * scale,
              }}>
                {isBullet && (
                  <span style={{
                    color: theme.accent,
                    fontWeight: 700,
                    flexShrink: 0,
                    fontSize: 34 * scale,
                    lineHeight: '1.55',
                  }}>
                    ▸
                  </span>
                )}
                <span style={{ color: theme.fg }}>
                  <RichText text={isBullet ? line.replace(/^[•\-*]\s*/, '') : line} theme={theme} fontSet={fontSet} scale={scale} fontSize={34} />
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CodeSlide({ slide, theme, fontSet, scale }: { slide: Slide; theme: Theme; fontSet: FontSet; scale: number }) {
  return (
    <div style={{ width: '94%', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
      {/* Arbitrary text above the code block */}
      {slide.codeTextAbove && (
        <div style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: 28 * scale,
          lineHeight: 1.45,
          color: theme.fg,
          marginBottom: 18 * scale,
          overflow: 'hidden',
          maxHeight: 220 * scale,
          wordBreak: 'break-word' as const,
          overflowWrap: 'anywhere' as const,
          flexShrink: 1,
        }}>
          {slide.codeTextAbove.split('\n').map((line, i) => {
            const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
            const isHeading = line.startsWith('#');
            if (isHeading) {
              return (
                <div key={i} style={{
                  fontFamily: `'${fontSet.heading}', sans-serif`,
                  fontSize: 32 * scale,
                  fontWeight: 700,
                  color: theme.fg,
                  marginBottom: 12 * scale,
                  lineHeight: 1.2,
                }}>
                  <RichText text={line.replace(/^#+\s*/, '')} theme={theme} fontSet={fontSet} scale={scale} fontSize={32} />
                </div>
              );
            }
            if (isBullet) {
              const bulletText = line.replace(/^[•\-*]\s*/, '');
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12 * scale,
                  marginBottom: 8 * scale,
                  paddingLeft: 4 * scale,
                }}>
                  <span style={{
                    color: theme.accent,
                    fontWeight: 700,
                    flexShrink: 0,
                    fontSize: 26 * scale,
                    lineHeight: '1.45',
                  }}>▸</span>
                  <RichText text={bulletText} theme={theme} fontSet={fontSet} scale={scale} fontSize={28} />
                </div>
              );
            }
            if (!line.trim()) return <div key={i} style={{ height: 8 * scale }} />;
            return (
              <div key={i} style={{ marginBottom: 6 * scale }}>
                <RichText text={line} theme={theme} fontSet={fontSet} scale={scale} fontSize={28} />
              </div>
            );
          })}
        </div>
      )}
      <CodeBlock
        code={slide.code || ''}
        language={slide.codeLang || 'javascript'}
        theme={theme}
        fontSet={fontSet}
        caption={slide.codeCaption}
        scale={scale}
      />
      {/* Arbitrary text below the code block */}
      {slide.codeTextBelow && (
        <div style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: 24 * scale,
          lineHeight: 1.45,
          color: theme.muted,
          marginTop: 16 * scale,
          overflow: 'hidden',
          maxHeight: 120 * scale,
          wordBreak: 'break-word' as const,
          overflowWrap: 'anywhere' as const,
          flexShrink: 1,
        }}>
          {slide.codeTextBelow.split('\n').map((line, i) => {
            const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
            const isHeading = line.startsWith('#');
            if (isHeading) {
              return (
                <div key={i} style={{
                  fontFamily: `'${fontSet.heading}', sans-serif`,
                  fontSize: 26 * scale,
                  fontWeight: 700,
                  color: theme.fg,
                  marginBottom: 8 * scale,
                  lineHeight: 1.3,
                }}>
                  <RichText text={line.replace(/^#+\s*/, '')} theme={theme} fontSet={fontSet} scale={scale} fontSize={26} />
                </div>
              );
            }
            if (isBullet) {
              const bulletText = line.replace(/^[•\-*]\s*/, '');
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10 * scale,
                  marginBottom: 6 * scale,
                  paddingLeft: 4 * scale,
                }}>
                  <span style={{
                    color: theme.accent,
                    fontWeight: 700,
                    flexShrink: 0,
                    fontSize: 22 * scale,
                    lineHeight: '1.45',
                  }}>▸</span>
                  <RichText text={bulletText} theme={theme} fontSet={fontSet} scale={scale} fontSize={24} />
                </div>
              );
            }
            if (!line.trim()) return <div key={i} style={{ height: 6 * scale }} />;
            return (
              <div key={i} style={{ marginBottom: 4 * scale }}>
                <RichText text={line} theme={theme} fontSet={fontSet} scale={scale} fontSize={24} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CtaSlide({ slide, theme, fontSet, scale, config }: { slide: Slide; theme: Theme; fontSet: FontSet; scale: number; config: CarouselConfig }) {
  const socials = config.ctaSocials;
  return (
    <div style={{ textAlign: 'center', maxWidth: '85%' }}>
      <h2 style={{
        fontFamily: `'${fontSet.heading}', sans-serif`,
        fontSize: 64 * scale,
        fontWeight: 800,
        color: brightenColor(theme.fg, 1.2),
        margin: 0,
        lineHeight: 1.12,
        whiteSpace: 'pre-line',
      }}>
        {slide.title}
      </h2>
      {slide.body && (
        <p style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: 28 * scale,
          color: theme.muted,
          marginTop: 24 * scale,
          lineHeight: 1.4,
          fontWeight: 500,
        }}>
          {slide.body}
        </p>
      )}
      {/* Social references */}
      {(socials.linkedin || socials.twitter || socials.github || socials.website) && (
        <div style={{
          marginTop: 36 * scale,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14 * scale,
        }}>
          {[
            socials.linkedin && `🔗 ${socials.linkedin}`,
            socials.twitter && `𝕏 ${socials.twitter}`,
            socials.github && `⌨ ${socials.github}`,
            socials.website && `🌐 ${socials.website}`,
          ].filter(Boolean).map((s, i) => (
            <div key={i} style={{
              fontSize: 24 * scale,
              color: theme.accent,
              fontFamily: `'${fontSet.body}', sans-serif`,
              fontWeight: 500,
            }}>
              {s}
            </div>
          ))}
        </div>
      )}
      {/* Decorative accent line */}
      <div style={{
        width: 180 * scale,
        height: 6 * scale,
        borderRadius: 3 * scale,
        background: theme.accent,
        margin: `${32 * scale}px auto 0`,
      }} />
    </div>
  );
}

/* ── Rich inline text: **bold** renders in accent, `code` renders in code font ── */
function RichText({ text, theme, fontSet, scale, fontSize }: { text: string; theme: Theme; fontSet: FontSet; scale: number; fontSize: number }) {
  // Parse **bold**, `code`, and plain text segments
  const parts: { type: 'plain' | 'bold' | 'code'; value: string }[] = [];
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

/* ── Helpers ── */
function isLight(hex: string): boolean {
  if (hex.startsWith('linear') || hex.startsWith('rgba')) return false;
  const c = hex.replace('#', '');
  const r = Number.parseInt(c.substring(0, 2), 16);
  const g = Number.parseInt(c.substring(2, 4), 16);
  const b = Number.parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

/** Brighten a hex colour by a factor (1.0 = no change, 1.25 = 25% brighter). Clamps at #ffffff. */
function brightenColor(hex: string, factor: number): string {
  if (!hex.startsWith('#') || hex.length < 7) return hex;
  const c = hex.replace('#', '');
  const r = Math.min(255, Math.round(Number.parseInt(c.substring(0, 2), 16) * factor));
  const g = Math.min(255, Math.round(Number.parseInt(c.substring(2, 4), 16) * factor));
  const b = Math.min(255, Math.round(Number.parseInt(c.substring(4, 6), 16) * factor));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Compute relative luminance of a hex colour (0–1 scale). */
function luminance(hex: string): number {
  if (!hex.startsWith('#') || hex.length < 7) return 0;
  const c = hex.replace('#', '');
  const srgb = [
    Number.parseInt(c.substring(0, 2), 16) / 255,
    Number.parseInt(c.substring(2, 4), 16) / 255,
    Number.parseInt(c.substring(4, 6), 16) / 255,
  ].map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/** WCAG contrast ratio between two hex colours. */
function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Ensure muted text meets a minimum contrast ratio against the background.
 * If contrast is too low, progressively brighten (on dark bg) or darken (on light bg) until it meets the target.
 */
function ensureContrast(fgHex: string, bgHex: string, minRatio = 4): string {
  if (!fgHex.startsWith('#') || !bgHex.startsWith('#')) return fgHex;
  const ratio = contrastRatio(fgHex, bgHex);
  if (ratio >= minRatio) return fgHex;

  const bgIsLight = luminance(bgHex) > 0.5;
  let boosted = fgHex;
  for (let step = 0; step < 20; step++) {
    const factor = bgIsLight ? 1 - (step + 1) * 0.05 : 1 + (step + 1) * 0.08;
    boosted = bgIsLight ? darkenColor(fgHex, factor) : brightenColor(fgHex, factor);
    if (contrastRatio(boosted, bgHex) >= minRatio) break;
  }
  return boosted;
}

/** Darken a hex colour by a factor (0.9 = 10% darker). */
function darkenColor(hex: string, factor: number): string {
  if (!hex.startsWith('#') || hex.length < 7) return hex;
  const c = hex.replace('#', '');
  const r = Math.max(0, Math.round(Number.parseInt(c.substring(0, 2), 16) * factor));
  const g = Math.max(0, Math.round(Number.parseInt(c.substring(2, 4), 16) * factor));
  const b = Math.max(0, Math.round(Number.parseInt(c.substring(4, 6), 16) * factor));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
