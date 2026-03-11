import { PORTRAIT_FORMAT, type SlideFormat, type Theme } from '../types';
import { ensureContrast } from './colors';

/** Check whether a background string is a CSS gradient. */
export function isGradient(bg: string): boolean {
    return bg.startsWith('linear-gradient');
}

/** Return canvas [width, height] for the given slide format. */
export function getCanvasDimensions(format: SlideFormat): [number, number] {
    return format === PORTRAIT_FORMAT ? [1080, 1350] : [1080, 1080];
}

/**
 * Derive a contrast-safe theme: ensure muted text is readable against the
 * background.  For gradient backgrounds we approximate with a dark fallback.
 */
export function resolveTheme(rawTheme: Theme): Theme {
    const bgForContrast = isGradient(rawTheme.bg) ? '#1a1a2e' : rawTheme.bg;
    return {
        ...rawTheme,
        muted: ensureContrast(rawTheme.muted, bgForContrast, 4),
    };
}
