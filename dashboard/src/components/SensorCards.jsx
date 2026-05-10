import { useState, useEffect } from 'react'

const SENSORS = [
  { key: 'voltage',     label: 'Voltage',     unit: 'V',   icon: '⚡', min: 180, max: 260, decimals: 1 },
  { key: 'current',     label: 'Current',     unit: 'A',   icon: '〜', min: 0,   max: 20,  decimals: 1 },
  { key: 'temperature', label: 'Temperature', unit: '°C',  icon: '🌡', min: 0,   max: 85,  decimals: 1 },
  { key: 'vibration',   label: 'Vibration',   unit: '',    icon: '📳', min: 0,   max: 1,   decimals: 0 },
]

function getBar(value, min, max) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
}

function getBarColor(pct, key) {
  if (key === 'vibration') return pct > 0 ? 'var(--warning)' : 'var(--normal)'
  if (pct > 85) return 'var(--fault)'
  if (pct > 65) return 'var(--warning)'
  return 'var(--normal)'
}

export default function SensorCards({ lastReading }) {
  const [prev, setPrev] = useState({})
  const [flash, setFlash] = useState({})

  useEffect(() => {
    if (!lastReading) return
    const newFlash = {}
    SENSORS.forEach(({ key }) => {
      if (prev[key] !== undefined && prev[key] !== lastReading[key]) {
        newFlash[key] = true
      }
    })
    setFlash(newFlash)
    setPrev({
      voltage: lastReading.voltage,
      current: lastReading.current,
      temperature: lastReading.temperature,
      vibration: lastReading.vibration,
    })
    const t = setTimeout(() => setFlash({}), 400)
    return () => clearTimeout(t)
  }, [lastReading])

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontFamily: 'var(--mono)' }}>
        Live Sensor Readings
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {SENSORS.map(({ key, label, unit, icon, min, max, decimals }) => {
          const value = lastReading?.[key]
          const pct = value != null ? getBar(value, min, max) : 0
          const barColor = value != null ? getBarColor(pct, key) : 'var(--border2)'
          const isFlashing = flash[key]

          return (
            <div key={key} style={{
              background: 'var(--bg2)',
              border: `1px solid ${isFlashing ? barColor : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: '18px 16px',
              transition: 'border-color 0.3s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                  <div style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 28,
                    fontWeight: 700,
                    color: value != null ? barColor : 'var(--muted)',
                    lineHeight: 1,
                    transition: 'color 0.3s',
                  }}>
                    {value != null ? value.toFixed(decimals) : '--'}
                    <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4, color: 'var(--muted)' }}>{unit}</span>
                  </div>
                </div>
                <span style={{ fontSize: 20 }}>{icon}</span>
              </div>

              {/* Bar */}
              <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: barColor,
                  borderRadius: 2,
                  transition: 'width 0.4s ease, background 0.3s',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{min}{unit}</span>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{max}{unit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
