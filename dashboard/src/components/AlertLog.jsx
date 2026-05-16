const COLORS = {
  Warning: { color: 'var(--warning)', bg: 'var(--warning-bg)' },
  Fault:   { color: 'var(--fault)',   bg: 'var(--fault-bg)'   },
  Normal:  { color: 'var(--normal)',  bg: 'var(--normal-bg)'  },
}

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

export default function AlertLog({ alerts }) {
  const cfg = (type) => COLORS[type] ?? COLORS.Normal

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--mono)' }}>
          Alert Log
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
          {alerts.length} events
        </div>
      </div>

      {alerts.length === 0 ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
          No alerts recorded yet. System operating normally.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 80px 1fr 80px 80px 80px 80px', gap: 12,
            padding: '0 12px 8px', borderBottom: '1px solid var(--border)',
            fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--mono)' }}>
            <span>Timestamp</span>
            <span>Type</span>
            <span>Reason</span>
            <span>Voltage</span>
            <span>Current</span>
            <span>Temp</span>
            <span>Vibration</span>
          </div>

          {alerts.map((alert) => {
            const c = cfg(alert.alert_type)
            return (
              <div key={alert.id} style={{
                display: 'grid',
                gridTemplateColumns: '140px 80px 1fr 80px 80px 80px 80px',
                gap: 12, padding: '10px 12px',
                background: c.bg, borderRadius: 8,
                border: `1px solid ${c.color}30`,
                alignItems: 'center',
                fontSize: 12,
              }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                  {formatTime(alert.timestamp)}
                </span>
                <span style={{ color: c.color, fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase' }}>
                  {alert.alert_type}
                </span>
                <span style={{ color: 'var(--text)', fontSize: 12 }}>{alert.message}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                  {alert.voltage?.toFixed(1)}V
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                  {alert.current?.toFixed(1)}A
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                  {alert.temperature?.toFixed(1)}°C
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
                  {alert.vibration === 1 ? 'Yes' : 'No'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
