import './index.css'
import { useBackend } from './useBackend'
import StatusBar from './components/StatusBar'
import SensorCards from './components/SensorCards'
import HealthPanel from './components/HealthPanel'
import TrendChart from './components/TrendChart'
import AlertLog from './components/AlertLog'
import SimulateBar from './components/SimulateBar'

export default function App() {
  const { readings, alerts, stats, status, wsConnected, lastReading, simulate, refetch } = useBackend()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <StatusBar wsConnected={wsConnected} status={status} stats={stats} />
      <main style={{ flex: 1, padding: '0 24px 32px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 20 }}>
          <SensorCards lastReading={lastReading} />
          <HealthPanel lastReading={lastReading} stats={stats} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <TrendChart readings={readings} />
        </div>
        <AlertLog alerts={alerts} />
        <SimulateBar simulate={simulate} refetch={refetch} />
      </main>
    </div>
  )
}
