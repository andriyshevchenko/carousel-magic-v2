import type { Theme, FontSet, Slide, SlideFormat, CarouselConfig } from '../types';
import { getTheme } from '../data/themes';
import { FONT_SETS } from '../data/fonts';
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
  const theme = getTheme(config.themeId);
  const fontSet = FONT_SETS.find(f => f.id === config.fontSetId) ?? FONT_SETS[0];
  const [canvasW, canvasH] = config.format === '1080x1350' ? [1080, 1350] : [1080, 1080];
  const scale = fullSize ? 1 : renderWidth / canvasW;

  const w = fullSize ? canvasW : renderWidth;
  const h = fullSize ? canvasH : canvasH * scale;

  const isGradient = theme.bg.startsWith('linear-gradient');

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

      {/* ── Author handle (bottom-left) ── */}
      {config.showAuthorBadge && (
        <div style={{
          position: 'absolute',
          bottom: 24 * scale,
          left: 36 * scale,
          fontSize: 15 * scale,
          color: theme.muted,
          fontWeight: 500,
          fontFamily: `'${fontSet.body}', sans-serif`,
          opacity: 0.5,
          display: 'flex',
          alignItems: 'center',
          height: 52 * scale,
        }}>
          {config.authorHandle}
        </div>
      )}

      {/* ── Slide content ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: slide.type === 'code'
          ? `${80 * scale}px ${32 * scale}px ${50 * scale}px`
          : `${80 * scale}px ${60 * scale}px ${60 * scale}px`,
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
          bottom: 30 * scale,
          left: '50%',
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
          bottom: 24 * scale,
          right: config.showSwipeHint ? 100 * scale : 36 * scale,
          fontSize: 14 * scale,
          color: theme.muted,
          fontWeight: 500,
          fontFamily: `'${fontSet.body}', sans-serif`,
          opacity: 0.5,
          display: 'flex',
          alignItems: 'center',
          height: 52 * scale,
        }}>
          {slideIndex + 1}/{totalSlides}
        </div>
      )}

      {/* ── Swipe / Next button (bottom-right, all slides) ── */}
      {config.showSwipeHint && (
        <div style={{
          position: 'absolute',
          bottom: 24 * scale,
          right: 32 * scale,
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
    <div style={{ textAlign: 'center', maxWidth: '88%' }}>
      <h1 style={{
        fontFamily: `'${fontSet.heading}', sans-serif`,
        fontSize: 60 * scale,
        fontWeight: 800,
        lineHeight: 1.12,
        color: theme.fg,
        margin: 0,
        whiteSpace: 'pre-line',
      }}>
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: 26 * scale,
          color: theme.muted,
          marginTop: 22 * scale,
          lineHeight: 1.4,
          fontWeight: 400,
        }}>
          {slide.subtitle}
        </p>
      )}
      {/* Decorative accent line */}
      <div style={{
        width: 60 * scale,
        height: 4 * scale,
        borderRadius: 2 * scale,
        background: theme.accent,
        margin: `${24 * scale}px auto 0`,
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
          fontSize: 38 * scale,
          fontWeight: 700,
          color: theme.fg,
          margin: 0,
          marginBottom: 28 * scale,
          lineHeight: 1.2,
        }}>
          <span style={{ color: theme.accent, marginRight: 8 * scale }}>—</span>
          {slide.title}
        </h2>
      )}
      {slide.body && (
        <div style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: 22 * scale,
          lineHeight: 1.7,
          color: theme.fg,
          whiteSpace: 'pre-line',
        }}>
          {slide.body.split('\n').map((line, i) => {
            const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12 * scale,
                marginBottom: 12 * scale,
              }}>
                {isBullet && (
                  <span style={{
                    color: theme.accent,
                    fontWeight: 700,
                    flexShrink: 0,
                    fontSize: 22 * scale,
                    lineHeight: '1.7',
                  }}>
                    ▸
                  </span>
                )}
                <span style={{ color: isBullet ? theme.fg : theme.fg }}>
                  {isBullet ? line.replace(/^[•\-*]\s*/, '') : line}
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
          fontSize: 20 * scale,
          lineHeight: 1.5,
          color: theme.fg,
          marginBottom: 16 * scale,
          overflow: 'hidden',
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
                  fontSize: 22 * scale,
                  fontWeight: 700,
                  color: theme.fg,
                  marginBottom: 10 * scale,
                  lineHeight: 1.3,
                }}>
                  <RichText text={line.replace(/^#+\s*/, '')} theme={theme} fontSet={fontSet} scale={scale} fontSize={22} />
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
                    fontSize: 18 * scale,
                    lineHeight: '1.5',
                  }}>▸</span>
                  <RichText text={bulletText} theme={theme} fontSet={fontSet} scale={scale} fontSize={20} />
                </div>
              );
            }
            if (!line.trim()) return <div key={i} style={{ height: 6 * scale }} />;
            return (
              <div key={i} style={{ marginBottom: 6 * scale }}>
                <RichText text={line} theme={theme} fontSet={fontSet} scale={scale} fontSize={20} />
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
          fontSize: 18 * scale,
          lineHeight: 1.5,
          color: theme.muted,
          marginTop: 14 * scale,
          overflow: 'hidden',
          maxHeight: 100 * scale,
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
                  fontSize: 20 * scale,
                  fontWeight: 700,
                  color: theme.fg,
                  marginBottom: 8 * scale,
                  lineHeight: 1.3,
                }}>
                  <RichText text={line.replace(/^#+\s*/, '')} theme={theme} fontSet={fontSet} scale={scale} fontSize={20} />
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
                    fontSize: 18 * scale,
                    lineHeight: '1.5',
                  }}>▸</span>
                  <RichText text={bulletText} theme={theme} fontSet={fontSet} scale={scale} fontSize={18} />
                </div>
              );
            }
            if (!line.trim()) return <div key={i} style={{ height: 4 * scale }} />;
            return (
              <div key={i} style={{ marginBottom: 4 * scale }}>
                <RichText text={line} theme={theme} fontSet={fontSet} scale={scale} fontSize={18} />
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
        fontSize: 44 * scale,
        fontWeight: 800,
        color: theme.fg,
        margin: 0,
        lineHeight: 1.2,
        whiteSpace: 'pre-line',
      }}>
        {slide.title}
      </h2>
      {slide.body && (
        <p style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: 20 * scale,
          color: theme.muted,
          marginTop: 20 * scale,
          lineHeight: 1.5,
        }}>
          {slide.body}
        </p>
      )}
      {/* Social references */}
      {(socials.linkedin || socials.twitter || socials.github || socials.website) && (
        <div style={{
          marginTop: 32 * scale,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10 * scale,
        }}>
          {[
            socials.linkedin && `🔗 ${socials.linkedin}`,
            socials.twitter && `𝕏 ${socials.twitter}`,
            socials.github && `⌨ ${socials.github}`,
            socials.website && `🌐 ${socials.website}`,
          ].filter(Boolean).map((s, i) => (
            <div key={i} style={{
              fontSize: 16 * scale,
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
        width: 60 * scale,
        height: 4 * scale,
        borderRadius: 2 * scale,
        background: theme.accent,
        margin: `${28 * scale}px auto 0`,
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
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}
