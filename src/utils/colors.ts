// ── Color utility functions ──
// Extracted from SlideCanvas for reuse across components.

/** Check if a hex colour is perceptually light (for choosing black/white text). */
export function isLight(hex: string): boolean {
    if (hex.startsWith('linear') || hex.startsWith('rgba')) return false;
    const c = hex.replace('#', '');
    const r = Number.parseInt(c.substring(0, 2), 16);
    const g = Number.parseInt(c.substring(2, 4), 16);
    const b = Number.parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

/** Brighten a hex colour by a factor (1.0 = no change, 1.25 = 25% brighter). Clamps at #ffffff. */
export function brightenColor(hex: string, factor: number): string {
    if (!hex.startsWith('#') || hex.length < 7) return hex;
    const c = hex.replace('#', '');
    const r = Math.min(255, Math.round(Number.parseInt(c.substring(0, 2), 16) * factor));
    const g = Math.min(255, Math.round(Number.parseInt(c.substring(2, 4), 16) * factor));
    const b = Math.min(255, Math.round(Number.parseInt(c.substring(4, 6), 16) * factor));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
 * Ensure text meets a minimum contrast ratio against the background.
 * Progressively brightens (on dark bg) or darkens (on light bg) until met.
 */
export function ensureContrast(fgHex: string, bgHex: string, minRatio = 4): string {
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
