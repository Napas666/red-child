import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import XPBar from '../ui/XPBar'

const navItems = [
  { path: '/dashboard',    label: 'Главная',      icon: '⬡' },
  { path: '/learn',        label: 'Обучение',     icon: '◈' },
  { path: '/achievements', label: 'Достижения',   icon: '◆' },
  { path: '/profile',      label: 'Профиль',      icon: '◉' }
]

export default function Sidebar() {
  const location = useLocation()
  const xp = useStore((s) => s.xp)
  const streak = useStore((s) => s.streak)
  const currentLevel = useStore((s) => s.currentLevel())
  const xpProgress = useStore((s) => s.xpProgress())

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: 'rgba(8,8,15,0.85)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0 16px',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* XP / Level block */}
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12
          }}
        >
          {/* Avatar ring */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              border: '2px solid var(--red)',
              boxShadow: 'var(--red-glow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,0,48,0.1)',
              fontFamily: 'var(--font-head)',
              fontSize: 14,
              color: 'var(--red)',
              flexShrink: 0
            }}
          >
            {currentLevel}
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 11,
                color: 'var(--text)',
                letterSpacing: '0.08em'
              }}
            >
              ARTEM
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-3)'
              }}
            >
              {xp} XP total
            </div>
          </div>
        </div>
        <XPBar
          level={currentLevel}
          current={xpProgress.current}
          needed={xpProgress.needed}
          percent={xpProgress.percent}
        />
      </div>

      {/* Streak */}
      {streak > 0 && (
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <span style={{ fontSize: 18 }}>🔥</span>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 12,
                color: '#ffb800',
                textShadow: '0 0 8px rgba(255,184,0,0.7)'
              }}
            >
              {streak} ДЕНЬ ПОДРЯД
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>
              Streak active
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 16px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,0,48,0.08)',
                      borderRight: '2px solid var(--red)'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  style={{
                    fontSize: 16,
                    color: active ? 'var(--red)' : 'var(--text-3)',
                    transition: 'color 0.15s',
                    position: 'relative',
                    zIndex: 1,
                    textShadow: active ? 'var(--red-glow-sm)' : 'none'
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: 14,
                    letterSpacing: '0.05em',
                    color: active ? 'var(--text)' : 'var(--text-2)',
                    transition: 'color 0.15s',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {item.label}
                </span>
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom system info */}
      <div
        style={{
          padding: '12px 16px 0',
          borderTop: '1px solid var(--border)'
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-3)',
            lineHeight: 1.8
          }}
        >
          <div>◉ KASPERSKY TARGET</div>
          <div>◈ SECURITY RESEARCHER</div>
          <div style={{ color: 'rgba(0,255,136,0.5)', marginTop: 4 }}>
            ● SYSTEM ONLINE
          </div>
        </div>
      </div>
    </aside>
  )
}
