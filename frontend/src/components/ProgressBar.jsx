/**
 * ProgressBar – Reusable progress bar component with glowing gradients.
 */
export default function ProgressBar({ value = 0, max = 100, color = null, showLabel = false }) {
  const rawPct = typeof value === 'number' ? value : 0;
  const pct = Math.min(100, Math.max(0, Math.round(max > 0 ? (rawPct / max) * (max <= 1 ? 100 : 1) : rawPct)));

  const barColor = color || (pct >= 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : pct >= 40 ? 'var(--accent-gradient)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)');

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginBottom: 4, fontWeight: 600 }}>
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="progress-track" style={{ height: 7, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 999, overflow: 'hidden' }}>
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: barColor, height: '100%', borderRadius: 999, transition: 'width 0.5s ease', boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)' }}
        />
      </div>
    </div>
  );
}
