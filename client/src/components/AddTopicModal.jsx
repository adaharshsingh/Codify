import { useState } from 'react';
import { createTopic } from '../api/index.js';

const ICONS  = ['📝','🔍','⚡','🌐','🌲','📊','🧮','🔢','💡','🎯','🧠','🔥','🏆','⚙️','🔄'];
const COLORS = [
  { key: 'emerald', label: 'Green',  swatch: 'bg-emerald-500' },
  { key: 'violet',  label: 'Violet', swatch: 'bg-violet-500'  },
  { key: 'sky',     label: 'Sky',    swatch: 'bg-sky-500'     },
  { key: 'gold',    label: 'Gold',   swatch: 'bg-gold-500'    },
  { key: 'rose',    label: 'Rose',   swatch: 'bg-rose-500'    },
];

export default function AddTopicModal({ onAdded, onClose }) {
  const [form,   setForm]   = useState({ title: '', icon: '📝', color: 'violet' });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr('Topic name is required'); return; }
    setSaving(true);
    try {
      const topic = await createTopic({ title: form.title.trim(), icon: form.icon, color: form.color });
      onAdded(topic);
      onClose();
    } catch {
      setErr('Failed to create topic. Is the server running?');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-navy-900 border border-navy-700 rounded-2xl w-[460px] shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-navy-800 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Add New Topic</h2>
          <button onClick={onClose} className="text-navy-500 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Icon */}
          <div>
            <label className="text-navy-400 text-xs font-bold uppercase tracking-wider block mb-2">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setForm((f) => ({ ...f, icon: ic }))}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                    form.icon === ic
                      ? 'bg-gold-500/25 border-2 border-gold-500 scale-110'
                      : 'bg-navy-800 border-2 border-transparent hover:border-navy-600'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-navy-400 text-xs font-bold uppercase tracking-wider block mb-2">Color</label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setForm((f) => ({ ...f, color: c.key }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs ${
                    form.color === c.key
                      ? 'border-gold-500 bg-gold-500/10 text-gold-300'
                      : 'border-navy-700 bg-navy-800 text-navy-400 hover:border-navy-500'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.swatch}`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-navy-400 text-xs font-bold uppercase tracking-wider block mb-2">Topic Name *</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErr(''); }}
              placeholder="e.g. Dynamic Programming, Trees, Sorting…"
              className="w-full bg-navy-800 border border-navy-600 focus:border-gold-500 text-white placeholder-navy-500 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
            />
            {err && <p className="text-red-400 text-xs mt-2">{err}</p>}
          </div>

          {/* Preview */}
          <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">{form.icon}</span>
            <div>
              <div className="text-white font-semibold text-sm">{form.title || 'Topic Name'}</div>
              <div className="text-navy-500 text-xs">0 problems</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-3 bg-navy-800 hover:bg-navy-700 text-navy-300 font-medium rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-white font-bold rounded-xl transition-all text-sm"
            >
              {saving ? 'Creating…' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
