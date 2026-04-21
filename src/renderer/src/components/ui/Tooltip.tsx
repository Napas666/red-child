import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GlossaryEntry } from '../../data/glossary'

interface Props {
  term: string
  entry: GlossaryEntry
}

const categoryColors: Record<string, string> = {
  attack:   '#ff4455',
  defense:  '#00ff88',
  concept:  '#00aaff',
  tool:     '#ffb800',
  protocol: '#cc88ff',
  vuln:     '#ff6600'
}

const categoryLabels: Record<string, string> = {
  attack:   'АТАКА',
  defense:  'ЗАЩИТА',
  concept:  'КОНЦЕПЦИЯ',
  tool:     'ИНСТРУМЕНТ',
  protocol: 'ПРОТОКОЛ',
  vuln:     'УЯЗВИМОСТЬ'
}

export default function Tooltip({ term, entry }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<'top' | 'bottom'>('top')
  const ref = useRef<HTMLSpanElement>(null)
  const color = categoryColors[entry.category] ?? 'var(--red)'

  useEffect(() => {
    if (!open || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos(rect.top < 180 ? 'bottom' : 'top')
  }, [open])

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Highlighted term */}
      <span
        style={{
          color,
          borderBottom: `1px dashed ${color}88`,
          cursor: 'help',
          fontWeight: 600,
          textShadow: `0 0 8px ${color}55`,
          transition: 'text-shadow 0.15s'
        }}
      >
        {term}
      </span>

      {/* Tooltip popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: pos === 'top' ? 6 : -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: pos === 'top' ? 6 : -6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              [pos === 'top' ? 'bottom' : 'top']: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 320,
              background: 'rgba(8, 8, 18, 0.97)',
              border: `1px solid ${color}44`,
              borderRadius: 10,
              padding: '12px 14px',
              zIndex: 9000,
              boxShadow: `0 4px 32px rgba(0,0,0,0.6), 0 0 16px ${color}22`,
              pointerEvents: 'none'
            }}
          >
            {/* Arrow */}
            <div
              style={{
                position: 'absolute',
                [pos === 'top' ? 'bottom' : 'top']: -5,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 10,
                height: 10,
                background: 'rgba(8, 8, 18, 0.97)',
                border: `1px solid ${color}44`,
                borderRight: 'none',
                borderBottom: pos === 'top' ? 'none' : undefined,
                borderTop: pos === 'bottom' ? 'none' : undefined,
                rotate: pos === 'top' ? '45deg' : '225deg'
              }}
            />

            {/* Category badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  color,
                  background: `${color}18`,
                  border: `1px solid ${color}44`,
                  padding: '2px 7px',
                  borderRadius: 3
                }}
              >
                {categoryLabels[entry.category]}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.9)',
                  letterSpacing: '0.05em'
                }}
              >
                {term.toUpperCase()}
              </span>
            </div>

            {/* Short definition */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.5,
                marginBottom: entry.full ? 8 : 0,
                fontWeight: 500
              }}
            >
              {entry.short}
            </p>

            {/* Full explanation */}
            {entry.full && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.55,
                  marginBottom: entry.example ? 8 : 0
                }}
              >
                {entry.full}
              </p>
            )}

            {/* Example */}
            {entry.example && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: color,
                  background: `${color}10`,
                  border: `1px solid ${color}25`,
                  borderRadius: 5,
                  padding: '6px 9px',
                  lineHeight: 1.5
                }}
              >
                {entry.example}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
