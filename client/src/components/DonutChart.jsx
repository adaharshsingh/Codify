/**
 * SVG Donut Chart
 * segments = [{ value, color, label }]
 */
export function DonutChart({ segments = [], size = 120, strokeWidth = 13, label, sublabel }) {
  const r  = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C  = 2 * Math.PI * r;

  const total = segments.reduce((s, seg) => s + (seg.value || 0), 0);

  // Build arcs
  let accumulated = 0;
  const arcs = segments.map((seg) => {
    const pct    = total ? (seg.value || 0) / total : 0;
    const length = pct * C;
    const offset = -(accumulated / (total || 1)) * C;
    accumulated += seg.value || 0;
    return { ...seg, length, offset };
  });

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        className="absolute inset-0"
      >
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2947" strokeWidth={strokeWidth} />
        {total === 0 ? null : arcs.map((arc, i) =>
          arc.length > 0 ? (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.length} ${C}`}
              strokeDashoffset={arc.offset}
              strokeLinecap="butt"
            />
          ) : null
        )}
      </svg>
      {/* Center text */}
      <div className="flex flex-col items-center justify-center z-10 select-none">
        {label    && <span className="text-white font-black leading-none" style={{ fontSize: size * 0.18 }}>{label}</span>}
        {sublabel && <span className="text-navy-400 leading-none mt-0.5" style={{ fontSize: size * 0.1 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

/**
 * Simple single-value (progress) donut
 */
export function ProgressDonut({ value, total, size = 80, strokeWidth = 10, color = '#f59e0b' }) {
  const pct = total ? Math.min(value / total, 1) : 0;
  const r   = (size - strokeWidth) / 2;
  const cx  = size / 2;
  const cy  = size / 2;
  const C   = 2 * Math.PI * r;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className="absolute inset-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e2947" strokeWidth={strokeWidth} />
        {pct > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={`${pct * C} ${C}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        )}
      </svg>
      <div className="flex flex-col items-center justify-center z-10 select-none">
        <span className="text-white font-black leading-none" style={{ fontSize: size * 0.22 }}>
          {Math.round(pct * 100)}%
        </span>
        <span className="text-navy-500 leading-none mt-0.5" style={{ fontSize: size * 0.13 }}>
          {value}/{total}
        </span>
      </div>
    </div>
  );
}
