import { useState } from 'react';
import AddQuestionModal from './AddQuestionModal.jsx';
import AddTopicModal    from './AddTopicModal.jsx';
import { ProgressDonut } from './DonutChart.jsx';
import { addProblem, removeProblem, deleteTopic as apiDeleteTopic } from '../api/index.js';

const DIFF_STYLE = {
  Easy:   'diff-easy',
  Medium: 'diff-medium',
  Hard:   'diff-hard',
};

// ── Single topic accordion section ──────────────────────────────────────
function TopicSection({ topic, progress, onProblemClick, onTopicChange, revisionMode }) {
  const [open,     setOpen]     = useState(true);
  const [addModal, setAddModal] = useState(false);

  const problems = revisionMode
    ? topic.problems.filter((p) => progress[p.id]?.starred)
    : topic.problems;

  const total  = topic.problems.length;
  const solved = topic.problems.filter((p) => progress[p.id]?.solved).length;

  const handleAddSave = async (topicId, data) => {
    const created = await addProblem(topicId, data);
    onTopicChange(topicId, 'addProblem', created);
  };

  const handleDeleteProblem = async (e, pid) => {
    e.stopPropagation();
    if (!confirm('Remove this problem?')) return;
    await removeProblem(pid);
    onTopicChange(topic.id, 'deleteProblem', pid);
  };

  const handleDeleteTopic = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete topic "${topic.title}" and all its problems?`)) return;
    await apiDeleteTopic(topic.id);
    onTopicChange(topic.id, 'deleteTopic', null);
  };

  // Skip empty topics in revision mode
  if (revisionMode && problems.length === 0) return null;

  return (
    <div className="border border-navy-800 rounded-xl overflow-hidden mb-3">
      {/* Topic header row */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-navy-900/60 hover:bg-navy-800/60 cursor-pointer transition-colors group"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          className={`text-navy-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        >
          <path d="m9 18 6-6-6-6"/>
        </svg>

        {/* Icon + title */}
        <span className="text-lg flex-shrink-0">{topic.icon}</span>
        <span className="text-white font-semibold text-sm flex-1">{topic.title}</span>

        {/* Progress bar */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="w-32 h-1.5 bg-navy-800 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-gold-500 rounded-full transition-all duration-500"
              style={{ width: total ? `${(solved / total) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-navy-400 text-xs font-mono w-12 text-right flex-shrink-0">{solved} / {total}</span>
        </div>

        {/* Buttons — appear on hover */}
        <div
          className="flex items-center gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-navy-700 border border-navy-600 text-navy-300 hover:border-gold-500/50 hover:text-gold-400 transition-all"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add
          </button>
          <button
            onClick={handleDeleteTopic}
            className="text-navy-600 hover:text-red-400 transition-colors p-1 rounded"
            title="Delete topic"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Problem table */}
      {open && (
        <div className="animate-fade-in">
          {problems.length === 0 ? (
            <div className="flex items-center gap-3 px-6 py-5 text-navy-600 text-sm bg-navy-950/30">
              No problems yet.{' '}
              <button onClick={() => setAddModal(true)} className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
                Add one →
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-t border-navy-800/50 bg-navy-950/30">
                  <th className="text-left pl-10 pr-2 py-2 text-[10px] text-navy-600 uppercase tracking-wider font-semibold w-8">✓</th>
                  <th className="text-left px-2 py-2 text-[10px] text-navy-600 uppercase tracking-wider font-semibold w-10">#</th>
                  <th className="text-left px-2 py-2 text-[10px] text-navy-600 uppercase tracking-wider font-semibold">Title</th>
                  <th className="text-left px-2 py-2 text-[10px] text-navy-600 uppercase tracking-wider font-semibold w-24">Difficulty</th>
                  <th className="text-left px-2 py-2 text-[10px] text-navy-600 uppercase tracking-wider font-semibold w-28 hidden sm:table-cell">Platform</th>
                  <th className="text-right px-4 py-2 text-[10px] text-navy-600 uppercase tracking-wider font-semibold w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, idx) => {
                  const isSolved  = progress[p.id]?.solved;
                  const isStarred = progress[p.id]?.starred;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onProblemClick(p.id)}
                      className="border-t border-navy-800/30 hover:bg-navy-800/30 cursor-pointer transition-colors group/row"
                    >
                      {/* Solved dot */}
                      <td className="pl-10 pr-2 py-3">
                        <span className={`w-2.5 h-2.5 rounded-full inline-block transition-colors ${isSolved ? 'bg-emerald-400' : 'bg-navy-700 group-hover/row:bg-navy-600'}`} />
                      </td>
                      {/* # */}
                      <td className="px-2 py-3 text-navy-600 font-mono text-xs">{idx + 1}</td>
                      {/* Title */}
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium transition-colors ${isSolved ? 'text-navy-600 line-through' : 'text-navy-100 group-hover/row:text-white'}`}>
                            {p.title}
                          </span>
                          {isStarred && <span className="text-gold-400 text-xs">⭐</span>}
                        </div>
                      </td>
                      {/* Difficulty */}
                      <td className="px-2 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_STYLE[p.difficulty] || 'diff-medium'}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      {/* Platform */}
                      <td className="px-2 py-3 hidden sm:table-cell">
                        <span className="text-navy-500 text-xs">{p.platform}</span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                          {p.lcLink && (
                            <button
                              onClick={(e) => { e.stopPropagation(); window.open(p.lcLink, '_blank'); }}
                              title="Open link" className="text-navy-500 hover:text-gold-400 transition-colors"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteProblem(e, p.id)}
                            title="Remove" className="text-navy-600 hover:text-red-400 transition-colors"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6 6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {addModal && (
        <AddQuestionModal
          topicId={topic.id}
          topicTitle={topic.title}
          onSave={handleAddSave}
          onClose={() => setAddModal(false)}
        />
      )}
    </div>
  );
}

// ── Main ProblemsTable export ────────────────────────────────────────────
export default function ProblemsTable({
  topics, progress, onProblemClick, onTopicsChange,
  tab, sheetId, sheetName, sheetDesc,
}) {
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [search,       setSearch]       = useState('');

  const revisionMode = tab === 'revision';

  const allProblems   = topics.flatMap((t) => t.problems);
  const totalSolved   = allProblems.filter((p) => progress[p.id]?.solved).length;
  const totalProblems = allProblems.length;

  const handleTopicChange = (topicId, action, payload) => {
    onTopicsChange((prev) => {
      if (action === 'deleteTopic')   return prev.filter((t) => t.id !== topicId);
      if (action === 'addProblem')    return prev.map((t) => t.id === topicId ? { ...t, problems: [...t.problems, payload] } : t);
      if (action === 'deleteProblem') return prev.map((t) => t.id === topicId ? { ...t, problems: t.problems.filter((p) => p.id !== payload) } : t);
      return prev;
    });
  };

  const handleTopicAdded = (topic) => {
    onTopicsChange((prev) => [...prev, { ...topic, problems: [] }]);
  };

  // Filter by search
  const visibleTopics = search.trim()
    ? topics.map((t) => ({
        ...t,
        problems: t.problems.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
      })).filter((t) => t.problems.length > 0)
    : topics;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Sheet meta header ──────────────────────────── */}
      <div className="px-6 pt-5 pb-4 border-b border-navy-800 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-black text-xl leading-tight">
              {sheetName || 'CP Revision Sheet'}
            </h2>
            {sheetDesc && (
              <p className="text-navy-400 text-xs mt-1 leading-relaxed max-w-xl">{sheetDesc}</p>
            )}
            <p className="text-navy-600 text-[11px] mt-1.5">
              💡 <span className="text-navy-400">Recommended:</span>{' '}
              Solve Easy problems across all topics first, then Medium, then Hard.
            </p>
          </div>

          {/* Compact overall donut */}
          <ProgressDonut value={totalSolved} total={totalProblems} size={70} strokeWidth={9} />
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────── */}
      <div className="px-6 py-3 border-b border-navy-800 flex-shrink-0 flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-500" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems…"
            className="w-full bg-navy-800 border border-navy-700 focus:border-gold-500/60 text-white placeholder-navy-600 rounded-lg pl-8 pr-3 py-2 text-xs outline-none transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-navy-500 hover:text-white">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>

        {/* Problem count */}
        <span className="text-navy-500 text-xs hidden sm:block">{totalProblems} problems</span>

        <div className="flex-1" />

        {/* Add Topic button */}
        <button
          onClick={() => setShowAddTopic(true)}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2 bg-gold-500 hover:bg-gold-400 text-white rounded-xl transition-all hover:shadow-lg hover:shadow-gold-500/20 hover:-translate-y-0.5 duration-200"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
          Add Topic
        </button>
      </div>

      {/* ── Topic list ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {revisionMode && allProblems.filter((p) => progress[p.id]?.starred).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-white font-semibold text-lg">No starred problems yet</p>
            <p className="text-navy-400 text-sm mt-2">Star problems from the answer panel to add them to your revision list.</p>
          </div>
        ) : visibleTopics.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-navy-400 text-sm">No problems match your search.</p>
          </div>
        ) : (
          visibleTopics.map((topic) => (
            <TopicSection
              key={topic.id}
              topic={topic}
              progress={progress}
              onProblemClick={onProblemClick}
              onTopicChange={handleTopicChange}
              revisionMode={revisionMode}
            />
          ))
        )}

        {/* Empty state for no topics */}
        {topics.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="text-6xl mb-4 animate-float">📋</div>
            <p className="text-white font-semibold text-xl mb-2">No topics yet</p>
            <p className="text-navy-400 text-sm mb-6">Create your first topic to start adding problems.</p>
            <button
              onClick={() => setShowAddTopic(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-white font-bold rounded-xl transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add First Topic
            </button>
          </div>
        )}
      </div>

      {showAddTopic && (
        <AddTopicModal sheetId={sheetId} onAdded={handleTopicAdded} onClose={() => setShowAddTopic(false)} />
      )}
    </div>
  );
}
