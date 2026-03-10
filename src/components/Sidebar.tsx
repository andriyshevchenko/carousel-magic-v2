import { useState } from 'react';
import type { CarouselConfig, Slide, SlideType } from '../types';
import { slideLabel } from '../utils/slideHelpers';
import FontPicker from './FontPicker';
import SlideEditor from './SlideEditor';
import TemplateManager from './TemplateManager';
import ThemePicker from './ThemePicker';

interface SidebarProps {
  config: CarouselConfig;
  slides: Slide[];
  activeSlide: Slide;
  activeSlideIndex: number;
  onConfigChange: (partial: Partial<CarouselConfig>) => void;
  onSlideUpdate: (id: string, partial: Partial<Slide>) => void;
  onAddSlide: (type: SlideType, afterIndex?: number) => void;
  onRemoveSlide: (id: string) => void;
  onMoveSlide: (from: number, to: number) => void;
  onSelectSlide: (idx: number) => void;
  onLoadTemplate: (config: CarouselConfig, slides: Slide[]) => void;
  onExportPdf: () => void;
  onExportPngs: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

type Tab = 'slides' | 'design' | 'settings' | 'templates';

export default function Sidebar(props: SidebarProps) {
  const [tab, setTab] = useState<Tab>('slides');
  const {
    config, slides, activeSlide, activeSlideIndex,
    onConfigChange, onSlideUpdate, onAddSlide, onRemoveSlide, onMoveSlide, onSelectSlide,
    onLoadTemplate, onExportPdf, onExportPngs, onExportJson, onImportJson,
  } = props;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'slides', label: 'Slides', icon: '📑' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'templates', label: 'Templates', icon: '📦' },
  ];

  return (
    <aside className="w-80 min-w-[320px] bg-zinc-900/80 border-r border-zinc-800/50 flex flex-col h-full">
      {/* ── App header ── */}
      <div className="px-5 py-4 border-b border-zinc-800/50">
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
          <span className="text-2xl">✨</span> Carousel Magic
          <span className="text-xs text-zinc-500 font-normal ml-auto">v2</span>
        </h1>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-zinc-800/50">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
              tab === t.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-zinc-800/30'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="mr-1">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {tab === 'slides' && (
          <>
            {/* Slide list */}
            <div>
              <label className="sidebar-label">Slides ({slides.length})</label>
              <div className="space-y-1">
                {slides.map((s, i) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectSlide(i)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                      i === activeSlideIndex
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : 'bg-zinc-800/30 border border-transparent hover:bg-zinc-800/60'
                    }`}
                  >
                    <span className="text-xs text-zinc-500 font-mono w-5">{i + 1}</span>
                    <span className="text-sm flex-1 text-zinc-200">
                      {slideLabel(s)}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      {i > 0 && (
                        <button
                          onClick={e => { e.stopPropagation(); onMoveSlide(i, i - 1); }}
                          className="text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                          title="Move up"
                        >↑</button>
                      )}
                      {i < slides.length - 1 && (
                        <button
                          onClick={e => { e.stopPropagation(); onMoveSlide(i, i + 1); }}
                          className="text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                          title="Move down"
                        >↓</button>
                      )}
                      {slides.length > 1 && (
                        <button
                          onClick={e => { e.stopPropagation(); onRemoveSlide(s.id); }}
                          className="text-zinc-500 hover:text-red-400 text-xs cursor-pointer"
                          title="Remove"
                        >✕</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add slide buttons */}
              <div className="flex gap-1.5 mt-3">
                {(['hook', 'content', 'code', 'cta'] as SlideType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => onAddSlide(type, activeSlideIndex)}
                    className="flex-1 text-[10px] text-zinc-400 hover:text-zinc-200 bg-zinc-800/40 hover:bg-zinc-800/80 rounded-md py-1.5 transition-colors cursor-pointer"
                  >
                    + {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Active slide editor */}
            {activeSlide && (
              <div>
                <div className="text-xs text-zinc-500 mb-2 font-medium">
                  Editing slide {activeSlideIndex + 1}
                </div>
                <SlideEditor
                  slide={activeSlide}
                  onUpdate={p => onSlideUpdate(activeSlide.id, p)}
                />
              </div>
            )}
          </>
        )}

        {tab === 'design' && (
          <>
            <ThemePicker
              currentId={config.themeId}
              onChange={id => onConfigChange({ themeId: id })}
            />
            <FontPicker
              currentId={config.fontSetId}
              onChange={id => onConfigChange({ fontSetId: id })}
            />
          </>
        )}

        {tab === 'settings' && (
          <div className="space-y-4">
            {/* Format */}
            <div>
              <label className="sidebar-label">Slide Format</label>
              <div className="flex gap-2">
                {(['1080x1080', '1080x1350'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => onConfigChange({ format: f })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      config.format === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {f === '1080x1080' ? '□ Square' : '▯ Portrait'}
                    <div className="text-[10px] opacity-60 mt-0.5">{f}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="sidebar-label">Author Name</label>
              <input
                className="sidebar-input"
                value={config.authorName}
                onChange={e => onConfigChange({ authorName: e.target.value })}
              />
            </div>
            <div>
              <label className="sidebar-label">Author Handle</label>
              <input
                className="sidebar-input"
                value={config.authorHandle}
                onChange={e => onConfigChange({ authorHandle: e.target.value })}
              />
            </div>
            <div>
              <label className="sidebar-label">Author Initials</label>
              <input
                className="sidebar-input"
                value={config.authorInitials}
                onChange={e => onConfigChange({ authorInitials: e.target.value })}
                maxLength={3}
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <label className="sidebar-label">Display Options</label>
              {[
                { key: 'showNavDots' as const, label: 'Navigation dots' },
                { key: 'showSlideNumbers' as const, label: 'Slide numbers' },
                { key: 'showAuthorBadge' as const, label: 'Author badge' },
                { key: 'showSwipeHint' as const, label: 'Swipe hint (first slide)' },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config[opt.key]}
                    onChange={e => onConfigChange({ [opt.key]: e.target.checked })}
                    className="accent-blue-500"
                  />
                  <span className="text-sm text-zinc-300">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Socials */}
            <div className="space-y-2">
              <label className="sidebar-label">Social Links (CTA slide)</label>
              <input
                className="sidebar-input"
                placeholder="LinkedIn URL"
                value={config.ctaSocials.linkedin || ''}
                onChange={e => onConfigChange({ ctaSocials: { ...config.ctaSocials, linkedin: e.target.value } })}
              />
              <input
                className="sidebar-input"
                placeholder="Twitter / X handle"
                value={config.ctaSocials.twitter || ''}
                onChange={e => onConfigChange({ ctaSocials: { ...config.ctaSocials, twitter: e.target.value } })}
              />
              <input
                className="sidebar-input"
                placeholder="GitHub URL"
                value={config.ctaSocials.github || ''}
                onChange={e => onConfigChange({ ctaSocials: { ...config.ctaSocials, github: e.target.value } })}
              />
              <input
                className="sidebar-input"
                placeholder="Website URL"
                value={config.ctaSocials.website || ''}
                onChange={e => onConfigChange({ ctaSocials: { ...config.ctaSocials, website: e.target.value } })}
              />
            </div>
          </div>
        )}

        {tab === 'templates' && (
          <TemplateManager
            config={config}
            slides={slides}
            onLoad={onLoadTemplate}
          />
        )}
      </div>

      {/* ── Export buttons (always visible) ── */}
      <div className="border-t border-zinc-800/50 p-4 space-y-2">
        <button
          onClick={onExportPdf}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg py-2.5 transition-all cursor-pointer shadow-lg shadow-blue-900/30"
        >
          📄 Export PDF
        </button>
        <button
          onClick={onExportPngs}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg py-2 transition-colors cursor-pointer"
        >
          🖼 Export PNGs
        </button>
        <div className="flex gap-2">
          <button
            onClick={onExportJson}
            className="flex-1 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg py-1.5 transition-colors cursor-pointer"
          >
            📋 Export JSON
          </button>
          <label className="flex-1 bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg py-1.5 transition-colors cursor-pointer text-center">
            📥 Import JSON
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) { onImportJson(f); }
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
