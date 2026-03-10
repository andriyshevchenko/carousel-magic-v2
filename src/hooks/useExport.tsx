import { useCallback, useState } from 'react';
import type { CarouselConfig, Slide } from '../types';
import { exportToPdf, exportToPngs } from '../utils/pdfExport';

/**
 * Encapsulates the offscreen slide-rendering + export logic.
 *
 * The heavy lifting of creating an invisible container, rendering each
 * SlideCanvas at full 1080px, collecting DOM elements, then calling the
 * PDF/PNG export functions is extracted here so App.tsx stays declarative.
 */
export function useExport(
  slides: Slide[],
  config: CarouselConfig,
  SlideCanvas: React.ComponentType<{
    slide: Slide;
    config: CarouselConfig;
    slideIndex: number;
    totalSlides: number;
    renderWidth: number;
    fullSize?: boolean;
  }>,
) {
  const [exporting, setExporting] = useState(false);

  /**
   * Render all slides offscreen at full resolution and return
   * the DOM elements for capture.
   */
  const renderOffscreen = useCallback(async (): Promise<{
    elements: HTMLElement[];
    cleanup: () => void;
  }> => {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;left:0;top:0;z-index:-1;opacity:0;pointer-events:none;';
    document.body.appendChild(container);

    const { createRoot } = await import('react-dom/client');
    const elements: HTMLElement[] = [];

    for (let i = 0; i < slides.length; i++) {
      const wrapper = document.createElement('div');
      container.appendChild(wrapper);

      const root = createRoot(wrapper);
      root.render(
        <SlideCanvas
          slide={slides[i]}
          config={config}
          slideIndex={i}
          totalSlides={slides.length}
          renderWidth={1080}
          fullSize
        />
      );

      // Wait for React render + font loading
      await new Promise(r => setTimeout(r, 500));
      const el = wrapper.firstElementChild as HTMLElement;
      if (el) elements.push(el);
    }

    return {
      elements,
      cleanup: () => container.remove(),
    };
  }, [slides, config, SlideCanvas]);

  const handleExportPdf = useCallback(async () => {
    setExporting(true);
    try {
      const { elements, cleanup } = await renderOffscreen();
      await exportToPdf(elements, config.format);
      cleanup();
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  }, [renderOffscreen, config.format]);

  const handleExportPngs = useCallback(async () => {
    setExporting(true);
    try {
      const { elements, cleanup } = await renderOffscreen();
      await exportToPngs(elements, config.format);
      cleanup();
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  }, [renderOffscreen, config.format]);

  return { exporting, handleExportPdf, handleExportPngs };
}
