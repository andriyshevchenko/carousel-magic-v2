import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { SlideFormat } from '../types';

function getDimensions(format: SlideFormat): [number, number] {
  return format === '1080x1350' ? [1080, 1350] : [1080, 1080];
}

/* ── oklch → rgb math conversion ─────────────────────────
 * html2canvas can't parse oklch(). Modern Chrome returns oklch
 * from getComputedStyle and Canvas 2D, so we convert manually.
 */
function oklchToRgbString(oklchCss: string): string {
  // Parse: oklch(L C H) or oklch(L C H / alpha)
  // L can be 0-1 or 0%-100%, C is 0+, H is 0-360 (degrees)
  const m = oklchCss.match(/oklch\(\s*([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+)\s*(?:\/\s*([0-9.]+%?))?\s*\)/);
  if (!m) return 'transparent';

  let L = parseFloat(m[1]);
  if (m[1].endsWith('%')) L /= 100;
  let C = parseFloat(m[2]);
  if (m[2].endsWith('%')) C /= 100;  // Tailwind doesn't use % for C, but just in case
  const H = parseFloat(m[3]) * Math.PI / 180; // degrees → radians
  let alpha = 1;
  if (m[4]) {
    alpha = parseFloat(m[4]);
    if (m[4].endsWith('%')) alpha /= 100;
  }

  // oklch → oklab
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);

  // oklab → linear-sRGB via LMS intermediate
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const lr = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const lg = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const lb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // Linear sRGB → sRGB gamma
  function gamma(v: number): number {
    const clamped = Math.max(0, Math.min(1, v));
    return clamped <= 0.0031308
      ? clamped * 12.92
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  }

  const r = Math.round(gamma(lr) * 255);
  const g = Math.round(gamma(lg) * 255);
  const bv = Math.round(gamma(lb) * 255);

  if (alpha < 1) {
    return `rgba(${r}, ${g}, ${bv}, ${alpha.toFixed(3)})`;
  }
  return `rgb(${r}, ${g}, ${bv})`;
}

/**
 * Temporarily replace oklch() colours in Tailwind's <style> elements with their
 * resolved RGB equivalents so html2canvas can parse the CSS.
 *
 * html2canvas reads styles from the *original* document during its cloning phase,
 * before the `onclone` callback fires, so we must patch in place.
 * Returns a restore function that reinstates the original stylesheet content.
 */
function patchOklchInPlace(): () => void {
  const saved: { el: HTMLStyleElement; text: string }[] = [];

  // Build a resolution cache: oklch(...) → rgb(...)
  // Modern Chrome returns oklch even from Canvas2D and getComputedStyle,
  // so we must convert mathematically.
  const cache = new Map<string, string>();
  function resolveOklch(oklchValue: string): string {
    let rgb = cache.get(oklchValue);
    if (!rgb) {
      rgb = oklchToRgbString(oklchValue);
      cache.set(oklchValue, rgb);
    }
    return rgb;
  }

  for (const style of Array.from(document.querySelectorAll('style'))) {
    const text = style.textContent ?? '';
    if (text.includes('oklch')) {
      saved.push({ el: style, text });
      style.textContent = text.replaceAll(/oklch\([^)]+\)/g, (match) => resolveOklch(match));
    }
  }

  return () => {
    for (const { el, text } of saved) {
      el.textContent = text;
    }
  };
}

/**
 * Export all slide elements to a single PDF.
 */
export async function exportToPdf(
  slideElements: HTMLElement[],
  format: SlideFormat,
  filename = 'carousel.pdf',
): Promise<void> {
  const [w, h] = getDimensions(format);
  const restore = patchOklchInPlace();

  try {
    const pdf = new jsPDF({
      orientation: w >= h ? 'landscape' : 'portrait',
      unit: 'px',
      format: [w, h],
      hotfixes: ['px_scaling'],
    });

    for (let i = 0; i < slideElements.length; i++) {
      const el = slideElements[i];
      if (!el) continue;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.85);

      if (i > 0) pdf.addPage([w, h]);
      pdf.addImage(imgData, 'JPEG', 0, 0, w, h);
    }

    pdf.save(filename);
  } finally {
    restore();
  }
}

/**
 * Export slides as individual PNG images.
 */
export async function exportToPngs(
  slideElements: HTMLElement[],
  _format: SlideFormat,
): Promise<void> {
  const restore = patchOklchInPlace();

  try {
    for (let i = 0; i < slideElements.length; i++) {
      const el = slideElements[i];
      if (!el) continue;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `slide-${i + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      await new Promise(r => setTimeout(r, 200));
    }
  } finally {
    restore();
  }
}
