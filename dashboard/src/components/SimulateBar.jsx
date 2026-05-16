import { useState } from 'react'

const SCENARIOS = [
  { key: 'normal',            label: 'Normal',          color: 'var(--normal)'  },
  { key: 'warning',           label: 'Warning',         color: 'var(--warning)' },
  { key: 'fault_overcurrent', label: 'Overcurrent',     color: 'var(--fault)'   },
  { key: 'fault_overvoltage', label: 'Overvoltage',     color: 'var(--fault)'   },
  { key: 'fault_overtemp',    label: 'Overtemperature', color: 'var(--fault)'   },
]

export default function SimulateBar({ simulate, refetch }) {
  const [loading, setLoading] = useState(null)
  const [lastFired, setLastFired] = useState(null)

  const fire = async (key) => {
    setLoading(key)
    await simulate(key)
    setTimeout(async () => {
      await refetch()
      setLoading(null)
      setLastFired(key)
      setTimeout(() => setLastFired(null), 2000)
    }, 600)
  }

  return (
    <div style={{
      marginTop: 20,
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
    }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>
        Simulate Reading
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SCENARIOS.map(({ key, label, color }) => {
          const isLoading = loading === key
          const fired = lastFired === key
          return (
            <button key={key} onClick={() => fire(key)} disabled={!!loading} style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12,
              background: fired ? color + '33' : 'var(--bg3)',
              border: `1px solid ${fired ? color : 'var(--border2)'}`,
              color: fired ? color : 'var(--text)',
              opacity: loading && !isLoading ? 0.5 : 1,
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--sans)',
            }}>
              {isLoading && (
                <span style={{ display: 'inline-block', width: 12, height: 12, border: `2px solid ${color}`,
                  borderTopColor: 'transparent', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite' }} />
              )}
              {label}
            </button>
          )
        })}
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>
        No hardware needed — injects test data directly into the pipeline
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
