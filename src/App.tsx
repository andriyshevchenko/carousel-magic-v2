import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import SlideCanvas from './components/SlideCanvas';
import { useCarousel } from './hooks/useCarousel';
import { useExport } from './hooks/useExport';

export default function App() {
  const {
    config, slides, activeSlide, activeSlideIndex, currentFont,
    setConfig, setActiveSlide, updateSlide, addSlide, removeSlide, moveSlide, loadFromTemplate,
    exportJson, importJson,
  } = useCarousel();

  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(540);

  const { exporting, handleExportPdf, handleExportPngs } = useExport(slides, config, SlideCanvas);

  // ── Responsive preview width ──
  useEffect(() => {
    function calc() {
      if (previewRef.current) {
        const container = previewRef.current.parentElement;
        if (container) {
          const avail = container.clientWidth - 80; // padding
          const [cw, ch] = config.format === '1080x1350' ? [1080, 1350] : [1080, 1080];
          const maxH = container.clientHeight - 120;
          const scaleByW = avail / cw;
          const scaleByH = maxH / ch;
          const s = Math.min(scaleByW, scaleByH, 1);
          setPreviewWidth(Math.round(cw * s));
        }
      }
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [config.format]);

  // ── Keyboard navigation ──
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'ArrowLeft') setActiveSlide(activeSlideIndex - 1);
      if (e.key === 'ArrowRight') setActiveSlide(activeSlideIndex + 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSlideIndex, setActiveSlide]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        config={config}
        slides={slides}
        activeSlide={activeSlide}
        activeSlideIndex={activeSlideIndex}
        onConfigChange={setConfig}
        onSlideUpdate={updateSlide}
        onAddSlide={addSlide}
        onRemoveSlide={removeSlide}
        onMoveSlide={moveSlide}
        onSelectSlide={setActiveSlide}
        onLoadTemplate={loadFromTemplate}
        onExportPdf={handleExportPdf}
        onExportPngs={handleExportPngs}
        onExportJson={exportJson}
        onImportJson={importJson}
      />

      {/* ── Main preview area ── */}
      <main className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSlide(activeSlideIndex - 1)}
              disabled={activeSlideIndex === 0}
              className="text-zinc-400 hover:text-zinc-100 disabled:opacity-30 text-lg px-2 transition-colors cursor-pointer disabled:cursor-default"
            >
              ←
            </button>
            <span className="text-sm text-zinc-400 font-medium tabular-nums">
              Slide {activeSlideIndex + 1} of {slides.length}
            </span>
            <button
              onClick={() => setActiveSlide(activeSlideIndex + 1)}
              disabled={activeSlideIndex === slides.length - 1}
              className="text-zinc-400 hover:text-zinc-100 disabled:opacity-30 text-lg px-2 transition-colors cursor-pointer disabled:cursor-default"
            >
              →
            </button>
          </div>
          <div className="text-xs text-zinc-500">
            {config.format} · {currentFont.label}
          </div>
        </div>

        {/* Preview canvas area */}
        <div
          ref={previewRef}
          className="flex-1 overflow-auto p-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0f 100%)',
          }}
        >
          <div className="min-h-full flex items-center justify-center">
          {activeSlide && (
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: '0 0 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)',
              }}
            >
              <SlideCanvas
                slide={activeSlide}
                config={config}
                slideIndex={activeSlideIndex}
                totalSlides={slides.length}
                renderWidth={previewWidth}
              />
            </div>
          )}
          </div>
        </div>

        {/* Slide filmstrip */}
        <div className="border-t border-zinc-800/50 bg-zinc-900/50 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(i)}
                className={`flex-shrink-0 rounded-lg overflow-hidden transition-all cursor-pointer ${
                  i === activeSlideIndex
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900'
                    : 'opacity-60 hover:opacity-90'
                }`}
                style={{ width: config.format === '1080x1350' ? 56 : 64, height: config.format === '1080x1350' ? 70 : 64 }}
              >
                <SlideCanvas
                  slide={s}
                  config={config}
                  slideIndex={i}
                  totalSlides={slides.length}
                  renderWidth={config.format === '1080x1350' ? 56 : 64}
                />
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── Export overlay ── */}
      {exporting && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 text-center">
            <div className="text-2xl mb-3 animate-spin">⏳</div>
            <div className="text-zinc-200 font-medium">Exporting your carousel…</div>
            <div className="text-zinc-500 text-sm mt-1">Rendering slides at full resolution</div>
          </div>
        </div>
      )}
    </div>
  );
}
