const STATE = {
  Normal:  { color: 'var(--normal)',  bg: 'var(--normal-bg)',  icon: '✓', label: 'NORMAL',  desc: 'All parameters within safe operating range.' },
  Warning: { color: 'var(--warning)', bg: 'var(--warning-bg)', icon: '⚠', label: 'WARNING', desc: 'Anomalous readings detected. Inspect soon.' },
  Fault:   { color: 'var(--fault)',   bg: 'var(--fault-bg)',   icon: '✕', label: 'FAULT',   desc: 'Critical condition. Immediate action required.' },
}

export default function HealthPanel({ lastReading, stats }) {
  const pred = lastReading?.prediction ?? 'Normal'
  const conf = lastReading?.confidence ?? 0
  const probs = lastReading?.probabilities
  const st = STATE[pred] ?? STATE.Normal

  return (
    <div style={{
      background: 'var(--bg2)',
      border: `1px solid ${st.color}`,
      borderRadius: 'var(--radius)',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--mono)' }}>
        ML Prediction
      </div>

      {/* Big status indicator */}
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: st.bg, border: `2px solid ${st.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
          fontSize: 32,
          boxShadow: `0 0 20px ${st.color}40`,
          transition: 'all 0.4s ease',
        }}>
          {st.icon}
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700,
          color: st.color, letterSpacing: 2, marginBottom: 6,
        }}>
          {st.label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
          {st.desc}
        </div>
      </div>

      {/* Confidence */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Confidence</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: st.color }}>{(conf * 100).toFixed(1)}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${conf * 100}%`,
            background: st.color, borderRadius: 3,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Probability breakdown */}
      {probs && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {Object.entries(probs).map(([label, prob]) => {
            const cfg = STATE[label]
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 54, fontSize: 10, color: cfg.color, fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>{label}</span>
                <div style={{ flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${prob * 100}%`, background: cfg.color, borderRadius: 2, transition: 'width 0.4s' }} />
                </div>
                <span style={{ width: 36, fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)', textAlign: 'right' }}>{(prob * 100).toFixed(0)}%</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Mini stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'Normal',  val: stats.normal_count,  color: 'var(--normal)' },
            { label: 'Warning', val: stats.warning_count, color: 'var(--warning)' },
            { label: 'Fault',   val: stats.fault_count,   color: 'var(--fault)' },
            { label: 'Fault %', val: `${stats.fault_rate_pct}%`, color: 'var(--muted)' },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
