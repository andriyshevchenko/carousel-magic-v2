import { memo } from 'react';
import { FONT_SETS } from '../data/fonts';
import { getTheme } from '../data/themes';
import { BANNER_HEIGHT, BANNER_WIDTH, type BannerConfig } from '../types/banner';
import { brightenColor } from '../utils/colors';
import { isGradient, resolveTheme } from '../utils/slideLayout';

interface BannerCanvasProps {
  readonly config: BannerConfig;
  /** Rendered width in pixels; height auto-computed to maintain 4:1 ratio */
  readonly renderWidth: number;
  /** If true, render at full 1584px for export */
  readonly fullSize?: boolean;
}

function BannerCanvas({ config, renderWidth, fullSize }: BannerCanvasProps) {
  const rawTheme = getTheme(config.themeId);
  const fontSet = FONT_SETS.find(f => f.id === config.fontSetId) ?? FONT_SETS[0];
  const theme = resolveTheme(rawTheme);
  const accentColor = config.accentColorOverride || theme.accent;

  const scale = fullSize ? 1 : renderWidth / BANNER_WIDTH;
  const w = fullSize ? BANNER_WIDTH : renderWidth;
  const h = fullSize ? BANNER_HEIGHT : Math.round(BANNER_HEIGHT * scale);

  const gradientBg = isGradient(theme.bg);

  // Safe zone: profile pic overlaps bottom-left ~220px from left, ~80px from bottom
  // Keep critical text away from that zone

  return (
    <div
      className="banner-canvas"
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
      {/* Decorative elements based on layout */}
      {config.showDecoration && <Decorations layoutId={config.layoutId} theme={theme} accentColor={accentColor} scale={scale} />}

      {/* Layout-specific content */}
      {config.layoutId === 'centered' && (
        <CenteredLayout config={config} theme={theme} fontSet={fontSet} accentColor={accentColor} scale={scale} />
      )}
      {config.layoutId === 'left-aligned' && (
        <LeftAlignedLayout config={config} theme={theme} fontSet={fontSet} accentColor={accentColor} scale={scale} />
      )}
      {config.layoutId === 'split' && (
        <SplitLayout config={config} theme={theme} fontSet={fontSet} accentColor={accentColor} scale={scale} />
      )}
      {config.layoutId === 'minimal' && (
        <MinimalLayout config={config} theme={theme} fontSet={fontSet} accentColor={accentColor} scale={scale} />
      )}
      {config.layoutId === 'gradient-wave' && (
        <GradientWaveLayout config={config} theme={theme} fontSet={fontSet} accentColor={accentColor} scale={scale} />
      )}
      {config.layoutId === 'tech-grid' && (
        <TechGridLayout config={config} theme={theme} fontSet={fontSet} accentColor={accentColor} scale={scale} />
      )}
      {config.layoutId === 'newsletter' && (
        <NewsletterLayout config={config} theme={theme} fontSet={fontSet} accentColor={accentColor} scale={scale} />
      )}
      {config.layoutId === 'brand-promo' && (
        <BrandPromoLayout config={config} theme={theme} fontSet={fontSet} accentColor={accentColor} scale={scale} />
      )}
    </div>
  );
}

export default memo(BannerCanvas);

// ═══════════════════════════════════════════════════════════
//  Shared types
// ═══════════════════════════════════════════════════════════

interface LayoutProps {
  readonly config: BannerConfig;
  readonly theme: ReturnType<typeof resolveTheme>;
  readonly fontSet: (typeof FONT_SETS)[number];
  readonly accentColor: string;
  readonly scale: number;
}

interface DecorationProps {
  readonly layoutId: string;
  readonly theme: ReturnType<typeof resolveTheme>;
  readonly accentColor: string;
  readonly scale: number;
}

// ═══════════════════════════════════════════════════════════
//  Highlighted headline helper
// ═══════════════════════════════════════════════════════════

/** Renders headline text with `highlightWord` colored in accent */
function HighlightedText({ text, highlightWord, accentColor }: {
  readonly text: string;
  readonly highlightWord: string;
  readonly accentColor: string;
}) {
  if (!highlightWord || !text.includes(highlightWord)) {
    return <>{text}</>;
  }
  const parts = text.split(highlightWord);
  return (
    <>
      {parts.map((part, i) => (
        <span key={part + String(i)}>
          {part}
          {i < parts.length - 1 && (
            <span style={{ color: accentColor }}>{highlightWord}</span>
          )}
        </span>
      ))}
    </>
  );
}

// ═══════════════════════════════════════════════════════════
//  CTA Button component
// ═══════════════════════════════════════════════════════════

function CTAButton({ text, accentColor, theme, scale, variant = 'filled' }: {
  readonly text: string;
  readonly accentColor: string;
  readonly theme: LayoutProps['theme'];
  readonly scale: number;
  readonly variant?: 'filled' | 'outline' | 'inverted';
}) {
  if (!text) return null;

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6 * scale,
    fontSize: 14 * scale,
    fontWeight: 700,
    padding: `${8 * scale}px ${20 * scale}px`,
    borderRadius: 8 * scale,
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap' as const,
  };

  if (variant === 'filled') {
    return (
      <span style={{
        ...base,
        backgroundColor: accentColor,
        color: '#fff',
        boxShadow: `0 2px 8px ${accentColor}40`,
      }}>
        {text}
      </span>
    );
  }

  if (variant === 'outline') {
    return (
      <span style={{
        ...base,
        backgroundColor: 'transparent',
        color: accentColor,
        border: `2px solid ${accentColor}`,
      }}>
        {text}
      </span>
    );
  }

  // inverted
  return (
    <span style={{
      ...base,
      backgroundColor: theme.bg,
      color: theme.fg,
      border: `2px solid ${theme.fg}30`,
    }}>
      {text}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
//  Tag pill component
// ═══════════════════════════════════════════════════════════

function TagPill({ tag, accentColor, theme, scale, variant = 'filled' }: {
  readonly tag: string;
  readonly accentColor: string;
  readonly theme: LayoutProps['theme'];
  readonly scale: number;
  readonly variant?: 'filled' | 'outline' | 'subtle';
}) {
  const baseStyles: React.CSSProperties = {
    fontSize: 13 * scale,
    padding: `${4 * scale}px ${12 * scale}px`,
    borderRadius: 20 * scale,
    fontWeight: 600,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap' as const,
  };

  if (variant === 'filled') {
    return (
      <span style={{
        ...baseStyles,
        backgroundColor: accentColor + '25',
        color: accentColor,
        border: `1px solid ${accentColor}40`,
      }}>
        {tag}
      </span>
    );
  }

  if (variant === 'outline') {
    return (
      <span style={{
        ...baseStyles,
        backgroundColor: 'transparent',
        color: theme.muted,
        border: `1px solid ${theme.muted}60`,
      }}>
        {tag}
      </span>
    );
  }

  // subtle
  return (
    <span style={{
      ...baseStyles,
      backgroundColor: theme.fg + '10',
      color: theme.fg + 'cc',
    }}>
      {tag}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
//  Decorations
// ═══════════════════════════════════════════════════════════

function Decorations({ layoutId, theme, accentColor, scale }: DecorationProps) {
  return (
    <>
      {/* Subtle dot pattern */}
      {(layoutId === 'centered' || layoutId === 'tech-grid') && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(${theme.fg}15 1px, transparent 1px)`,
          backgroundSize: `${24 * scale}px ${24 * scale}px`,
          opacity: 0.4,
          pointerEvents: 'none',
        }} />
      )}

      {/* Accent glow - top right */}
      {(layoutId === 'centered' || layoutId === 'gradient-wave') && (
        <div style={{
          position: 'absolute',
          top: -60 * scale,
          right: 100 * scale,
          width: 400 * scale,
          height: 400 * scale,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Accent glow - bottom left */}
      {(layoutId === 'left-aligned' || layoutId === 'split') && (
        <div style={{
          position: 'absolute',
          bottom: -80 * scale,
          left: -40 * scale,
          width: 350 * scale,
          height: 350 * scale,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Horizontal accent line */}
      {(layoutId === 'minimal' || layoutId === 'left-aligned') && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4 * scale,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)`,
          pointerEvents: 'none',
        }} />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════
//  Layout: Centered
// ═══════════════════════════════════════════════════════════

function CenteredLayout({ config, theme, fontSet, accentColor, scale }: LayoutProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${40 * scale}px ${80 * scale}px`,
      textAlign: 'center',
      gap: 12 * scale,
    }}>
      {/* Emoji accent */}
      {config.accentEmoji && (
        <div style={{ fontSize: 36 * scale, marginBottom: 4 * scale }}>
          {config.accentEmoji}
        </div>
      )}

      {/* Headline */}
      <h1 style={{
        fontFamily: `'${fontSet.heading}', sans-serif`,
        fontSize: 42 * scale,
        fontWeight: 800,
        lineHeight: 1.15,
        color: theme.fg,
        letterSpacing: '-0.02em',
        margin: 0,
      }}>
        {config.headline}
      </h1>

      {/* Tagline */}
      {config.tagline && (
        <p style={{
          fontSize: 18 * scale,
          color: theme.muted,
          lineHeight: 1.4,
          margin: 0,
          maxWidth: 800 * scale,
        }}>
          {config.tagline}
        </p>
      )}

      {/* Accent divider */}
      <div style={{
        width: 60 * scale,
        height: 3 * scale,
        borderRadius: 2 * scale,
        backgroundColor: accentColor,
        margin: `${4 * scale}px 0`,
      }} />

      {/* Tags */}
      {config.tags.length > 0 && (
        <div style={{
          display: 'flex',
          gap: 8 * scale,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {config.tags.map(tag => (
            <TagPill key={tag} tag={tag} accentColor={accentColor} theme={theme} scale={scale} />
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  Layout: Left Aligned
// ═══════════════════════════════════════════════════════════

function LeftAlignedLayout({ config, theme, fontSet, accentColor, scale }: LayoutProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      padding: `${40 * scale}px ${80 * scale}px`,
    }}>
      {/* Left content */}
      <div style={{
        flex: '0 0 65%',
        display: 'flex',
        flexDirection: 'column',
        gap: 14 * scale,
      }}>
        {/* Accent bar + emoji */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 * scale }}>
          <div style={{
            width: 4 * scale,
            height: 32 * scale,
            borderRadius: 2 * scale,
            backgroundColor: accentColor,
          }} />
          {config.accentEmoji && (
            <span style={{ fontSize: 28 * scale }}>{config.accentEmoji}</span>
          )}
        </div>

        <h1 style={{
          fontFamily: `'${fontSet.heading}', sans-serif`,
          fontSize: 40 * scale,
          fontWeight: 800,
          lineHeight: 1.15,
          color: theme.fg,
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          {config.headline}
        </h1>

        {config.tagline && (
          <p style={{
            fontSize: 17 * scale,
            color: theme.muted,
            lineHeight: 1.4,
            margin: 0,
          }}>
            {config.tagline}
          </p>
        )}

        {config.tags.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 8 * scale,
            flexWrap: 'wrap',
          }}>
            {config.tags.map(tag => (
              <TagPill key={tag} tag={tag} accentColor={accentColor} theme={theme} scale={scale} />
            ))}
          </div>
        )}
      </div>

      {/* Right decorative area */}
      <div style={{
        flex: '0 0 35%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.15,
      }}>
        <div style={{
          fontSize: 120 * scale,
          lineHeight: 1,
        }}>
          {config.accentEmoji || '{ }'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  Layout: Split
// ═══════════════════════════════════════════════════════════

function SplitLayout({ config, theme, fontSet, accentColor, scale }: LayoutProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
    }}>
      {/* Left section - accent background */}
      <div style={{
        flex: '0 0 40%',
        backgroundColor: accentColor + '18',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `${40 * scale}px ${48 * scale}px`,
        borderRight: `2px solid ${accentColor}30`,
      }}>
        {config.accentEmoji && (
          <div style={{ fontSize: 40 * scale, marginBottom: 12 * scale }}>
            {config.accentEmoji}
          </div>
        )}
        <h1 style={{
          fontFamily: `'${fontSet.heading}', sans-serif`,
          fontSize: 38 * scale,
          fontWeight: 800,
          lineHeight: 1.2,
          color: theme.fg,
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          {config.headline}
        </h1>
      </div>

      {/* Right section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `${40 * scale}px ${60 * scale}px`,
        gap: 16 * scale,
      }}>
        {config.tagline && (
          <p style={{
            fontSize: 18 * scale,
            color: theme.muted,
            lineHeight: 1.5,
            margin: 0,
          }}>
            {config.tagline}
          </p>
        )}

        {/* Divider */}
        <div style={{
          width: 40 * scale,
          height: 3 * scale,
          borderRadius: 2 * scale,
          backgroundColor: accentColor,
        }} />

        {config.tags.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 8 * scale,
            flexWrap: 'wrap',
          }}>
            {config.tags.map(tag => (
              <TagPill key={tag} tag={tag} accentColor={accentColor} theme={theme} scale={scale} variant="outline" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  Layout: Minimal
// ═══════════════════════════════════════════════════════════

function MinimalLayout({ config, theme, fontSet, accentColor, scale }: LayoutProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${40 * scale}px ${120 * scale}px`,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10 * scale,
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: `'${fontSet.heading}', sans-serif`,
          fontSize: 44 * scale,
          fontWeight: 300,
          lineHeight: 1.2,
          color: theme.fg,
          letterSpacing: '0.04em',
          margin: 0,
          textTransform: 'uppercase' as const,
        }}>
          {config.headline}
        </h1>

        {config.tagline && (
          <p style={{
            fontSize: 16 * scale,
            color: theme.muted,
            lineHeight: 1.4,
            margin: 0,
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}>
            {config.tagline}
          </p>
        )}

        {config.tags.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 16 * scale,
            marginTop: 8 * scale,
          }}>
            {config.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 12 * scale,
                color: theme.muted,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  Layout: Gradient Wave
// ═══════════════════════════════════════════════════════════

function GradientWaveLayout({ config, theme, fontSet, accentColor, scale }: LayoutProps) {
  const accentAlt = theme.accentAlt || brightenColor(accentColor, 30);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
    }}>
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, ${accentColor}15 0%, transparent 50%, ${accentAlt}15 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Wave SVG decoration */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 80 * scale,
          opacity: 0.15,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1584 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C264,80 528,0 792,40 C1056,80 1320,0 1584,40 L1584,80 L0,80 Z"
          fill={accentColor}
        />
      </svg>

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        padding: `${40 * scale}px ${80 * scale}px`,
        gap: 40 * scale,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14 * scale,
          flex: 1,
        }}>
          {config.accentEmoji && (
            <div style={{ fontSize: 32 * scale }}>{config.accentEmoji}</div>
          )}

          <h1 style={{
            fontFamily: `'${fontSet.heading}', sans-serif`,
            fontSize: 42 * scale,
            fontWeight: 800,
            lineHeight: 1.15,
            color: theme.fg,
            letterSpacing: '-0.02em',
            margin: 0,
            background: `linear-gradient(135deg, ${theme.fg}, ${accentColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {config.headline}
          </h1>

          {config.tagline && (
            <p style={{
              fontSize: 18 * scale,
              color: theme.muted,
              lineHeight: 1.4,
              margin: 0,
            }}>
              {config.tagline}
            </p>
          )}

          {config.tags.length > 0 && (
            <div style={{
              display: 'flex',
              gap: 8 * scale,
              flexWrap: 'wrap',
            }}>
              {config.tags.map(tag => (
                <TagPill key={tag} tag={tag} accentColor={accentColor} theme={theme} scale={scale} variant="subtle" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  Layout: Tech Grid
// ═══════════════════════════════════════════════════════════

function TechGridLayout({ config, theme, fontSet, accentColor, scale }: LayoutProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
    }}>
      {/* Grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(${accentColor}10 1px, transparent 1px),
          linear-gradient(90deg, ${accentColor}10 1px, transparent 1px)
        `,
        backgroundSize: `${40 * scale}px ${40 * scale}px`,
        pointerEvents: 'none',
      }} />

      {/* Code-style decorative brackets */}
      <div style={{
        position: 'absolute',
        top: 30 * scale,
        right: 60 * scale,
        fontSize: 80 * scale,
        fontFamily: `'${fontSet.code}', monospace`,
        color: accentColor + '15',
        fontWeight: 700,
        lineHeight: 1,
        pointerEvents: 'none',
      }}>
        {'{ }'}
      </div>

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        padding: `${40 * scale}px ${80 * scale}px`,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14 * scale,
        }}>
          {/* Terminal-style prefix */}
          <div style={{
            fontFamily: `'${fontSet.code}', monospace`,
            fontSize: 14 * scale,
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            gap: 8 * scale,
          }}>
            <span style={{ opacity: 0.6 }}>$</span>
            <span>whoami</span>
          </div>

          <h1 style={{
            fontFamily: `'${fontSet.heading}', sans-serif`,
            fontSize: 40 * scale,
            fontWeight: 800,
            lineHeight: 1.15,
            color: theme.fg,
            letterSpacing: '-0.01em',
            margin: 0,
          }}>
            {config.headline}
          </h1>

          {config.tagline && (
            <div style={{
              fontFamily: `'${fontSet.code}', monospace`,
              fontSize: 15 * scale,
              color: theme.muted,
              lineHeight: 1.4,
            }}>
              <span style={{ color: accentColor + '80' }}>{'// '}</span>
              {config.tagline}
            </div>
          )}

          {config.tags.length > 0 && (
            <div style={{
              display: 'flex',
              gap: 6 * scale,
              flexWrap: 'wrap',
              marginTop: 4 * scale,
            }}>
              <span style={{
                fontFamily: `'${fontSet.code}', monospace`,
                fontSize: 13 * scale,
                color: accentColor + '80',
              }}>
                {'['}
              </span>
              {config.tags.map(tag => (
                <span key={tag} style={{
                  fontFamily: `'${fontSet.code}', monospace`,
                  fontSize: 13 * scale,
                  padding: `${3 * scale}px ${10 * scale}px`,
                  backgroundColor: accentColor + '15',
                  color: accentColor,
                  borderRadius: 4 * scale,
                  border: `1px solid ${accentColor}30`,
                }}>
                  "{tag}"
                </span>
              ))}
              <span style={{
                fontFamily: `'${fontSet.code}', monospace`,
                fontSize: 13 * scale,
                color: accentColor + '80',
              }}>
                {']'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  Layout: Newsletter (influencer-style)
// ═══════════════════════════════════════════════════════════

function NewsletterLayout({ config, theme, fontSet, accentColor, scale }: LayoutProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      padding: `${36 * scale}px ${80 * scale}px`,
    }}>
      {/* Author name + website (top-left) */}
      {(config.authorName || config.authorWebsite) && (
        <div style={{
          position: 'absolute',
          top: 24 * scale,
          left: 60 * scale,
          display: 'flex',
          alignItems: 'center',
          gap: 8 * scale,
          fontSize: 14 * scale,
          color: theme.muted,
          fontStyle: 'italic',
        }}>
          {config.authorName && <span>{config.authorName}</span>}
          {config.authorName && config.authorWebsite && (
            <span style={{ color: accentColor }}>→</span>
          )}
          {config.authorWebsite && (
            <span style={{ color: theme.fg + 'cc' }}>{config.authorWebsite}</span>
          )}
        </div>
      )}

      {/* Main content - right-biased like reference banners */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10 * scale,
        marginLeft: '25%',
      }}>
        {/* Tags as category line */}
        {config.tags.length > 0 && (
          <div style={{
            fontSize: 13 * scale,
            color: accentColor,
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}>
            {config.tags.join(' | ')}
          </div>
        )}

        {/* Headline with highlighted word */}
        <h1 style={{
          fontFamily: `'${fontSet.heading}', sans-serif`,
          fontSize: 38 * scale,
          fontWeight: 900,
          lineHeight: 1.15,
          color: theme.fg,
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          <HighlightedText text={config.headline} highlightWord={config.highlightWord} accentColor={accentColor} />
        </h1>

        {/* Social proof + tagline row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10 * scale,
          flexWrap: 'wrap',
        }}>
          {config.socialProof && (
            <span style={{
              fontSize: 13 * scale,
              fontWeight: 700,
              padding: `${3 * scale}px ${10 * scale}px`,
              borderRadius: 4 * scale,
              backgroundColor: accentColor + '20',
              color: accentColor,
              border: `1px solid ${accentColor}40`,
            }}>
              {config.socialProof}
            </span>
          )}
          {config.tagline && (
            <span style={{
              fontSize: 15 * scale,
              color: theme.muted,
              lineHeight: 1.4,
            }}>
              {config.tagline}
            </span>
          )}
        </div>

        {/* CTA button */}
        {config.ctaButtonText && (
          <div style={{ marginTop: 4 * scale }}>
            <CTAButton text={config.ctaButtonText} accentColor={accentColor} theme={theme} scale={scale} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  Layout: Brand Promo (bold uppercase style)
// ═══════════════════════════════════════════════════════════

function BrandPromoLayout({ config, theme, fontSet, accentColor, scale }: LayoutProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
    }}>
      {/* Geometric decoration (like the blue .NET banner) */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '35%',
          height: '100%',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
        viewBox="0 0 400 400"
        preserveAspectRatio="xMaxYMid slice"
      >
        <polygon points="200,0 400,100 350,400 100,350" fill={theme.fg} />
        <polygon points="300,50 400,200 380,400 250,300" fill={accentColor} opacity="0.5" />
        <polygon points="100,0 250,50 200,200 50,150" fill={theme.fg} opacity="0.3" />
      </svg>

      {/* Content */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: `${30 * scale}px ${120 * scale}px`,
        gap: 10 * scale,
      }}>
        {/* Bold uppercase headline */}
        <h1 style={{
          fontFamily: `'${fontSet.heading}', sans-serif`,
          fontSize: 40 * scale,
          fontWeight: 900,
          lineHeight: 1.2,
          color: theme.fg,
          letterSpacing: '0.04em',
          textTransform: 'uppercase' as const,
          margin: 0,
        }}>
          <HighlightedText text={config.headline} highlightWord={config.highlightWord} accentColor={accentColor} />
        </h1>

        {/* Tagline (em-dash prefix like reference) */}
        {config.tagline && (
          <p style={{
            fontSize: 16 * scale,
            fontWeight: 700,
            color: theme.fg,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            margin: 0,
            opacity: 0.8,
          }}>
            — {config.tagline}
          </p>
        )}

        {/* Pipe-separated tags */}
        {config.tags.length > 0 && (
          <div style={{
            fontSize: 14 * scale,
            color: theme.muted,
            letterSpacing: '0.03em',
            marginTop: 4 * scale,
          }}>
            {config.tags.join(' | ')}
          </div>
        )}

        {/* CTA button */}
        {config.ctaButtonText && (
          <div style={{ marginTop: 8 * scale }}>
            <CTAButton text={config.ctaButtonText} accentColor={accentColor} theme={theme} scale={scale} variant="inverted" />
          </div>
        )}
      </div>
    </div>
  );
}
