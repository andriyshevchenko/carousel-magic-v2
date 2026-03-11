import { getFontEmbedCSS, toJpeg, toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { SlideFormat } from '../types';
import { getCanvasDimensions } from './slideLayout';

/**
 * Pre-fetch and embed all Google Fonts as base64 data URIs.
 * This is done once and reused across all slide captures.
 */
async function getEmbeddedFontCSS(node: HTMLElement): Promise<string | undefined> {
    try {
        return await getFontEmbedCSS(node);
    } catch {
        // If font embedding fails (CORS), fall back to no embedding
        // Fonts may render as system fallbacks
        console.warn('Font embedding failed, using system fallbacks for export');
        return undefined;
    }
}

/**
 * html-to-image uses SVG foreignObject, which delegates rendering to the
 * browser's own engine. This means all modern CSS (oklch, flex, grid, etc.)
 * is rendered with perfect fidelity — no oklch patch needed.
 */

/**
 * Export all slide elements to a single PDF.
 */
export async function exportToPdf(
    slideElements: HTMLElement[],
    format: SlideFormat,
    filename = 'carousel.pdf',
): Promise<void> {
    const [w, h] = getCanvasDimensions(format);

    // Pre-fetch fonts once for all slides
    const fontEmbedCSS = slideElements[0]
        ? await getEmbeddedFontCSS(slideElements[0])
        : undefined;

    const pdf = new jsPDF({
        orientation: w >= h ? 'landscape' : 'portrait',
        unit: 'px',
        format: [w, h],
        hotfixes: ['px_scaling'],
    });

    for (let i = 0; i < slideElements.length; i++) {
        const el = slideElements[i];
        if (!el) continue;

        const imgData = await toJpeg(el, {
            width: el.offsetWidth,
            height: el.offsetHeight,
            pixelRatio: 2,
            quality: 0.85,
            fontEmbedCSS,
        });

        if (i > 0) pdf.addPage([w, h]);
        pdf.addImage(imgData, 'JPEG', 0, 0, w, h);
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
    // Pre-fetch fonts once
    const fontEmbedCSS = slideElements[0]
        ? await getEmbeddedFontCSS(slideElements[0])
        : undefined;

    for (let i = 0; i < slideElements.length; i++) {
        const el = slideElements[i];
        if (!el) continue;

        const dataUrl = await toPng(el, {
            width: el.offsetWidth,
            height: el.offsetHeight,
            pixelRatio: 2,
            fontEmbedCSS,
        });

        const link = document.createElement('a');
        link.download = `slide-${i + 1}.png`;
        link.href = dataUrl;
        link.click();

        await new Promise(r => setTimeout(r, 200));
    }
}
