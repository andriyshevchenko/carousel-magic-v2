import { toPng } from 'html-to-image';
import { useCallback, useState } from 'react';

/**
 * Hook for exporting the profile picture canvas as a PNG image.
 */
export function useProfilePicExport() {
    const [exporting, setExporting] = useState(false);

    const handleExportPng = useCallback(async (canvasElement: HTMLElement | null) => {
        if (!canvasElement) return;
        setExporting(true);

        try {
            const dataUrl = await toPng(canvasElement, {
                width: canvasElement.offsetWidth,
                height: canvasElement.offsetHeight,
                pixelRatio: 2,
            });

            const link = document.createElement('a');
            link.download = 'linkedin-profile-pic.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Profile pic export failed:', err);
        }

        setExporting(false);
    }, []);

    return { exporting, handleExportPng };
}
