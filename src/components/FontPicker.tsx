import { FONT_SETS } from '../data/fonts';

interface FontPickerProps {
  currentId: string;
  onChange: (id: string) => void;
}

export default function FontPicker({ currentId, onChange }: FontPickerProps) {
  return (
    <div>
      <label className="sidebar-label">Font Preset</label>
      <select
        className="sidebar-select mb-3"
        value={currentId}
        onChange={e => onChange(e.target.value)}
      >
        {FONT_SETS.map(fs => (
          <option key={fs.id} value={fs.id}>{fs.label}</option>
        ))}
      </select>

      {/* Preview */}
      {(() => {
        const fs = FONT_SETS.find(f => f.id === currentId) ?? FONT_SETS[0];
        return (
          <div className="bg-zinc-800/40 rounded-lg p-3 space-y-1.5">
            <div style={{ fontFamily: `'${fs.heading}', sans-serif` }} className="text-sm font-bold text-zinc-200">
              Heading: {fs.heading}
            </div>
            <div style={{ fontFamily: `'${fs.body}', sans-serif` }} className="text-xs text-zinc-400">
              Body text: {fs.body}
            </div>
            <div style={{ fontFamily: `'${fs.code}', monospace` }} className="text-xs text-zinc-500 font-mono">
              {'const code = "'}
              <span className="text-blue-400">{fs.code}</span>
              {'";'}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
