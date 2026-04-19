export default function SheetCard({ sheet, onClick, onDelete }) {
  const gradients = [
    'from-violet-600/20 to-navy-800',
    'from-sky-600/20 to-navy-800',
    'from-gold-600/20 to-navy-800',
    'from-emerald-600/20 to-navy-800',
    'from-rose-600/20 to-navy-800',
  ];
  // Deterministic gradient from sheet name
  const grad = gradients[sheet.name.charCodeAt(0) % gradients.length];

  return (
    <div
      className={`relative group bg-gradient-to-br ${grad} border border-navy-700/60 hover:border-navy-500 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-950/50`}
      onClick={onClick}
    >
      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-lg bg-navy-700/80 hover:bg-red-500/20 hover:text-red-400 text-navy-400 text-sm"
        title="Delete sheet"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Emoji */}
      <div className="text-3xl mb-4">{sheet.emoji}</div>

      {/* Title */}
      <h3 className="text-white font-bold text-base mb-1 pr-6 leading-tight">{sheet.name}</h3>
      {sheet.description && (
        <p className="text-navy-400 text-xs leading-relaxed line-clamp-2">{sheet.description}</p>
      )}

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-navy-500 text-xs">
          {new Date(sheet.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className="text-gold-400 text-xs font-medium group-hover:text-gold-300 transition-colors flex items-center gap-1">
          Open
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </div>
  );
}
