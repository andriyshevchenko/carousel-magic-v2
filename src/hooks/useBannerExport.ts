import { getFontEmbedCSS, toPng } from 'html-to-image';
import { useCallback, useState } from 'react';

/**
 * Hook for exporting the banner canvas as a PNG image.
 * Takes a ref to the banner canvas container element.
 */
export function useBannerExport() {
    const [exporting, setExporting] = useState(false);

    const handleExportPng = useCallback(async (canvasElement: HTMLElement | null) => {
        if (!canvasElement) return;
        setExporting(true);

        try {
            // Pre-fetch and embed fonts
            let fontEmbedCSS: string | undefined;
            try {
                fontEmbedCSS = await getFontEmbedCSS(canvasElement);
            } catch {
                console.warn('Font embedding failed, using system fallbacks');
            }

            const dataUrl = await toPng(canvasElement, {
                width: canvasElement.offsetWidth,
                height: canvasElement.offsetHeight,
                pixelRatio: 2,
                fontEmbedCSS,
            });

            const link = document.createElement('a');
            link.download = 'linkedin-banner.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Banner export failed:', err);
        }

        setExporting(false);
    }, []);

    return { exporting, handleExportPng };
}
