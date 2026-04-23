const DIFF_STYLE = {
  Easy:   { badge: 'diff-easy',   dot: 'bg-emerald-400' },
  Medium: { badge: 'diff-medium', dot: 'bg-gold-400'    },
  Hard:   { badge: 'diff-hard',   dot: 'bg-red-400'     },
};

export default function QuestionPanel({ problem }) {
  const diff = DIFF_STYLE[problem.difficulty] || DIFF_STYLE.Medium;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-navy-950/60 animate-fade-in">
      {/* Panel header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-navy-800">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-navy-500 font-bold uppercase tracking-widest block mb-1.5">Problem</span>
            <h2 className="text-white font-bold text-lg leading-tight">{problem.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${diff.badge}`}>
              {problem.difficulty}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-navy-800 text-navy-300 border border-navy-700">
              {problem.topicTitle}
            </span>
          </div>
          
          {/* Platform links */}
          <div className="flex items-center gap-2">
            {problem.lcLink && (
              <a
                href={problem.lcLink}
                target="_blank"
                rel="noreferrer"
                title="Open on LeetCode"
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-navy-800 hover:bg-gold-500/20 text-navy-400 hover:text-gold-400 transition-all border border-navy-700 hover:border-gold-500/40"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h4v4H3V3zm7 0h4v4h-4V3zm7 0h4v4h-4V3zM3 10h4v4H3v-4zm7 0h4v4h-4v-4zm7 0h4v4h-4v-4zM3 17h4v4H3v-4zm7 0h4v4h-4v-4z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 text-sm">

        {/* Statement */}
        <div>
          <h3 className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-3">Problem Statement</h3>
          <p className="text-navy-200 leading-7 whitespace-pre-wrap">{problem.statement}</p>
        </div>

        {/* Examples */}
        {problem.examples?.length > 0 && (
          <div>
            <h3 className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-3">Examples</h3>
            <div className="space-y-3">
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-navy-900 border border-navy-800 rounded-xl p-4 font-mono text-xs space-y-2">
                  <div>
                    <span className="text-navy-500">Input: </span>
                    <span className="text-emerald-300">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-navy-500">Output: </span>
                    <span className="text-gold-300">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div>
                      <span className="text-navy-500">Explanation: </span>
                      <span className="text-navy-300">{ex.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && (
          <div>
            <h3 className="text-navy-400 text-xs font-bold uppercase tracking-wider mb-3">Constraints</h3>
            <div className="bg-navy-900 border border-navy-800 rounded-xl p-4">
              <pre className="text-navy-300 text-xs leading-6 whitespace-pre-wrap font-mono">{problem.constraints}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
