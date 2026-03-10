import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { SlideFormat } from '../types';

function getDimensions(format: SlideFormat): [number, number] {
  return format === '1080x1350' ? [1080, 1350] : [1080, 1080];
}

/**
 * Temporarily neutralise oklch() in Tailwind's <style> elements so html2canvas
 * can parse the CSS. Returns a restore function.
 *
 * html2canvas reads styles from the *original* document during its cloning phase,
 * before the `onclone` callback fires, so we must patch in place.
 * Our slide elements use inline hex/rgb styles, so replacing Tailwind's oklch
 * with transparent has no visual impact on the export.
 */
function patchOklchInPlace(): () => void {
  const saved: { el: HTMLStyleElement; text: string }[] = [];

  for (const style of Array.from(document.querySelectorAll('style'))) {
    const text = style.textContent ?? '';
    if (text.includes('oklch')) {
      saved.push({ el: style, text });
      style.textContent = text.replaceAll(/oklch\([^)]+\)/g, 'transparent');
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
        scale: 1,
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
