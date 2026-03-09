import { THEMES } from '../data/themes';
import type { Theme } from '../types';

interface ThemePickerProps {
  currentId: string;
  onChange: (id: string) => void;
}

export default function ThemePicker({ currentId, onChange }: ThemePickerProps) {
  const dark = THEMES.filter(t => t.category === 'dark');
  const light = THEMES.filter(t => t.category === 'light');

  return (
    <div>
      <label className="sidebar-label">Theme</label>

      {/* Dark themes */}
      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-semibold">Dark</div>
        <div className="grid grid-cols-3 gap-1.5">
          {dark.map(t => (
            <ThemeSwatch key={t.id} theme={t} active={t.id === currentId} onClick={() => onChange(t.id)} />
          ))}
        </div>
      </div>

      {/* Light themes */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2 font-semibold">Light</div>
        <div className="grid grid-cols-3 gap-1.5">
          {light.map(t => (
            <ThemeSwatch key={t.id} theme={t} active={t.id === currentId} onClick={() => onChange(t.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeSwatch({ theme, active, onClick }: { theme: Theme; active: boolean; onClick: () => void }) {
  const isGrad = theme.bg.startsWith('linear');
  return (
    <button
      onClick={onClick}
      title={theme.name}
      className={`
        relative rounded-lg overflow-hidden transition-all duration-150 cursor-pointer
        ${active ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-zinc-900' : 'hover:ring-1 hover:ring-zinc-600'}
      `}
      style={{ height: 44 }}
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={isGrad ? { backgroundImage: theme.bg } : { backgroundColor: theme.bg }}
      />
      {/* Colour dots preview */}
      <div className="absolute inset-0 flex items-center justify-center gap-1">
        <span className="w-2 h-2 rounded-full" style={{ background: theme.accent }} />
        <span className="w-2 h-2 rounded-full" style={{ background: theme.syntax.keyword }} />
        <span className="w-2 h-2 rounded-full" style={{ background: theme.syntax.string }} />
        <span className="w-2 h-2 rounded-full" style={{ background: theme.syntax.function }} />
      </div>
      {/* Name label */}
      <div
        className="absolute bottom-0 inset-x-0 text-center py-0.5"
        style={{
          fontSize: 8,
          color: theme.fg,
          background: `${theme.editorBg}cc`,
          fontWeight: 600,
          letterSpacing: '0.02em',
        }}
      >
        {theme.name}
      </div>
    </button>
  );
}
