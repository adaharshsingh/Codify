import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getTopics, getProblem, getProgress, getSheets } from '../api/index.js';
import ProblemsTable from '../components/ProblemsTable.jsx';
import StatsPanel    from '../components/StatsPanel.jsx';
import QuestionPanel from '../components/QuestionPanel.jsx';
import AnswerPanel   from '../components/AnswerPanel.jsx';

export default function Sheet() {
  const { id: sheetId } = useParams();
  const navigate = useNavigate();
  const { user, sessionId, progress, loadProgress } = useApp();

  const [topics,          setTopics]         = useState([]);
  const [sheetMeta,       setSheetMeta]      = useState(null);
  const [loadingTopics,   setLoadingTopics]  = useState(true);
  const [activeProblemId, setActiveProblemId]= useState(null);
  const [problemDetail,   setProblemDetail]  = useState(null);
  const [loadingDetail,   setLoadingDetail]  = useState(false);
  const [tab,             setTab]            = useState('all'); // 'all' | 'revision'
  const [search,          setSearch]         = useState('');

  // Load topics + progress + sheet meta on mount
  useEffect(() => {
    const p1 = getTopics(sheetId);
    const p2 = getProgress(sessionId);
    const p3 = getSheets(user).catch(() => []);

    Promise.all([p1, p2, p3])
      .then(([t, prog, sheets]) => {
        setTopics(t);
        loadProgress(prog);
        const meta = sheets.find((s) => s.id === sheetId);
        if (meta) setSheetMeta(meta);
      })
      .catch(() => p1.then(setTopics))
      .finally(() => setLoadingTopics(false));
  }, [sheetId]);

  // Load full problem when selected
  useEffect(() => {
    if (!activeProblemId) { setProblemDetail(null); return; }
    setLoadingDetail(true);
    getProblem(activeProblemId)
      .then(setProblemDetail)
      .catch(() => setProblemDetail(null))
      .finally(() => setLoadingDetail(false));
  }, [activeProblemId]);

  const allProblems = topics.flatMap((t) => t.problems);
  const solvedCount = allProblems.filter((p) => progress[p.id]?.solved).length;
  const inSplitPane = activeProblemId !== null;

  // Sidebar filter topics for split-pane view
  const filteredTopics = search.trim()
    ? topics
        .map((t) => ({ ...t, problems: t.problems.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())) }))
        .filter((t) => t.problems.length > 0)
    : topics;

  return (
    <div className="flex flex-col h-screen bg-navy-950 overflow-hidden">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="border-b border-navy-800 bg-navy-900/80 backdrop-blur-sm flex-shrink-0 z-20">
        <div className="px-4 py-0 flex items-stretch gap-0">

          {/* Left: back btn + title + tabs */}
          <div className="flex items-center gap-4 flex-1 min-w-0 py-3">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-navy-400 hover:text-white transition-colors text-sm font-medium group flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className="group-hover:-translate-x-0.5 transition-transform">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span className="text-white font-black text-base tracking-tight">Codify</span>
            </button>
            <span className="text-navy-700">/</span>
            <span className="text-navy-300 text-sm font-medium truncate">
              {sheetMeta ? `${sheetMeta.emoji} ${sheetMeta.name}` : 'CP Revision Sheet'}
            </span>

            {/* Back to table in split-pane */}
            {inSplitPane && (
              <button
                onClick={() => { setActiveProblemId(null); setProblemDetail(null); }}
                className="flex items-center gap-1.5 text-xs font-medium text-navy-400 hover:text-gold-400 border border-navy-700 hover:border-gold-500/40 px-3 py-1.5 rounded-lg transition-all"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                All Problems
              </button>
            )}

            {/* Tabs — only in table view */}
            {!inSplitPane && (
              <div className="flex items-center gap-1 ml-4 bg-navy-800/60 rounded-lg p-1">
                {[['all', 'All Problems'], ['revision', '⭐ Revision']].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`text-xs font-semibold px-4 py-1.5 rounded-md transition-all ${
                      tab === key
                        ? 'bg-navy-700 text-white shadow-sm'
                        : 'text-navy-500 hover:text-navy-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: progress + avatar */}
          <div className="flex items-center gap-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-3 hidden sm:flex">
              <span className="text-navy-400 text-xs">{solvedCount} / {allProblems.length}</span>
              <div className="w-24 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
                  style={{ width: allProblems.length ? `${(solvedCount / allProblems.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-xs font-black uppercase flex-shrink-0">
              {user?.[0]}
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── In split-pane: slim sidebar ─────────────── */}
        {inSplitPane && (
          <aside className="w-56 flex-shrink-0 border-r border-navy-800 bg-navy-900/40 flex flex-col overflow-hidden">
            <div className="p-2.5 border-b border-navy-800">
              <div className="relative">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-navy-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-navy-800 border border-navy-700 focus:border-gold-500/50 text-white placeholder-navy-600 rounded-lg pl-7 pr-3 py-1.5 text-xs outline-none transition-colors"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {filteredTopics.map((topic) => (
                <SidebarTopic
                  key={topic.id}
                  topic={topic}
                  progress={progress}
                  activeProblemId={activeProblemId}
                  onSelect={setActiveProblemId}
                />
              ))}
            </div>
          </aside>
        )}

        {/* ── Main content area ────────────────────────── */}
        <main className="flex-1 overflow-hidden flex">

          {!inSplitPane ? (
            /* Table view + stats panel */
            <>
              {/* Problems table */}
              <div className="flex-1 overflow-hidden">
                {loadingTopics ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-navy-500 text-sm">Loading…</p>
                    </div>
                  </div>
                ) : (
                  <ProblemsTable
                    topics={topics}
                    progress={progress}
                    onProblemClick={setActiveProblemId}
                    onTopicsChange={setTopics}
                    tab={tab}
                    sheetId={sheetId}
                    sheetName={sheetMeta ? `${sheetMeta.emoji} ${sheetMeta.name}` : 'CP Revision Sheet'}
                    sheetDesc={sheetMeta?.description}
                  />
                )}
              </div>

              {/* Right stats panel */}
              <aside className="w-64 flex-shrink-0 border-l border-navy-800 bg-navy-900/30 overflow-hidden">
                <StatsPanel topics={topics} progress={progress} />
              </aside>
            </>
          ) : (
            /* Split pane: question | answer */
            <div className="flex-1 flex overflow-hidden">
              {/* Question — left */}
              <div className="flex-1 border-r border-navy-800 overflow-hidden">
                {loadingDetail ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : problemDetail ? (
                  <QuestionPanel problem={problemDetail} />
                ) : null}
              </div>

              {/* Answer — right */}
              <div className="flex-1 overflow-hidden">
                {problemDetail && (
                  <AnswerPanel problemId={activeProblemId} sessionId={sessionId} problem={problemDetail} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Slim sidebar topic for split-pane ──────────────────────────────────
function SidebarTopic({ topic, progress, activeProblemId, onSelect }) {
  const [open, setOpen] = useState(true);
  const solved = topic.problems.filter((p) => progress[p.id]?.solved).length;

  return (
    <div className="border-b border-navy-800/50 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-navy-800/40 transition-colors text-left"
      >
        <span className="text-sm">{topic.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-semibold truncate">{topic.title}</div>
          <div className="text-navy-600 text-[10px]">{solved}/{topic.problems.length}</div>
        </div>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`text-navy-600 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && topic.problems.map((p) => {
        const isActive  = p.id === activeProblemId;
        const isSolved  = progress[p.id]?.solved;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`w-full flex items-center gap-2 pl-7 pr-3 py-1.5 text-left border-r-2 transition-all ${
              isActive ? 'bg-gold-500/10 border-gold-500' : 'border-transparent hover:bg-navy-800/40'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSolved ? 'bg-emerald-400' : 'bg-navy-700'}`} />
            <span className={`text-xs truncate ${isActive ? 'text-gold-300 font-semibold' : isSolved ? 'text-navy-600 line-through' : 'text-navy-300'}`}>
              {p.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
