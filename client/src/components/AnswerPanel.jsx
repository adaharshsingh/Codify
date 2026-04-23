import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

export default function AnswerPanel({ problemId, sessionId, problem }) {
  const { progress, updateProgress } = useApp();
  const entry   = progress[problemId] || {};

  const [note,    setNote]    = useState(entry.note    ?? '');
  const [solved,  setSolved]  = useState(entry.solved  ?? false);
  const [starred, setStarred] = useState(entry.starred ?? false);
  const [saveMsg, setSaveMsg] = useState(''); // '' | 'saving' | 'saved'

  const textareaRef = useRef(null);

  // Sync state when problem changes
  useEffect(() => {
    const e = progress[problemId] || {};
    setNote(e.note ?? '');
    setSolved(e.solved ?? false);
    setStarred(e.starred ?? false);
    setSaveMsg('');
  }, [problemId]);

  // Debounced auto-save for notes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((pid, text) => {
      updateProgress(pid, { note: text });
      setSaveMsg('saved');
      setTimeout(() => setSaveMsg(''), 2000);
    }, 900),
    []
  );

  const handleNoteChange = (e) => {
    const text = e.target.value;
    setNote(text);
    setSaveMsg('saving');
    debouncedSave(problemId, text);
  };

  const toggleSolved = () => {
    const next = !solved;
    setSolved(next);
    updateProgress(problemId, { solved: next });
  };

  const toggleStar = () => {
    const next = !starred;
    setStarred(next);
    updateProgress(problemId, { starred: next });
  };

  const copyNote = () => {
    navigator.clipboard.writeText(note).then(() => {
      setSaveMsg('copied!');
      setTimeout(() => setSaveMsg(''), 1500);
    });
  };

  const clearNote = () => {
    if (note && !confirm('Clear your answer?')) return;
    setNote('');
    updateProgress(problemId, { note: '' });
  };

  return (
    <div className="h-full flex flex-col bg-navy-900/30 animate-fade-in">

      {/* Panel header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-navy-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-navy-500 font-bold uppercase tracking-widest">Your Answer</span>
          {/* Save indicator */}
          <span className={`text-[10px] font-medium transition-all ${
            saveMsg === 'saving'  ? 'text-gold-400' :
            saveMsg === 'saved'   ? 'text-emerald-400' :
            saveMsg === 'copied!' ? 'text-sky-400' : 'text-transparent'
          }`}>
            {saveMsg === 'saving'  ? '● Saving…' :
             saveMsg === 'saved'   ? '✓ Saved'   :
             saveMsg === 'copied!' ? '✓ Copied'  : '·'}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Mark Solved */}
          <button
            onClick={toggleSolved}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              solved
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-navy-800 border-navy-700 text-navy-400 hover:border-emerald-500/40 hover:text-emerald-400'
            }`}
          >
            {solved ? '✓ Solved' : '○ Mark Solved'}
          </button>

          {/* Star */}
          <button
            onClick={toggleStar}
            title="Star for revision"
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${
              starred
                ? 'bg-gold-500/20 border-gold-500/40 text-gold-400'
                : 'bg-navy-800 border-navy-700 text-navy-500 hover:text-gold-400'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>

          <div className="flex-1" />

          {/* Platform links */}
          {problem && (
            <div className="flex items-center gap-1.5">
              {problem.lcLink && (
                <a
                  href={problem.lcLink}
                  target="_blank"
                  rel="noreferrer"
                  title="Open on LeetCode"
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-navy-800 hover:bg-gold-500/20 text-navy-400 hover:text-gold-400 transition-all border border-navy-700 hover:border-gold-500/40"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.4 10.3c1-.5 1.4-1.6.9-2.6l-4-8c-.5-1-1.6-1.4-2.6-.9L.6 13.7c-1 .5-1.4 1.6-.9 2.6l4 8c.5 1 1.6 1.4 2.6.9l17.1-8.6zM7 18l3-3-3-3v6z"/>
                  </svg>
                </a>
              )}
              {problem.cfLink && (
                <a
                  href={problem.cfLink}
                  target="_blank"
                  rel="noreferrer"
                  title="Open on Codeforces"
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-navy-800 hover:bg-red-500/20 text-navy-400 hover:text-red-400 transition-all border border-navy-700 hover:border-red-500/40"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h4v4H3V3zm7 0h4v4h-4V3zm7 0h4v4h-4V3zM3 10h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4zM3 17h4v4H3v-4zm7 0h4v4h-4v-4z"/>
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Copy */}
          <button
            onClick={copyNote}
            title="Copy to clipboard"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-navy-800 border border-navy-700 text-navy-400 hover:text-white transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>

          {/* Clear */}
          <button
            onClick={clearNote}
            title="Clear"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-navy-800 border border-navy-700 text-navy-400 hover:text-red-400 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Editable notepad */}
      <div className="flex-1 relative overflow-hidden">
        <textarea
          ref={textareaRef}
          value={note}
          onChange={handleNoteChange}
          placeholder={
            `Write your approach, pseudocode, or solution here…\n\n` +
            `Tips:\n` +
            `• Start with brute force, then optimize\n` +
            `• Note time & space complexity\n` +
            `• Jot edge cases to watch out for`
          }
          className="
            absolute inset-0 w-full h-full
            bg-transparent resize-none outline-none
            text-navy-200 placeholder-navy-700
            font-mono text-sm leading-7
            px-5 py-4
            selection:bg-gold-500/30
          "
          spellCheck={false}
        />
        {/* Subtle line guide overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #94a3b8 27px, #94a3b8 28px)',
            backgroundPositionY: '16px',
          }}
        />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-5 py-2 border-t border-navy-800 flex items-center justify-between">
        <span className="text-navy-600 text-[10px] font-mono">
          {note.length} chars · {note.split('\n').length} lines
        </span>
        <span className="text-navy-600 text-[10px]">Auto-saved</span>
      </div>
    </div>
  );
}
