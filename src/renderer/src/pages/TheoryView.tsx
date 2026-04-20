import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { modules } from '../data/courses/securityResearcher'
import NeonButton from '../components/ui/NeonButton'

function renderContent(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <h3
          key={i}
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 14,
            color: 'var(--red)',
            letterSpacing: '0.08em',
            margin: '18px 0 8px',
            textShadow: 'var(--red-glow-sm)'
          }}
        >
          {line.slice(2, -2)}
        </h3>
      )
    }
    if (line.startsWith('🔴') || line.startsWith('✅') || line.startsWith('🔒') || line.startsWith('✏️') || line.startsWith('⚡') || line.startsWith('🖤') || line.startsWith('⚫') || line.startsWith('🔳')) {
      return (
        <p key={i} style={{ color: 'var(--text)', margin: '6px 0', paddingLeft: 4 }}>
          {line}
        </p>
      )
    }
    if (line.startsWith('- ')) {
      return (
        <li
          key={i}
          style={{
            color: 'var(--text-2)',
            marginLeft: 20,
            marginBottom: 4,
            lineHeight: 1.6
          }}
        >
          {line.slice(2)}
        </li>
      )
    }
    if (line.match(/^\|.*\|$/)) {
      if (line.match(/^[\|\s\-]+$/)) {
        return null
      }
      const cells = line.split('|').filter(Boolean).map((c) => c.trim())
      return (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cells.length}, auto)`,
            gap: '0 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-2)',
            marginBottom: 2
          }}
        >
          {cells.map((c, ci) => (
            <span key={ci} style={{ padding: '2px 0' }}>
              {c}
            </span>
          ))}
        </div>
      )
    }
    if (line === '') return <div key={i} style={{ height: 8 }} />
    return (
      <p key={i} style={{ color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 2 }}>
        {line.replace(/\*\*(.*?)\*\*/g, (_, m) => m).split(/`([^`]+)`/).map((part, pi) =>
          pi % 2 === 1 ? (
            <code
              key={pi}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                background: 'rgba(255,0,48,0.12)',
                border: '1px solid rgba(255,0,48,0.2)',
                padding: '1px 5px',
                borderRadius: 3,
                color: 'var(--red-bright)'
              }}
            >
              {part}
            </code>
          ) : (
            part
          )
        )}
      </p>
    )
  })
}

export default function TheoryView() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const [activeSectionIdx, setActiveSectionIdx] = useState(0)
  const completeSection = useStore((s) => s.completeTheorySection)
  const moduleProgress = useStore((s) => s.moduleProgress)

  const mod = modules.find((m) => m.id === moduleId)
  if (!mod) return <div style={{ color: 'var(--red)' }}>Модуль не найден</div>

  const section = mod.theory[activeSectionIdx]
  const prog = moduleProgress[moduleId ?? '']
  const isSectionDone = prog?.theorySections.includes(section.id)
  const allTheoryDone = mod.theory.every((s) => prog?.theorySections.includes(s.id))

  const handleComplete = () => {
    completeSection(mod.id, section.id)
    if (activeSectionIdx < mod.theory.length - 1) {
      setTimeout(() => setActiveSectionIdx((i) => i + 1), 300)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%', overflow: 'hidden' }}>
      {/* Section list sidebar */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 11,
            letterSpacing: '0.12em',
            color: 'var(--text-3)',
            marginBottom: 12
          }}
        >
          {mod.icon} {mod.title}
        </div>
        {mod.theory.map((s, i) => {
          const done = prog?.theorySections.includes(s.id)
          const active = i === activeSectionIdx
          return (
            <button
              key={s.id}
              onClick={() => setActiveSectionIdx(i)}
              style={{
                background: active ? 'rgba(255,0,48,0.1)' : 'transparent',
                border: `1px solid ${active ? 'rgba(255,0,48,0.4)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 6,
                padding: '10px 12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: 12 }}>{done ? '✅' : active ? '▶' : '○'}</span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: done ? '#00ff88' : active ? 'var(--text)' : 'var(--text-2)',
                  fontWeight: active ? 600 : 400,
                  lineHeight: 1.3
                }}
              >
                {s.title}
              </span>
            </button>
          )
        })}

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {allTheoryDone && (
            <NeonButton
              size="sm"
              fullWidth
              onClick={() => navigate(`/quiz/${mod.id}`)}
              icon="🎯"
            >
              Пройти тест
            </NeonButton>
          )}
          <NeonButton
            size="sm"
            variant="ghost"
            fullWidth
            onClick={() => navigate('/learn')}
          >
            ← Назад
          </NeonButton>
        </div>
      </div>

      {/* Theory content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="panel"
          style={{ flex: 1, padding: '24px 28px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}
        >
          {/* Section header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 18,
                  color: 'var(--text)',
                  letterSpacing: '0.06em'
                }}
              >
                {section.title}
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-3)',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '3px 8px',
                  borderRadius: 3
                }}
              >
                {activeSectionIdx + 1} / {mod.theory.length}
              </span>
            </div>

            {/* Key points */}
            <div
              style={{
                background: 'rgba(255,0,48,0.04)',
                border: '1px solid rgba(255,0,48,0.15)',
                borderRadius: 8,
                padding: '12px 16px'
              }}
            >
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 10, color: 'var(--red)', letterSpacing: '0.12em', marginBottom: 8 }}>
                KEY POINTS
              </div>
              {section.keyPoints.map((kp, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                  <span style={{ color: 'var(--red)', flexShrink: 0 }}>◆</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-2)' }}>{kp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              lineHeight: 1.7,
              flex: 1
            }}
          >
            {renderContent(section.content)}
          </div>

          {/* Code example */}
          {section.codeExample && (
            <div style={{ marginTop: 24 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: 8 }}>
                ◈ ПРИМЕР
              </div>
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,0,48,0.15)',
                  borderRadius: 8,
                  padding: '16px',
                  color: 'rgba(255,255,255,0.85)',
                  overflowX: 'auto',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {section.codeExample}
              </pre>
            </div>
          )}

          {/* Complete button */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {isSectionDone ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: '#00ff88'
                }}
              >
                ✅ Раздел изучен (+30 XP)
              </div>
            ) : (
              <NeonButton onClick={handleComplete} icon="✓">
                Изучено — продолжить
              </NeonButton>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
