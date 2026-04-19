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
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${diff.badge}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-navy-800 text-navy-300 border border-navy-700">
            {problem.topicTitle}
          </span>
          <span className="text-xs text-navy-500">{problem.platform}</span>
          {problem.lcLink && (
            <a
              href={problem.lcLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1 ml-auto"
            >
              Open ↗
            </a>
          )}
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
