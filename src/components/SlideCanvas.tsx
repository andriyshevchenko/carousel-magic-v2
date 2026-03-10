import { FONT_SETS } from '../data/fonts';
import { getTheme } from '../data/themes';
import type { CarouselConfig, FontSet, Slide, Theme } from '../types';
import { brightenColor, isLight } from '../utils/colors';
import { getCanvasDimensions, isGradient, resolveTheme } from '../utils/slideLayout';
import CodeBlock from './CodeBlock';
import RichText from './RichText';
import TextBlock from './TextBlock';
import type { TextBlockSizes } from './TextBlock';

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
  const [canvasW, canvasH] = getCanvasDimensions(config.format);
  const scale = fullSize ? 1 : renderWidth / canvasW;

  const w = fullSize ? canvasW : renderWidth;
  const h = fullSize ? canvasH : canvasH * scale;

  const gradientBg = isGradient(rawTheme.bg);
  const theme = resolveTheme(rawTheme);

  return (
    <div
      className="slide-canvas"
      style={{
        width: w,
        height: h,
        position: 'relative',
        overflow: 'hidden',
        ...(gradientBg
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
          <CodeSlide slide={slide} theme={theme} fontSet={fontSet} scale={scale} isTall={config.format === '1080x1350'} />
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

const CONTENT_TEXT_SIZES: TextBlockSizes = {
  heading: 52,
  body: 34,
  bullet: 34,
  headingGap: 28,
  bulletGap: 20,
  lineGap: 20,
  emptyLineHeight: 10,
};

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
          <TextBlock
            text={slide.body}
            theme={theme}
            fontSet={fontSet}
            scale={scale}
            sizes={CONTENT_TEXT_SIZES}
          />
        </div>
      )}
    </div>
  );
}

function CodeSlide({ slide, theme, fontSet, scale, isTall }: { slide: Slide; theme: Theme; fontSet: FontSet; scale: number; isTall: boolean }) {
  // Format-adaptive typography: larger on 1080×1350, smaller on 1080×1080
  const aboveSizes: TextBlockSizes = {
    heading: isTall ? 52 : 42,
    body: isTall ? 34 : 30,
    bullet: isTall ? 32 : 28,
    headingGap: isTall ? 28 : 20,
    bulletGap: isTall ? 16 : 12,
    lineGap: 6,
    emptyLineHeight: 8,
  };
  const belowSizes: TextBlockSizes = {
    heading: aboveSizes.body - 2,
    body: aboveSizes.body - 4,
    bullet: aboveSizes.bullet - 4,
    headingGap: 8,
    bulletGap: 6,
    lineGap: 4,
    emptyLineHeight: 6,
  };
  const maxTextHeight = isTall ? 340 : 240;
  const textToCodeGap = isTall ? 32 : 24;

  return (
    <div style={{ width: '94%', display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>
      {/* Text above the code block */}
      {slide.codeTextAbove && (
        <div style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: aboveSizes.body * scale,
          lineHeight: 1.45,
          color: theme.fg,
          marginBottom: textToCodeGap * scale,
          overflow: 'hidden',
          maxHeight: maxTextHeight * scale,
          wordBreak: 'break-word' as const,
          overflowWrap: 'anywhere' as const,
          flexShrink: 1,
        }}>
          <TextBlock text={slide.codeTextAbove} theme={theme} fontSet={fontSet} scale={scale} sizes={aboveSizes} />
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
      {/* Text below the code block */}
      {slide.codeTextBelow && (
        <div style={{
          fontFamily: `'${fontSet.body}', sans-serif`,
          fontSize: belowSizes.body * scale,
          lineHeight: 1.45,
          color: theme.muted,
          marginTop: 16 * scale,
          overflow: 'hidden',
          maxHeight: (isTall ? 160 : 120) * scale,
          wordBreak: 'break-word' as const,
          overflowWrap: 'anywhere' as const,
          flexShrink: 1,
        }}>
          <TextBlock text={slide.codeTextBelow} theme={theme} fontSet={fontSet} scale={scale} sizes={belowSizes} color={theme.muted} />
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

