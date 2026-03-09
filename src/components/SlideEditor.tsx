import type { Slide, SlideType } from '../types';

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (partial: Partial<Slide>) => void;
}

const LANGS = [
  'javascript', 'typescript', 'csharp', 'python', 'java', 'go', 'rust',
  'jsx', 'tsx', 'bash', 'json', 'yaml', 'css', 'sql', 'html',
];

export default function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="sidebar-label">Slide Type</label>
        <select
          className="sidebar-select"
          value={slide.type}
          onChange={e => onUpdate({ type: e.target.value as SlideType })}
        >
          <option value="hook">🎯 Hook (Title)</option>
          <option value="content">📝 Content</option>
          <option value="code">💻 Code</option>
          <option value="cta">📢 CTA (Call to Action)</option>
        </select>
      </div>

      {/* Title – for hook, content, cta */}
      {(slide.type === 'hook' || slide.type === 'content' || slide.type === 'cta') && (
        <div>
          <label className="sidebar-label">Title</label>
          <textarea
            className="sidebar-textarea"
            rows={3}
            value={slide.title || ''}
            onChange={e => onUpdate({ title: e.target.value })}
            placeholder="Enter title..."
          />
        </div>
      )}

      {/* Subtitle – hook only */}
      {slide.type === 'hook' && (
        <div>
          <label className="sidebar-label">Subtitle</label>
          <input
            className="sidebar-input"
            value={slide.subtitle || ''}
            onChange={e => onUpdate({ subtitle: e.target.value })}
            placeholder="A short description..."
          />
        </div>
      )}

      {/* Body – content & cta */}
      {(slide.type === 'content' || slide.type === 'cta') && (
        <div>
          <label className="sidebar-label">Body</label>
          <textarea
            className="sidebar-textarea"
            rows={6}
            value={slide.body || ''}
            onChange={e => onUpdate({ body: e.target.value })}
            placeholder="Use bullet points with • or -"
          />
        </div>
      )}

      {/* Code fields */}
      {slide.type === 'code' && (
        <>
          <div>
            <label className="sidebar-label">Text Above Code</label>
            <textarea
              className="sidebar-textarea"
              rows={3}
              value={slide.codeTextAbove || ''}
              onChange={e => onUpdate({ codeTextAbove: e.target.value })}
              placeholder="Optional text above code block. Use # for heading, • or - for bullets"
            />
          </div>
          <div>
            <label className="sidebar-label">Language</label>
            <select
              className="sidebar-select"
              value={slide.codeLang || 'javascript'}
              onChange={e => onUpdate({ codeLang: e.target.value })}
            >
              {LANGS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="sidebar-label">Code</label>
            <textarea
              className="sidebar-textarea font-mono"
              rows={10}
              value={slide.code || ''}
              onChange={e => onUpdate({ code: e.target.value })}
              placeholder="Paste your code here..."
              style={{ fontSize: 12, lineHeight: 1.6 }}
            />
          </div>
          <div>
            <label className="sidebar-label">Caption</label>
            <input
              className="sidebar-input"
              value={slide.codeCaption || ''}
              onChange={e => onUpdate({ codeCaption: e.target.value })}
              placeholder="Optional caption below code editor"
            />
          </div>
          <div>
            <label className="sidebar-label">Text Below Code</label>
            <textarea
              className="sidebar-textarea"
              rows={3}
              value={slide.codeTextBelow || ''}
              onChange={e => onUpdate({ codeTextBelow: e.target.value })}
              placeholder="Optional text below code block"
            />
          </div>
        </>
      )}
    </div>
  );
}
