import { motion } from 'framer-motion'

declare global {
  interface Window {
    electron: {
      minimize: () => void
      maximize: () => void
      close: () => void
    }
  }
}

export default function TitleBar() {
  return (
    <div
      style={{
        height: 36,
        background: 'rgba(8,8,15,0.95)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px 0 16px',
        WebkitAppRegion: 'drag' as never,
        flexShrink: 0,
        zIndex: 100,
        position: 'relative'
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          WebkitAppRegion: 'no-drag' as never
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            background: 'var(--red)',
            borderRadius: 3,
            boxShadow: 'var(--red-glow-sm)',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'var(--red)',
            textShadow: 'var(--red-glow-sm)'
          }}
        >
          RED CHILD
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--text-3)',
            letterSpacing: '0.1em',
            paddingLeft: 4
          }}
        >
          v1.0.0
        </span>
      </div>

      {/* Window controls */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          WebkitAppRegion: 'no-drag' as never
        }}
      >
        {[
          { action: 'minimize', symbol: '─', color: '#ffbd44' },
          { action: 'maximize', symbol: '□', color: '#00ca56' },
          { action: 'close', symbol: '✕', color: '#ff5f5a' }
        ].map(({ action, symbol, color }) => (
          <motion.button
            key={action}
            onClick={() => window.electron?.[action as keyof typeof window.electron]?.()}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 24,
              height: 24,
              background: `${color}22`,
              border: `1px solid ${color}55`,
              borderRadius: 4,
              color,
              fontSize: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {symbol}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
