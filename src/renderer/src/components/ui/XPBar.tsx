import { motion } from 'framer-motion'

interface Props {
  level: number
  current: number
  needed: number
  percent: number
  compact?: boolean
}

export default function XPBar({ level, current, needed, percent, compact = false }: Props) {
  return (
    <div style={{ width: '100%' }}>
      {!compact && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 6
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 11,
              color: 'var(--red)',
              letterSpacing: '0.12em',
              textShadow: 'var(--red-glow-sm)'
            }}
          >
            LEVEL {level}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-2)'
            }}
          >
            {current} / {needed} XP
          </span>
        </div>
      )}

      {/* Track */}
      <div
        style={{
          height: compact ? 4 : 8,
          background: 'rgba(255,0,48,0.1)',
          borderRadius: 4,
          border: '1px solid rgba(255,0,48,0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #8b0000 0%, #ff0030 60%, #ff6080 100%)',
            borderRadius: 4,
            boxShadow: '0 0 12px rgba(255,0,48,0.8)',
            position: 'relative'
          }}
        >
          {/* Shine sweep */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              animation: 'scan-move 2s linear infinite'
            }}
          />
        </motion.div>
      </div>

      {compact && (
        <div
          style={{
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-3)',
            marginTop: 3
          }}
        >
          LVL {level}
        </div>
      )}
    </div>
  )
}
