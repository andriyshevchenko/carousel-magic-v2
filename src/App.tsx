import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BannerCanvas from './components/BannerCanvas';
import BannerEditor from './components/BannerEditor';
import ErrorBoundary from './components/ErrorBoundary';
import ProfilePicCanvas from './components/ProfilePicCanvas';
import ProfilePicEditor from './components/ProfilePicEditor';
import Sidebar from './components/Sidebar';
import SlideCanvas from './components/SlideCanvas';
import { useBannerExport } from './hooks/useBannerExport';
import { useCarousel } from './hooks/useCarousel';
import { useExport } from './hooks/useExport';
import { useProfilePicExport } from './hooks/useProfilePicExport';
import { PORTRAIT_FORMAT } from './types';
import { BANNER_HEIGHT, BANNER_WIDTH, DEFAULT_BANNER_CONFIG, type BannerConfig } from './types/banner';
import { DEFAULT_PROFILE_PIC_CONFIG, PFP_SIZE, type ProfilePicConfig } from './types/profilePic';

type AppMode = 'carousel' | 'banner' | 'profile-pic';

export default function App() {
  const [mode, setMode] = useState<AppMode>('carousel');

  // ═══════════════════════════════════════════════════
  //  Carousel state
  // ═══════════════════════════════════════════════════
  const {
    config, slides, activeSlide, activeSlideIndex, currentFont,
    setConfig, setActiveSlide, updateSlide, addSlide, removeSlide, moveSlide, loadFromTemplate,
    exportJson, importJson,
  } = useCarousel();

  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(540);

  const { exporting: carouselExporting, handleExportPdf, handleExportPngs } = useExport(slides, config);

  const slideActions = useMemo(() => ({
    update: updateSlide,
    add: addSlide,
    remove: removeSlide,
    move: moveSlide,
    select: setActiveSlide,
  }), [updateSlide, addSlide, removeSlide, moveSlide, setActiveSlide]);

  const exportActions = useMemo(() => ({
    exportPdf: handleExportPdf,
    exportPngs: handleExportPngs,
    exportJson: exportJson,
    importJson: importJson,
  }), [handleExportPdf, handleExportPngs, exportJson, importJson]);

  // ═══════════════════════════════════════════════════
  //  Banner state
  // ═══════════════════════════════════════════════════
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(DEFAULT_BANNER_CONFIG);
  const bannerPreviewRef = useRef<HTMLDivElement>(null);
  const bannerExportRef = useRef<HTMLDivElement>(null);
  const [bannerPreviewWidth, setBannerPreviewWidth] = useState(800);
  const { exporting: bannerExporting, handleExportPng: exportBannerPng } = useBannerExport();

  const updateBannerConfig = useCallback((partial: Partial<BannerConfig>) => {
    setBannerConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const handleBannerExport = useCallback(async () => {
    // We need to render at full size for export
    const exportContainer = bannerExportRef.current;
    if (!exportContainer) return;
    await exportBannerPng(exportContainer.firstElementChild as HTMLElement);
  }, [exportBannerPng]);

  // ═══════════════════════════════════════════════════
  //  Profile Pic state
  // ═══════════════════════════════════════════════════
  const [pfpConfig, setPfpConfig] = useState<ProfilePicConfig>(DEFAULT_PROFILE_PIC_CONFIG);
  const pfpPreviewRef = useRef<HTMLDivElement>(null);
  const pfpExportRef = useRef<HTMLDivElement>(null);
  const [pfpPreviewSize, setPfpPreviewSize] = useState(400);
  const { exporting: pfpExporting, handleExportPng: exportPfpPng } = useProfilePicExport();

  const updatePfpConfig = useCallback((partial: Partial<ProfilePicConfig>) => {
    setPfpConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const handlePfpExport = useCallback(async () => {
    const exportContainer = pfpExportRef.current;
    if (!exportContainer) return;
    await exportPfpPng(exportContainer.firstElementChild as HTMLElement);
  }, [exportPfpPng]);

  // ── Responsive preview width (carousel) ──
  useEffect(() => {
    if (mode !== 'carousel') return;
    function calc() {
      if (previewRef.current) {
        const container = previewRef.current.parentElement;
        if (container) {
          const avail = container.clientWidth - 80;
          const [cw, ch] = config.format === PORTRAIT_FORMAT ? [1080, 1350] : [1080, 1080];
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
  }, [config.format, mode]);

  // ── Responsive preview width (banner) ──
  useEffect(() => {
    if (mode !== 'banner') return;
    function calc() {
      if (bannerPreviewRef.current) {
        const container = bannerPreviewRef.current.parentElement;
        if (container) {
          const avail = container.clientWidth - 80;
          const maxH = container.clientHeight - 120;
          const scaleByW = avail / BANNER_WIDTH;
          const scaleByH = maxH / BANNER_HEIGHT;
          const s = Math.min(scaleByW, scaleByH, 1);
          setBannerPreviewWidth(Math.round(BANNER_WIDTH * s));
        }
      }
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [mode]);

  // ── Responsive preview size (profile pic) ──
  useEffect(() => {
    if (mode !== 'profile-pic') return;
    function calc() {
      if (pfpPreviewRef.current) {
        const container = pfpPreviewRef.current.parentElement;
        if (container) {
          const avail = Math.min(container.clientWidth - 80, container.clientHeight - 120);
          const s = Math.min(avail / PFP_SIZE, 1);
          setPfpPreviewSize(Math.round(PFP_SIZE * s));
        }
      }
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [mode]);

  // ── Keyboard navigation (carousel only) ──
  useEffect(() => {
    if (mode !== 'carousel') return;
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      if (e.key === 'ArrowLeft') setActiveSlide(activeSlideIndex - 1);
      if (e.key === 'ArrowRight') setActiveSlide(activeSlideIndex + 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeSlideIndex, setActiveSlide, mode]);

  const exporting = carouselExporting || bannerExporting || pfpExporting;

  // ═══════════════════════════════════════════════════
  //  Render
  // ═══════════════════════════════════════════════════

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Sidebar ── */}
      {mode === 'carousel' ? (
        <Sidebar
          config={config}
          slides={slides}
          activeSlide={activeSlide}
          activeSlideIndex={activeSlideIndex}
          onConfigChange={setConfig}
          slideActions={slideActions}
          exportActions={exportActions}
          onLoadTemplate={loadFromTemplate}
        />
      ) : mode === 'banner' ? (
        <BannerEditor
          config={bannerConfig}
          onConfigChange={updateBannerConfig}
          onExportPng={handleBannerExport}
          exporting={bannerExporting}
          onSwitchToCarousel={() => setMode('carousel')}
        />
      ) : (
        <ProfilePicEditor
          config={pfpConfig}
          onConfigChange={updatePfpConfig}
          onExportPng={handlePfpExport}
          exporting={pfpExporting}
          onSwitchToCarousel={() => setMode('carousel')}
          onSwitchToBanner={() => setMode('banner')}
        />
      )}

      {/* ── Main preview area ── */}
      <main className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
          {mode === 'carousel' ? (
            <>
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
              <div className="flex items-center gap-4">
                <div className="text-xs text-zinc-500">
                  {config.format} · {currentFont.label}
                </div>
                <button
                  onClick={() => setMode('banner')}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  🖼️ Banner
                </button>
                <button
                  onClick={() => setMode('profile-pic')}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  👤 Profile Pic
                </button>
              </div>
            </>
          ) : mode === 'banner' ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400 font-medium">
                  🖼️ LinkedIn Banner Preview
                </span>
              </div>
              <div className="text-xs text-zinc-500">
                {BANNER_WIDTH} × {BANNER_HEIGHT}px · 4:1 ratio
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400 font-medium">
                  👤 LinkedIn Profile Picture
                </span>
              </div>
              <div className="text-xs text-zinc-500">
                {PFP_SIZE} × {PFP_SIZE}px · Square
              </div>
            </>
          )}
        </div>

        {/* Preview canvas area */}
        {mode === 'carousel' ? (
          <>
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
                  <ErrorBoundary>
                    <SlideCanvas
                      slide={activeSlide}
                      config={config}
                      slideIndex={activeSlideIndex}
                      totalSlides={slides.length}
                      renderWidth={previewWidth}
                    />
                  </ErrorBoundary>
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
                    style={{ width: config.format === PORTRAIT_FORMAT ? 56 : 64, height: config.format === PORTRAIT_FORMAT ? 70 : 64 }}
                  >
                    <ErrorBoundary>
                      <SlideCanvas
                        slide={s}
                        config={config}
                        slideIndex={i}
                        totalSlides={slides.length}
                        renderWidth={config.format === PORTRAIT_FORMAT ? 56 : 64}
                      />
                    </ErrorBoundary>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : mode === 'banner' ? (
          <>
            <div
              ref={bannerPreviewRef}
              className="flex-1 overflow-auto p-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0f 100%)',
              }}
            >
              <div className="min-h-full flex items-center justify-center">
                <div
                  className="rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    boxShadow: '0 0 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)',
                  }}
                >
                  <ErrorBoundary>
                    <BannerCanvas
                      config={bannerConfig}
                      renderWidth={bannerPreviewWidth}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            </div>

            {/* LinkedIn safe zone info */}
            <div className="border-t border-zinc-800/50 bg-zinc-900/50 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">
                  💡 <strong className="text-zinc-400">Safe zone:</strong> Keep key text away from bottom-left (profile photo overlap) and extreme edges
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50 inline-block" /> Center is safest
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              ref={pfpPreviewRef}
              className="flex-1 overflow-auto p-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0f 100%)',
              }}
            >
              <div className="min-h-full flex items-center justify-center">
                <div
                  className="shadow-2xl"
                  style={{
                    boxShadow: '0 0 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)',
                    borderRadius: pfpConfig.circlePreview ? '50%' : '1rem',
                    overflow: 'hidden',
                  }}
                >
                  <ErrorBoundary>
                    <ProfilePicCanvas
                      config={pfpConfig}
                      renderSize={pfpPreviewSize}
                    />
                  </ErrorBoundary>
                </div>
              </div>
            </div>

            {/* Profile pic info */}
            <div className="border-t border-zinc-800/50 bg-zinc-900/50 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">
                  💡 <strong className="text-zinc-400">Tip:</strong> LinkedIn shows profile pictures as a circle. Toggle circle preview to see how it looks.
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {pfpConfig.processedImage ? (
                    <><span className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/50 inline-block" /> Background removed</>
                  ) : (
                    <><span className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/50 inline-block" /> Upload a photo</>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── Hidden full-size banner for export ── */}
      <div
        ref={bannerExportRef}
        style={{ position: 'fixed', left: 0, top: 0, zIndex: -1, opacity: 0, pointerEvents: 'none' }}
      >
        <BannerCanvas
          config={bannerConfig}
          renderWidth={BANNER_WIDTH}
          fullSize
        />
      </div>

      {/* ── Hidden full-size profile pic for export ── */}
      <div
        ref={pfpExportRef}
        style={{ position: 'fixed', left: 0, top: 0, zIndex: -1, opacity: 0, pointerEvents: 'none' }}
      >
        <ProfilePicCanvas
          config={{ ...pfpConfig, circlePreview: false }}
          renderSize={PFP_SIZE}
          fullSize
        />
      </div>

      {/* ── Export overlay ── */}
      {exporting && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 text-center">
            <div className="text-2xl mb-3 animate-spin">⏳</div>
            <div className="text-zinc-200 font-medium">
              {mode === 'carousel' ? 'Exporting your carousel…' : mode === 'banner' ? 'Exporting your banner…' : 'Exporting your profile picture…'}
            </div>
            <div className="text-zinc-500 text-sm mt-1">
              {mode === 'carousel' ? 'Rendering slides at full resolution' : mode === 'banner' ? 'Rendering at 1584 × 396px' : 'Rendering at 400 × 400px'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
