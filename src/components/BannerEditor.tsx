import { useState } from 'react';
import { BANNER_PRESETS } from '../data/bannerPresets';
import { BANNER_LAYOUTS, type BannerConfig } from '../types/banner';
import FontPicker from './FontPicker';
import ThemePicker from './ThemePicker';

interface BannerEditorProps {
  config: BannerConfig;
  onConfigChange: (partial: Partial<BannerConfig>) => void;
  onExportPng: () => void;
  exporting: boolean;
  onSwitchToCarousel: () => void;
}

type Tab = 'content' | 'design' | 'presets';

export default function BannerEditor({
  config,
  onConfigChange,
  onExportPng,
  exporting,
  onSwitchToCarousel,
}: BannerEditorProps) {
  const [tab, setTab] = useState<Tab>('content');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'content', label: 'Content', icon: '✏️' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'presets', label: 'Presets', icon: '📦' },
  ];

  return (
    <aside className="w-80 min-w-[320px] bg-zinc-900/80 border-r border-zinc-800/50 flex flex-col h-full">
      {/* ── App header ── */}
      <div className="px-5 py-4 border-b border-zinc-800/50">
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
          <span className="text-2xl">🖼️</span> Banner Maker
          <span className="text-xs text-zinc-500 font-normal ml-auto">LinkedIn</span>
        </h1>
        <button
          onClick={onSwitchToCarousel}
          className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
        >
          ← Back to Carousel Magic
        </button>
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
        {tab === 'content' && (
          <ContentTab config={config} onConfigChange={onConfigChange} />
        )}
        {tab === 'design' && (
          <DesignTab config={config} onConfigChange={onConfigChange} />
        )}
        {tab === 'presets' && (
          <PresetsTab config={config} onConfigChange={onConfigChange} />
        )}
      </div>

      {/* ── Export bar ── */}
      <div className="px-4 py-3 border-t border-zinc-800/50 space-y-2">
        <button
          onClick={onExportPng}
          disabled={exporting}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium rounded-lg text-sm transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {exporting ? (
            <>
              <span className="animate-spin">⏳</span> Exporting…
            </>
          ) : (
            <>
              📥 Export as PNG
            </>
          )}
        </button>
        <p className="text-xs text-zinc-500 text-center">
          1584 × 396px · Ready for LinkedIn
        </p>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════════
//  Content Tab
// ═══════════════════════════════════════════════════════════

function ContentTab({ config, onConfigChange }: { config: BannerConfig; onConfigChange: (p: Partial<BannerConfig>) => void }) {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !config.tags.includes(t)) {
      onConfigChange({ tags: [...config.tags, t] });
      setTagInput('');
    }
  };

  const removeTag = (idx: number) => {
    onConfigChange({ tags: config.tags.filter((_, i) => i !== idx) });
  };

  return (
    <>
      {/* Headline */}
      <div>
        <label className="sidebar-label">Headline</label>
        <input
          className="sidebar-input"
          value={config.headline}
          onChange={e => onConfigChange({ headline: e.target.value })}
          placeholder="Your professional headline…"
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="sidebar-label">Tagline</label>
        <textarea
          className="sidebar-textarea"
          rows={2}
          value={config.tagline}
          onChange={e => onConfigChange({ tagline: e.target.value })}
          placeholder="A brief description of what you do…"
        />
      </div>

      {/* Accent Emoji */}
      <div>
        <label className="sidebar-label">Accent Emoji</label>
        <input
          className="sidebar-input"
          value={config.accentEmoji}
          onChange={e => onConfigChange({ accentEmoji: e.target.value })}
          placeholder="🚀"
          style={{ width: 60 }}
        />
      </div>

      {/* Highlight Word */}
      <div>
        <label className="sidebar-label">Highlight Word</label>
        <input
          className="sidebar-input"
          value={config.highlightWord}
          onChange={e => onConfigChange({ highlightWord: e.target.value })}
          placeholder="Word in headline to color (e.g. .NET)"
        />
        <p className="text-[10px] text-zinc-500 mt-1">Word in headline that gets accent-colored</p>
      </div>

      {/* Tags */}
      <div>
        <label className="sidebar-label">Skills / Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            className="sidebar-input flex-1"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add a tag…"
          />
          <button
            onClick={addTag}
            className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg text-sm transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {config.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-800 border border-zinc-700/50 rounded-full text-xs text-zinc-300"
            >
              {tag}
              <button
                onClick={() => removeTag(i)}
                className="text-zinc-500 hover:text-red-400 ml-0.5 text-xs cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ── Influencer / Newsletter fields ── */}
      <div className="border-t border-zinc-800/50 pt-3 mt-1">
        <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Branding & CTA</p>

        {/* Author Name */}
        <div className="mb-2">
          <label className="sidebar-label">Author Name</label>
          <input
            className="sidebar-input"
            value={config.authorName}
            onChange={e => onConfigChange({ authorName: e.target.value })}
            placeholder="Your Name"
          />
        </div>

        {/* Author Website */}
        <div className="mb-2">
          <label className="sidebar-label">Website</label>
          <input
            className="sidebar-input"
            value={config.authorWebsite}
            onChange={e => onConfigChange({ authorWebsite: e.target.value })}
            placeholder="yoursite.com"
          />
        </div>

        {/* Social Proof */}
        <div className="mb-2">
          <label className="sidebar-label">Social Proof</label>
          <input
            className="sidebar-input"
            value={config.socialProof}
            onChange={e => onConfigChange({ socialProof: e.target.value })}
            placeholder="Join 35,000+ engineers"
          />
        </div>

        {/* CTA Button Text */}
        <div>
          <label className="sidebar-label">CTA Button Text</label>
          <input
            className="sidebar-input"
            value={config.ctaButtonText}
            onChange={e => onConfigChange({ ctaButtonText: e.target.value })}
            placeholder="Subscribe in my featured section"
          />
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
//  Design Tab
// ═══════════════════════════════════════════════════════════

function DesignTab({ config, onConfigChange }: { config: BannerConfig; onConfigChange: (p: Partial<BannerConfig>) => void }) {
  return (
    <>
      {/* Layout */}
      <div>
        <label className="sidebar-label">Layout</label>
        <div className="space-y-1.5">
          {BANNER_LAYOUTS.map(layout => (
            <button
              key={layout.id}
              onClick={() => onConfigChange({ layoutId: layout.id })}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                config.layoutId === layout.id
                  ? 'bg-blue-600/20 border border-blue-500/30'
                  : 'bg-zinc-800/30 border border-transparent hover:bg-zinc-800/60'
              }`}
            >
              <div className="text-sm text-zinc-200 font-medium">{layout.name}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{layout.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <ThemePicker
          currentId={config.themeId}
          onChange={themeId => onConfigChange({ themeId })}
        />
      </div>

      {/* Font */}
      <div>
        <FontPicker
          currentId={config.fontSetId}
          onChange={fontSetId => onConfigChange({ fontSetId })}
        />
      </div>

      {/* Accent color override */}
      <div>
        <label className="sidebar-label">Accent Color Override</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={config.accentColorOverride || '#61afef'}
            onChange={e => onConfigChange({ accentColorOverride: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-zinc-700"
          />
          <input
            className="sidebar-input flex-1"
            value={config.accentColorOverride}
            onChange={e => onConfigChange({ accentColorOverride: e.target.value })}
            placeholder="Leave empty for theme default"
          />
          {config.accentColorOverride && (
            <button
              onClick={() => onConfigChange({ accentColorOverride: '' })}
              className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Decorations toggle */}
      <div className="flex items-center justify-between">
        <label className="sidebar-label mb-0">Decorations</label>
        <button
          onClick={() => onConfigChange({ showDecoration: !config.showDecoration })}
          className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${
            config.showDecoration ? 'bg-blue-600' : 'bg-zinc-700'
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
            config.showDecoration ? 'translate-x-5' : 'translate-x-0.5'
          }`} />
        </button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
//  Presets Tab
// ═══════════════════════════════════════════════════════════

function PresetsTab({ config, onConfigChange }: { config: BannerConfig; onConfigChange: (p: Partial<BannerConfig>) => void }) {
  const applyPreset = (presetConfig: Partial<BannerConfig>) => {
    onConfigChange(presetConfig);
  };

  return (
    <div>
      <label className="sidebar-label">Quick Start Presets</label>
      <p className="text-xs text-zinc-500 mb-3">
        Pick a preset to populate your banner, then customize to match your personal brand.
      </p>
      <div className="space-y-2">
        {BANNER_PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.config)}
            className="w-full text-left px-4 py-3 rounded-lg bg-zinc-800/40 border border-zinc-700/30 hover:bg-zinc-800/70 hover:border-zinc-600/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-200 font-medium group-hover:text-zinc-100">
                {preset.name}
              </span>
              <span className="text-xs text-zinc-600 group-hover:text-blue-400 transition-colors">
                Apply →
              </span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">{preset.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
