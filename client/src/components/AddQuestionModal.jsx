import { useState } from 'react';
import { fetchByUrl } from '../api/index.js';

const PLATFORMS = {
  leetcode:    { label: 'LeetCode',   icon: '🟡', color: 'text-yellow-400' },
  codeforces:  { label: 'Codeforces', icon: '🔵', color: 'text-blue-400'   },
};

function detectPlatform(url = '') {
  if (url.includes('leetcode.com'))    return 'leetcode';
  if (url.includes('codeforces.com'))  return 'codeforces';
  return null;
}

const DIFF_STYLE = {
  Easy:   'diff-easy',
  Medium: 'diff-medium',
  Hard:   'diff-hard',
};

export default function AddQuestionModal({ topicId, topicTitle, onSave, onClose }) {
  const [url,       setUrl]       = useState('');
  const [fetching,  setFetching]  = useState(false);
  const [fetchErr,  setFetchErr]  = useState('');
  const [preview,   setPreview]   = useState(null);   // fetched problem
  const [saving,    setSaving]    = useState(false);

  const platform = detectPlatform(url);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setFetching(true);
    setFetchErr('');
    setPreview(null);
    try {
      const data = await fetchByUrl(url.trim());
      setPreview(data);
    } catch (err) {
      setFetchErr(err?.response?.data?.error || err.message || 'Fetch failed');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    setSaving(true);
    try {
      await onSave(topicId, preview);
      onClose();
    } catch {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-navy-900 border border-navy-700 rounded-2xl w-[580px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-navy-800 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">Add Question</h2>
            <p className="text-navy-400 text-xs mt-0.5">to <span className="text-gold-400">{topicTitle}</span></p>
          </div>
          <button onClick={onClose} className="text-navy-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* URL input */}
          <div>
            <label className="text-navy-400 text-xs font-bold uppercase tracking-wider block mb-2">
              LeetCode or Codeforces URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                {platform && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">
                    {PLATFORMS[platform].icon}
                  </span>
                )}
                <input
                  autoFocus
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setFetchErr(''); setPreview(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                  placeholder="https://leetcode.com/problems/binary-search/"
                  className={`w-full bg-navy-800 border border-navy-600 focus:border-gold-500 text-white placeholder-navy-600 rounded-xl py-3 outline-none transition-colors text-sm font-mono ${platform ? 'pl-9 pr-4' : 'px-4'}`}
                />
              </div>
              <button
                onClick={handleFetch}
                disabled={!url.trim() || fetching}
                className="px-5 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 flex-shrink-0"
              >
                {fetching ? (
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-9-9"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.43"/>
                  </svg>
                )}
                {fetching ? 'Fetching…' : 'Fetch'}
              </button>
            </div>

            {/* Platform hint */}
            {!platform && url.trim() && (
              <p className="text-navy-500 text-xs mt-2">
                Supported: leetcode.com/problems/… or codeforces.com/contest/…
              </p>
            )}

            {/* Error */}
            {fetchErr && (
              <div className="mt-3 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p className="text-red-400 text-xs leading-relaxed">{fetchErr}</p>
              </div>
            )}
          </div>

          {/* ── Preview card ───── */}
          {preview && (
            <div className="bg-navy-800/60 border border-navy-700 rounded-xl overflow-hidden animate-fade-in">
              {/* Preview header */}
              <div className="px-4 py-3 bg-navy-800 border-b border-navy-700 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Fetched Successfully</span>
              </div>

              <div className="p-4 space-y-3">
                {/* Title + badges */}
                <div>
                  <h3 className="text-white font-bold text-base">{preview.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${DIFF_STYLE[preview.difficulty] || 'diff-medium'}`}>
                      {preview.difficulty}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-navy-750 border border-navy-600 text-navy-300">
                      {preview.platform}
                    </span>
                    {preview.tags?.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statement preview */}
                {preview.statement && (
                  <div>
                    <p className="text-navy-400 text-[10px] uppercase tracking-wider font-bold mb-1">Statement Preview</p>
                    <p className="text-navy-300 text-xs leading-relaxed line-clamp-4">{preview.statement}</p>
                  </div>
                )}

                {/* Examples count */}
                {preview.examples?.length > 0 && (
                  <p className="text-navy-400 text-xs">
                    ✓ {preview.examples.length} example{preview.examples.length > 1 ? 's' : ''} extracted
                  </p>
                )}
                {preview.constraints && (
                  <p className="text-navy-400 text-xs">✓ Constraints extracted</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-800 flex gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 py-3 bg-navy-800 hover:bg-navy-700 text-navy-300 font-medium rounded-xl transition-colors text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!preview || saving}
            className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm"
          >
            {saving ? 'Adding…' : `Add to "${topicTitle}"`}
          </button>
        </div>
      </div>
    </div>
  );
}
