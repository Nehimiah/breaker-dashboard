const s = {
  bar: {
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--border)',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    marginBottom: 24,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 32, height: 32, borderRadius: 8,
    background: 'var(--normal-bg)',
    border: '1px solid var(--normal)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16,
  },
  title: { fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: 1 },
  sub: { fontSize: 11, color: 'var(--muted)', marginTop: 1 },
  right: { display: 'flex', alignItems: 'center', gap: 20 },
  stat: { textAlign: 'right' },
  statVal: { fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 700, color: 'var(--text)' },
  statLbl: { fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 },
  dot: (on) => ({
    width: 8, height: 8, borderRadius: '50%',
    background: on ? 'var(--normal)' : 'var(--fault)',
    boxShadow: on ? '0 0 6px var(--normal)' : '0 0 6px var(--fault)',
    display: 'inline-block', marginRight: 6,
  }),
  wsTag: (on) => ({
    display: 'flex', alignItems: 'center',
    padding: '4px 10px', borderRadius: 20,
    background: on ? 'var(--normal-bg)' : 'var(--fault-bg)',
    border: `1px solid ${on ? 'var(--normal)' : 'var(--fault)'}`,
    fontSize: 11, fontFamily: 'var(--mono)',
    color: on ? 'var(--normal)' : 'var(--fault)',
  }),
}

export default function StatusBar({ wsConnected, status, stats }) {
  const uptime = status?.uptime_seconds
  const uptimeStr = uptime != null
    ? uptime < 3600 ? `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`
    : `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
    : '--'

  return (
    <header style={s.bar}>
      <div style={s.logo}>
        <div style={s.logoIcon}>⚡</div>
        <div>
          <div style={s.title}>CIRCUIT BREAKER MONITOR</div>
          <div style={s.sub}>AI Predictive Maintenance System</div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.stat}>
          <div style={s.statVal}>{stats?.total_readings ?? '--'}</div>
          <div style={s.statLbl}>Total Readings</div>
        </div>
        <div style={s.stat}>
          <div style={s.statVal}>{stats?.fault_count ?? '--'}</div>
          <div style={s.statLbl}>Faults Logged</div>
        </div>
        <div style={s.stat}>
          <div style={s.statVal}>{stats?.mtbf_hours != null ? `${stats.mtbf_hours}h` : '--'}</div>
          <div style={s.statLbl}>MTBF</div>
        </div>
        <div style={s.stat}>
          <div style={s.statVal}>{uptimeStr}</div>
          <div style={s.statLbl}>Uptime</div>
        </div>
        <div style={s.wsTag(wsConnected)}>
          <span style={s.dot(wsConnected)} />
          {wsConnected ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>
    </header>
  )
}
