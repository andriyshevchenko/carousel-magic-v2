import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { SlideFormat } from '../types';

function getDimensions(format: SlideFormat): [number, number] {
  return format === '1080x1350' ? [1080, 1350] : [1080, 1080];
}

/**
 * Export all slide elements to a single PDF.
 * @param slideElements Array of HTMLElement refs (one per slide)
 * @param format The slide format
 */
export async function exportToPdf(
  slideElements: HTMLElement[],
  format: SlideFormat,
  filename = 'carousel.pdf',
): Promise<void> {
  const [w, h] = getDimensions(format);

  // Landscape-ish for square, portrait for tall
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

    const imgData = canvas.toDataURL('image/png');

    if (i > 0) pdf.addPage([w, h]);
    pdf.addImage(imgData, 'PNG', 0, 0, w, h);
  }

  pdf.save(filename);
}

/**
 * Export slides as individual PNG images.
 */
export async function exportToPngs(
  slideElements: HTMLElement[],
  _format: SlideFormat,
): Promise<void> {
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

    // Small delay between downloads
    await new Promise(r => setTimeout(r, 200));
  }
}
