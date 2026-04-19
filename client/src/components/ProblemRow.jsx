const DIFF_STYLE = {
  Easy:   'text-emerald-400',
  Medium: 'text-gold-400',
  Hard:   'text-red-400',
};

export default function ProblemRow({ problem, isActive, isSolved, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-center gap-2 px-4 py-2 text-left transition-all duration-150
        ${isActive
          ? 'bg-gold-500/10 border-r-2 border-gold-500'
          : 'hover:bg-navy-800/50 border-r-2 border-transparent'}
      `}
    >
      {/* Solved dot */}
      <span className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
        isSolved ? 'bg-emerald-400' : 'bg-navy-700'
      }`} />

      {/* Title */}
      <span className={`flex-1 text-xs truncate leading-tight transition-colors ${
        isActive ? 'text-gold-300 font-semibold' : isSolved ? 'text-navy-300 line-through' : 'text-navy-300 hover:text-white'
      }`}>
        {problem.title}
      </span>

      {/* Difficulty */}
      <span className={`text-[10px] font-semibold flex-shrink-0 ${DIFF_STYLE[problem.difficulty] || 'text-navy-400'}`}>
        {problem.difficulty[0]}
      </span>
    </button>
  );
}
