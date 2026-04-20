import { Outlet } from 'react-router-dom'
import ParticleField from '../ui/ParticleField'
import Sidebar from './Sidebar'
import TitleBar from './TitleBar'

export default function Layout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--bg)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Scanlines overlay */}
      <div className="scanlines" />

      {/* Particle background */}
      <ParticleField />

      {/* Custom title bar */}
      <TitleBar />

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            overflow: 'hidden auto',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
