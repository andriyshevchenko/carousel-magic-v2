import { useState, useEffect } from 'react';
import type { CarouselConfig, Slide, CarouselTemplate } from '../types';
import { loadTemplates, saveTemplate, deleteTemplate } from '../utils/templates';

interface TemplateManagerProps {
  config: CarouselConfig;
  slides: Slide[];
  onLoad: (config: CarouselConfig, slides: Slide[]) => void;
}

export default function TemplateManager({ config, slides, onLoad }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<CarouselTemplate[]>([]);
  const [name, setName] = useState('');
  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    saveTemplate(name.trim(), config, slides);
    setTemplates(loadTemplates());
    setName('');
    setShowSave(false);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setTemplates(loadTemplates());
  };

  return (
    <div className="space-y-3">
      <label className="sidebar-label">Templates</label>

      <div className="flex gap-2">
        <button
          onClick={() => setShowSave(!showSave)}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg py-2 px-3 transition-colors cursor-pointer"
        >
          💾 Save Current
        </button>
      </div>

      {showSave && (
        <div className="flex gap-2">
          <input
            className="sidebar-input flex-1"
            placeholder="Template name…"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg px-3 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      )}

      {templates.length === 0 && (
        <div className="text-xs text-zinc-500 text-center py-4">No saved templates yet</div>
      )}

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {templates.map(t => (
          <div
            key={t.id}
            className="flex items-center justify-between bg-zinc-800/40 rounded-lg px-3 py-2 group"
          >
            <button
              onClick={() => onLoad(t.config, t.slides)}
              className="text-left flex-1 cursor-pointer"
            >
              <div className="text-sm text-zinc-200 font-medium">{t.name}</div>
              <div className="text-[10px] text-zinc-500">
                {t.slides.length} slides · {t.config.themeId} · {new Date(t.createdAt).toLocaleDateString()}
              </div>
            </button>
            <button
              onClick={() => handleDelete(t.id)}
              className="text-zinc-500 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2 cursor-pointer"
              title="Delete template"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
