import type { FontSet, Theme } from '../types';
import RichText from './RichText';

// ── Shared multi-line text renderer for bullets, headings, and plain text ──
// Used by ContentSlide body, CodeSlide codeTextAbove/codeTextBelow.

export interface TextBlockSizes {
  heading: number;
  body: number;
  bullet: number;
  headingGap: number;
  bulletGap: number;
  lineGap: number;
  emptyLineHeight: number;
}

interface TextBlockProps {
  text: string;
  theme: Theme;
  fontSet: FontSet;
  scale: number;
  sizes: TextBlockSizes;
  /** Override text colour (e.g. muted for below-code text) */
  color?: string;
}

/** Check if a line starts with a bullet marker (•, -, *). */
function isBulletLine(line: string): boolean {
  return /^[•\-*]\s/.test(line);
}

/** Strip the leading bullet marker from a line. */
function stripBullet(line: string): string {
  return line.replace(/^[•\-*]\s*/, '');
}

export default function TextBlock({ text, theme, fontSet, scale, sizes, color }: TextBlockProps) {
  const textColor = color ?? theme.fg;

  return (
    <>
      {text.split('\n').map((line, i) => {
        const bullet = isBulletLine(line);
        const heading = line.startsWith('#');

        if (heading) {
          return (
            <div key={i} style={{
              fontFamily: `'${fontSet.heading}', sans-serif`,
              fontSize: sizes.heading * scale,
              fontWeight: 700,
              color: textColor,
              marginBottom: sizes.headingGap * scale,
              lineHeight: 1.2,
            }}>
              <RichText text={line.replace(/^#+\s*/, '')} theme={theme} fontSet={fontSet} scale={scale} fontSize={sizes.heading} />
            </div>
          );
        }

        if (bullet) {
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12 * scale,
              marginBottom: sizes.bulletGap * scale,
              paddingLeft: 4 * scale,
            }}>
              <span style={{
                color: theme.accent,
                fontWeight: 700,
                flexShrink: 0,
                fontSize: sizes.bullet * scale,
                lineHeight: '1.45',
              }}>▸</span>
              <span style={{ color: textColor }}>
                <RichText text={stripBullet(line)} theme={theme} fontSet={fontSet} scale={scale} fontSize={sizes.body} />
              </span>
            </div>
          );
        }

        if (!line.trim()) {
          return <div key={i} style={{ height: sizes.emptyLineHeight * scale }} />;
        }

        return (
          <div key={i} style={{ marginBottom: sizes.lineGap * scale, color: textColor }}>
            <RichText text={line} theme={theme} fontSet={fontSet} scale={scale} fontSize={sizes.body} />
          </div>
        );
      })}
    </>
  );
}
