import { useState, useEffect, useRef, useCallback } from 'react'

const WS_URL = 'ws://web-production-7cb21.up.railway.app/ws'
const API_URL = 'https://web-production-7cb21.up.railway.app/'
const MAX_HISTORY = 60

export function useBackend() {
  const [readings, setReadings] = useState([])
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState(null)
  const [status, setStatus] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  const [lastReading, setLastReading] = useState(null)
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)

  // Fetch historical data on mount
  const fetchHistory = useCallback(async () => {
    try {
      const [readingsRes, alertsRes, statsRes, statusRes] = await Promise.all([
        fetch(`${API_URL}/api/readings?limit=60`),
        fetch(`${API_URL}/api/alerts?limit=50`),
        fetch(`${API_URL}/api/stats`),
        fetch(`${API_URL}/api/status`),
      ])
      const r = await readingsRes.json()
      const a = await alertsRes.json()
      const st = await statsRes.json()
      const sys = await statusRes.json()

      setReadings(r.reverse()) // oldest first for charts
      setAlerts(a)
      setStats(st)
      setStatus(sys)
      if (r.length > 0) setLastReading(r[r.length - 1])
    } catch (e) {
      console.warn('Could not reach backend:', e.message)
    }
  }, [])

  // WebSocket connection
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      setWsConnected(true)
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
    }

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        if (msg.type === 'reading') {
          const reading = msg.data
          setLastReading(reading)
          setReadings(prev => {
            const next = [...prev, reading]
            return next.length > MAX_HISTORY ? next.slice(-MAX_HISTORY) : next
          })
          // Refresh stats and alerts periodically
          if (reading.id % 5 === 0) fetchHistory()
        }
      } catch (e) {}
    }

    ws.onclose = () => {
      setWsConnected(false)
      reconnectRef.current = setTimeout(connect, 3000)
    }

    ws.onerror = () => ws.close()
  }, [fetchHistory])

  useEffect(() => {
    fetchHistory()
    connect()
    return () => {
      if (wsRef.current) wsRef.current.close()
      if (reconnectRef.current) clearTimeout(reconnectRef.current)
    }
  }, [connect, fetchHistory])

  // Simulate a reading from the backend
  const simulate = useCallback(async (scenario = 'mixed') => {
    try {
      await fetch(`${API_URL}/api/simulate?scenario=${scenario}`, { method: 'POST' })
    } catch (e) {}
  }, [])

  return { readings, alerts, stats, status, wsConnected, lastReading, simulate, refetch: fetchHistory }
}
