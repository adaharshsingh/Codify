import { useState } from 'react';
import ProblemRow from './ProblemRow.jsx';

const COLOR_MAP = {
  emerald: 'text-emerald-400',
  violet:  'text-violet-400',
  sky:     'text-sky-400',
  gold:    'text-gold-400',
};

export default function TopicAccordion({ topic, progress, activeProblemId, onSelect, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  const total  = topic.problems.length;
  const solved = topic.problems.filter((p) => progress[p.id]?.solved).length;

  return (
    <div className="border-b border-navy-800/60 last:border-0">
      {/* Accordion header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-navy-800/40 transition-colors text-left group"
      >
        <span className="text-base leading-none">{topic.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-semibold truncate group-hover:text-gold-300 transition-colors">
            {topic.title}
          </div>
          <div className="text-navy-500 text-[10px] mt-0.5">
            {solved}/{total} solved
          </div>
        </div>

        {/* Mini progress */}
        <div className="w-8 h-1 bg-navy-700 rounded-full overflow-hidden flex-shrink-0">
          <div
            className="h-full bg-gold-500 rounded-full transition-all duration-500"
            style={{ width: total ? `${(solved / total) * 100}%` : '0%' }}
          />
        </div>

        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`text-navy-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {/* Problem list */}
      {open && (
        <div className="pb-1">
          {topic.problems.map((p) => (
            <ProblemRow
              key={p.id}
              problem={p}
              isActive={p.id === activeProblemId}
              isSolved={progress[p.id]?.solved}
              onSelect={() => onSelect(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
