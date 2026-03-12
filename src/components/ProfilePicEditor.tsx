import { removeBackground } from '@imgly/background-removal';
import { useCallback, useRef, useState } from 'react';
import { THEMES } from '../data/themes';
import {
    COMPOSITION_PRESETS,
    GRADIENT_PRESETS,
    SOLID_COLOR_PRESETS,
    type BackgroundType,
    type ProfilePicConfig,
} from '../types/profilePic';

interface ProfilePicEditorProps {
  config: ProfilePicConfig;
  onConfigChange: (partial: Partial<ProfilePicConfig>) => void;
  onExportPng: () => void;
  exporting: boolean;
  onSwitchToCarousel: () => void;
  onSwitchToBanner: () => void;
}

type Tab = 'upload' | 'background' | 'adjust';

export default function ProfilePicEditor({
  config,
  onConfigChange,
  onExportPng,
  exporting,
  onSwitchToCarousel,
  onSwitchToBanner,
}: ProfilePicEditorProps) {
  const [tab, setTab] = useState<Tab>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'upload', label: 'Photo', icon: '📷' },
    { id: 'background', label: 'Background', icon: '🎨' },
    { id: 'adjust', label: 'Adjust', icon: '⚙️' },
  ];

  // ── Handle file upload ──
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      onConfigChange({
        originalImage: dataUrl,
        processedImage: null,
        processing: true,
        modelLoading: true,
        progress: 0,
      });

      try {
        // Remove background using @imgly/background-removal
        const blob = await removeBackground(dataUrl, {
          progress: (key: string, current: number, total: number) => {
            const pct = total > 0 ? Math.round((current / total) * 100) : 0;
            if (key === 'compute:inference') {
              onConfigChange({ modelLoading: false, progress: pct });
            } else {
              onConfigChange({ progress: Math.min(pct, 50) });
            }
          },
        });

        const processedUrl = URL.createObjectURL(blob);
        onConfigChange({
          processedImage: processedUrl,
          processing: false,
          modelLoading: false,
          progress: 100,
        });

        // Switch to background tab automatically
        setTab('background');
      } catch (err) {
        console.error('Background removal failed:', err);
        onConfigChange({
          processing: false,
          modelLoading: false,
          progress: 0,
        });
      }
    };
    reader.readAsDataURL(file);
  }, [onConfigChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <aside className="w-80 min-w-[320px] bg-zinc-900/80 border-r border-zinc-800/50 flex flex-col h-full">
      {/* ── App header ── */}
      <div className="px-5 py-4 border-b border-zinc-800/50">
        <h1 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
          <span className="text-2xl">👤</span> Profile Picture
          <span className="text-xs text-zinc-500 font-normal ml-auto">LinkedIn</span>
        </h1>
        <div className="mt-2 flex gap-3">
          <button
            onClick={onSwitchToCarousel}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            ← Carousel
          </button>
          <button
            onClick={onSwitchToBanner}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            🖼️ Banner
          </button>
        </div>
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
        {tab === 'upload' && (
          <UploadTab
            config={config}
            onConfigChange={onConfigChange}
            onFileSelect={handleFileSelect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            fileInputRef={fileInputRef}
          />
        )}
        {tab === 'background' && (
          <BackgroundTab config={config} onConfigChange={onConfigChange} />
        )}
        {tab === 'adjust' && (
          <AdjustTab config={config} onConfigChange={onConfigChange} />
        )}
      </div>

      {/* ── Export bar ── */}
      <div className="px-4 py-3 border-t border-zinc-800/50 space-y-2">
        <button
          onClick={onExportPng}
          disabled={exporting || !config.processedImage}
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
          400 × 400px · Ready for LinkedIn
        </p>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════
//  Upload Tab
// ═══════════════════════════════════════════════════

function UploadTab({
  config,
  onConfigChange,
  onFileSelect,
  onDrop,
  onDragOver,
  fileInputRef,
}: {
  config: ProfilePicConfig;
  onConfigChange: (partial: Partial<ProfilePicConfig>) => void;
  onFileSelect: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <>
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-zinc-700 hover:border-blue-500/50 rounded-xl p-8 text-center cursor-pointer transition-colors group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
          {config.originalImage ? '🔄' : '📷'}
        </div>
        <div className="text-sm text-zinc-300 font-medium">
          {config.originalImage ? 'Upload a different photo' : 'Drop your photo here'}
        </div>
        <div className="text-xs text-zinc-500 mt-1">
          or click to browse · JPG, PNG, WebP
        </div>
      </div>

      {/* Status */}
      {config.processing && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-blue-300">
            <span className="animate-spin">⏳</span>
            {config.modelLoading
              ? 'Loading AI model (first time ~180MB)...'
              : 'Removing background...'}
          </div>
          {config.progress > 0 && (
            <div className="mt-2 w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${config.progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {config.processedImage && !config.processing && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-green-300">
            <span>✅</span> Background removed successfully!
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            Switch to Background tab to customize colors
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-zinc-500 space-y-1.5">
        <div className="flex items-start gap-2">
          <span>🔒</span>
          <span>100% private — your photo is processed locally in the browser. Nothing is uploaded to any server.</span>
        </div>
        <div className="flex items-start gap-2">
          <span>🧠</span>
          <span>AI-powered background removal using ONNX neural network.</span>
        </div>
        <div className="flex items-start gap-2">
          <span>⏱️</span>
          <span>First use downloads ~180MB model (cached for future use).</span>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════
//  Background Tab
// ═══════════════════════════════════════════════════

function BackgroundTab({
  config,
  onConfigChange,
}: {
  config: ProfilePicConfig;
  onConfigChange: (partial: Partial<ProfilePicConfig>) => void;
}) {
  const bgTypes: { id: BackgroundType; label: string; icon: string }[] = [
    { id: 'gradient', label: 'Gradient', icon: '🌈' },
    { id: 'solid', label: 'Solid', icon: '⬛' },
    { id: 'theme-match', label: 'Theme', icon: '🎨' },
  ];

  return (
    <>
      {/* ━━ Quick Presets ━━ */}
      <div>
        <label className="block text-xs font-semibold text-zinc-300 mb-2">⚡ Quick Presets</label>
        <div className="grid grid-cols-2 gap-1.5">
          {COMPOSITION_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onConfigChange(preset.config)}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-600/50"
            >
              <span className="text-base">{preset.emoji}</span>
              <div className="min-w-0">
                <div className="text-[11px] font-medium truncate">{preset.name}</div>
                <div className="text-[9px] text-zinc-500 truncate">{preset.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-800/40" />

      {/* Background type */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Background Type</label>
        <div className="flex gap-1.5">
          {bgTypes.map(bt => (
            <button
              key={bt.id}
              onClick={() => onConfigChange({ backgroundType: bt.id })}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                config.backgroundType === bt.id
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800'
              }`}
            >
              <span className="mr-1">{bt.icon}</span>{bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gradient presets */}
      {config.backgroundType === 'gradient' && (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">Gradient Presets</label>
          <div className="grid grid-cols-3 gap-2">
            {GRADIENT_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() =>
                  onConfigChange({
                    gradientStart: preset.start,
                    gradientEnd: preset.end,
                    gradientAngle: preset.angle,
                  })
                }
                className={`rounded-lg overflow-hidden transition-all cursor-pointer ${
                  config.gradientStart === preset.start && config.gradientEnd === preset.end
                    ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-zinc-900'
                    : 'hover:ring-1 hover:ring-zinc-600'
                }`}
              >
                <div
                  className="h-10 w-full"
                  style={{
                    backgroundImage: `linear-gradient(${preset.angle}deg, ${preset.start}, ${preset.end})`,
                  }}
                />
                <div className="text-[10px] text-zinc-400 py-1 text-center bg-zinc-800/80">
                  {preset.name}
                </div>
              </button>
            ))}
          </div>

          {/* Custom gradient controls */}
          <div className="mt-3 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] text-zinc-500 mb-1">Start</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={config.gradientStart}
                    onChange={e => onConfigChange({ gradientStart: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border border-zinc-700"
                  />
                  <input
                    type="text"
                    value={config.gradientStart}
                    onChange={e => onConfigChange({ gradientStart: e.target.value })}
                    className="flex-1 bg-zinc-800 text-zinc-300 text-xs px-2 py-1.5 rounded border border-zinc-700 font-mono"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[10px] text-zinc-500 mb-1">End</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={config.gradientEnd}
                    onChange={e => onConfigChange({ gradientEnd: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border border-zinc-700"
                  />
                  <input
                    type="text"
                    value={config.gradientEnd}
                    onChange={e => onConfigChange({ gradientEnd: e.target.value })}
                    className="flex-1 bg-zinc-800 text-zinc-300 text-xs px-2 py-1.5 rounded border border-zinc-700 font-mono"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 mb-1">
                Angle: {config.gradientAngle}°
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={config.gradientAngle}
                onChange={e => onConfigChange({ gradientAngle: Number(e.target.value) })}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Solid color presets */}
      {config.backgroundType === 'solid' && (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">Color Presets</label>
          <div className="grid grid-cols-6 gap-2">
            {SOLID_COLOR_PRESETS.map(color => (
              <button
                key={color}
                onClick={() => onConfigChange({ solidColor: color })}
                className={`w-full aspect-square rounded-lg cursor-pointer transition-all ${
                  config.solidColor === color
                    ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-zinc-900'
                    : 'hover:ring-1 hover:ring-zinc-600'
                }`}
                style={{ backgroundColor: color, border: '1px solid rgba(255,255,255,0.1)' }}
                title={color}
              />
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="color"
              value={config.solidColor}
              onChange={e => onConfigChange({ solidColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer border border-zinc-700"
            />
            <input
              type="text"
              value={config.solidColor}
              onChange={e => onConfigChange({ solidColor: e.target.value })}
              className="flex-1 bg-zinc-800 text-zinc-300 text-xs px-2 py-1.5 rounded border border-zinc-700 font-mono"
            />
          </div>
        </div>
      )}

      {/* Theme match */}
      {config.backgroundType === 'theme-match' && (
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">Match Banner Theme</label>
          <div className="space-y-1.5">
            {THEMES.filter(t => t.category === 'dark').slice(0, 8).map(theme => (
              <button
                key={theme.id}
                onClick={() => onConfigChange({ themeId: theme.id })}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  config.themeId === theme.id
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-800'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-md border border-zinc-600/50"
                  style={{ backgroundColor: theme.bg }}
                />
                <span>{theme.name}</span>
                <div
                  className="w-3 h-3 rounded-full ml-auto"
                  style={{ backgroundColor: theme.accent }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════
//  Adjust Tab
// ═══════════════════════════════════════════════════

function AdjustTab({
  config,
  onConfigChange,
}: {
  config: ProfilePicConfig;
  onConfigChange: (partial: Partial<ProfilePicConfig>) => void;
}) {
  return (
    <>
      {/* Circle preview toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.circlePreview}
            onChange={e => onConfigChange({ circlePreview: e.target.checked })}
            className="accent-blue-500"
          />
          <span className="text-xs text-zinc-300">Circle preview (LinkedIn crops to circle)</span>
        </label>
      </div>

      {/* Scale */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          Zoom: {Math.round(config.imageScale * 100)}%
        </label>
        <input
          type="range"
          min={50}
          max={200}
          value={Math.round(config.imageScale * 100)}
          onChange={e => onConfigChange({ imageScale: Number(e.target.value) / 100 })}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Offset X */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          Horizontal Offset: {config.offsetX}px
        </label>
        <input
          type="range"
          min={-100}
          max={100}
          value={config.offsetX}
          onChange={e => onConfigChange({ offsetX: Number(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Offset Y */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">
          Vertical Offset: {config.offsetY}px
        </label>
        <input
          type="range"
          min={-100}
          max={100}
          value={config.offsetY}
          onChange={e => onConfigChange({ offsetY: Number(e.target.value) })}
          className="w-full accent-blue-500"
        />
      </div>

      {/* Reset */}
      <button
        onClick={() =>
          onConfigChange({
            imageScale: 1,
            offsetX: 0,
            offsetY: 0,
          })
        }
        className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-colors cursor-pointer"
      >
        ↩ Reset Position
      </button>

      {/* ── Effects ── */}
      <div className="border-t border-zinc-800/50 pt-4 mt-2 space-y-4">
        <label className="block text-xs font-semibold text-zinc-300">Effects</label>

        {/* Edge softening */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-2">
            Edge Softening: {config.edgeSoftening === 0 ? 'Off' : config.edgeSoftening}
          </label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={config.edgeSoftening}
            onChange={e => onConfigChange({ edgeSoftening: Number(e.target.value) })}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5">
            <span>None</span><span>Subtle</span><span>Strong</span>
          </div>
        </div>

        {/* Drop shadow */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.dropShadow}
            onChange={e => onConfigChange({ dropShadow: e.target.checked })}
            className="accent-blue-500"
          />
          <span className="text-xs text-zinc-300">Drop shadow (adds depth)</span>
        </label>

        {/* Vignette */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.vignette}
            onChange={e => onConfigChange({ vignette: e.target.checked })}
            className="accent-blue-500"
          />
          <span className="text-xs text-zinc-300">Vignette (darkens edges)</span>
        </label>
      </div>
    </>
  );
}
