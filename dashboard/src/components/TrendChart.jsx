import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { useState } from 'react'

const LINES = [
  { key: 'voltage',     color: '#4f8ef7', label: 'Voltage (V)' },
  { key: 'current',     color: '#10d98a', label: 'Current (A)' },
  { key: 'temperature', color: '#f5a623', label: 'Temp (°C)' },
  { key: 'vibration',   color: '#c084fc', label: 'Vibration' },
]

const PRED_COLORS = { Normal: '#10d98a', Warning: '#f5a623', Fault: '#f04848' }

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const pred = payload[0]?.payload?.prediction
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border2)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--muted)', marginBottom: 6, fontFamily: 'var(--mono)', fontSize: 11 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</strong>
        </div>
      ))}
      {pred && (
        <div style={{ marginTop: 6, padding: '2px 8px', borderRadius: 10, display: 'inline-block',
          background: PRED_COLORS[pred] + '22', color: PRED_COLORS[pred],
          fontSize: 10, fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
          {pred}
        </div>
      )}
    </div>
  )
}

export default function TrendChart({ readings }) {
  const [hidden, setHidden] = useState({})

  const data = readings.map(r => ({
    time: formatTime(r.timestamp),
    voltage: r.voltage,
    current: r.current,
    temperature: r.temperature,
    vibration: r.vibration,
    prediction: r.prediction,
  }))

  const toggle = (key) => setHidden(h => ({ ...h, [key]: !h[key] }))

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'var(--mono)' }}>
          Sensor Trend — Last {readings.length} Readings
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {LINES.map(({ key, color, label }) => (
            <button key={key} onClick={() => toggle(key)} style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11,
              background: hidden[key] ? 'transparent' : color + '22',
              border: `1px solid ${hidden[key] ? 'var(--border2)' : color}`,
              color: hidden[key] ? 'var(--muted)' : color,
              transition: 'all 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
          Waiting for sensor data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'Space Mono' }}
              interval="preserveStartEnd" />
            <YAxis tick={{ fill: 'var(--muted)', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            {LINES.map(({ key, color, label }) =>
              !hidden[key] && (
                <Line key={key} type="monotone" dataKey={key} stroke={color} name={label}
                  dot={false} strokeWidth={1.5} isAnimationActive={false} />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
