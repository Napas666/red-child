import { motion } from 'framer-motion'

interface Props {
  percent: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  sublabel?: string
}

export default function ProgressRing({
  percent,
  size = 80,
  strokeWidth = 5,
  color = 'var(--red)',
  label,
  sublabel
}: Props) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,0,48,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            filter: `drop-shadow(0 0 6px ${color})`
          }}
        />
      </svg>
      {/* Center label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {label && (
          <span
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: size * 0.16,
              color: 'var(--red)',
              lineHeight: 1,
              textShadow: 'var(--red-glow-sm)'
            }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: size * 0.1,
              color: 'var(--text-3)',
              marginTop: 2
            }}
          >
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
