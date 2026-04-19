import { DonutChart, ProgressDonut } from './DonutChart.jsx';

const DIFF_COLORS = {
  Easy:   { color: '#34d399', bg: 'bg-emerald-400', text: 'text-emerald-400', track: 'bg-emerald-400/20' },
  Medium: { color: '#f59e0b', bg: 'bg-gold-400',    text: 'text-gold-400',    track: 'bg-gold-400/20'    },
  Hard:   { color: '#f87171', bg: 'bg-red-400',     text: 'text-red-400',     track: 'bg-red-400/20'     },
};

export default function StatsPanel({ topics, progress }) {
  const allProblems = topics.flatMap((t) => t.problems);

  // Compute per-difficulty stats
  const byDiff = { Easy: { total: 0, solved: 0 }, Medium: { total: 0, solved: 0 }, Hard: { total: 0, solved: 0 } };
  allProblems.forEach((p) => {
    const d = p.difficulty || 'Medium';
    if (!byDiff[d]) return;
    byDiff[d].total++;
    if (progress[p.id]?.solved) byDiff[d].solved++;
  });

  const totalProblems = allProblems.length;
  const totalSolved   = allProblems.filter((p) => progress[p.id]?.solved).length;
  const totalStarred  = allProblems.filter((p) => progress[p.id]?.starred).length;
  const overallPct    = totalProblems ? Math.round((totalSolved / totalProblems) * 100) : 0;

  // Donut segments for difficulty distribution
  const diffSegments = [
    { value: byDiff.Easy.total,   color: '#34d399', label: 'Easy'   },
    { value: byDiff.Medium.total, color: '#f59e0b', label: 'Medium' },
    { value: byDiff.Hard.total,   color: '#f87171', label: 'Hard'   },
  ];

  // Solved donut
  const solvedSegments = [
    { value: totalSolved,              color: '#f59e0b' },
    { value: totalProblems - totalSolved, color: '#1e2947' },
  ];

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-5 p-4">

      {/* ── Overall Progress Card ─────────────────────── */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5">
        <h3 className="text-navy-400 text-xs font-bold uppercase tracking-widest mb-4">DSA Progress</h3>

        {/* Donut center */}
        <div className="flex flex-col items-center mb-5">
          <DonutChart
            segments={diffSegments}
            size={130}
            strokeWidth={14}
            label={`${overallPct}%`}
            sublabel={`${totalSolved}/${totalProblems}`}
          />
        </div>

        {/* Per-difficulty rows */}
        <div className="space-y-3">
          {Object.entries(byDiff).map(([diff, { total, solved }]) => {
            const s = DIFF_COLORS[diff];
            const pct = total ? (solved / total) * 100 : 0;
            return (
              <div key={diff}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.bg}`} />
                    <span className={`text-xs font-semibold ${s.text}`}>{diff}</span>
                  </div>
                  <span className="text-navy-400 text-xs font-mono">{solved}/{total}</span>
                </div>
                <div className={`h-1.5 rounded-full ${s.track} overflow-hidden`}>
                  <div
                    className={`h-full ${s.bg} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Stats ───────────────────────────────── */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4">
        <h3 className="text-navy-400 text-xs font-bold uppercase tracking-widest mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total',    value: totalProblems, icon: '📋', color: 'text-navy-300' },
            { label: 'Solved',   value: totalSolved,   icon: '✅', color: 'text-emerald-400' },
            { label: 'Starred',  value: totalStarred,  icon: '⭐', color: 'text-gold-400' },
            { label: 'Topics',   value: topics.length, icon: '📂', color: 'text-violet-400' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-navy-800/60 border border-navy-700/50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{icon}</div>
              <div className={`text-xl font-black ${color}`}>{value}</div>
              <div className="text-navy-500 text-[10px] font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Topic Breakdown ───────────────────────────── */}
      {topics.length > 0 && (
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4">
          <h3 className="text-navy-400 text-xs font-bold uppercase tracking-widest mb-3">Topics</h3>
          <div className="space-y-2.5">
            {topics.map((t) => {
              const tot = t.problems.length;
              const sol = t.problems.filter((p) => progress[p.id]?.solved).length;
              const pct = tot ? (sol / tot) * 100 : 0;
              return (
                <div key={t.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{t.icon}</span>
                      <span className="text-navy-300 text-xs font-medium truncate max-w-[110px]">{t.title}</span>
                    </div>
                    <span className="text-navy-500 text-[10px] font-mono">{sol}/{tot}</span>
                  </div>
                  <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Recommended Approach ─────────────────────── */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4">
        <h3 className="text-navy-400 text-xs font-bold uppercase tracking-widest mb-3">💡 Recommended</h3>
        <p className="text-navy-400 text-xs leading-relaxed">
          Solve all <span className="text-emerald-400 font-semibold">Easy</span> problems first across all topics,
          then tackle <span className="text-gold-400 font-semibold">Medium</span>, and
          finally <span className="text-red-400 font-semibold">Hard</span>.
          Consistent daily revision beats cramming.
        </p>
      </div>
    </div>
  );
}
