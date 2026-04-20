import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { modules } from '../data/courses/securityResearcher'
import GlitchText from '../components/ui/GlitchText'
import NeonButton from '../components/ui/NeonButton'
import ProgressRing from '../components/ui/ProgressRing'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const xp = useStore((s) => s.xp)
  const streak = useStore((s) => s.streak)
  const currentLevel = useStore((s) => s.currentLevel())
  const xpProgress = useStore((s) => s.xpProgress())
  const moduleProgress = useStore((s) => s.moduleProgress)
  const earnedAchievements = useStore((s) => s.earnedAchievements)

  const completedModules = modules.filter((m) => moduleProgress[m.id]?.quizCompleted).length
  const readySections = Object.values(moduleProgress).reduce(
    (acc, m) => acc + m.theorySections.length, 0
  )
  const overallPercent = Math.round(
    (completedModules / modules.filter((m) => m.theory.length > 0).length) * 100
  )

  // Next recommended module
  const nextModule = modules.find((m) => {
    const prog = moduleProgress[m.id]
    const unlocked = m.prerequisites.every((p) => moduleProgress[p]?.quizCompleted)
    return unlocked && (!prog?.quizCompleted) && m.theory.length > 0
  })

  const stats = [
    { label: 'Уровень', value: currentLevel, icon: '⭐', color: '#ffb800' },
    { label: 'Всего XP', value: xp, icon: '◆', color: 'var(--red)' },
    { label: 'Разделов', value: readySections, icon: '📖', color: '#00aaff' },
    { label: 'Модулей', value: completedModules, icon: '✅', color: '#00ff88' },
    { label: 'Достижений', value: earnedAchievements.length, icon: '🏆', color: '#ffb800' },
    { label: 'Streak', value: streak, icon: '🔥', color: '#ff6600' }
  ]

  return (
    <div style={{ maxWidth: 1100, width: '100%' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <GlitchText
          text="RED CHILD"
          tag="h1"
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 36,
            letterSpacing: '0.15em',
            color: 'var(--red)',
            textShadow: 'var(--red-glow)',
            display: 'block',
            marginBottom: 6
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: 'var(--text-2)',
            letterSpacing: '0.05em'
          }}
        >
          Твой путь в кибербезопасность → Kaspersky Security Researcher
        </p>
      </motion.div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 12,
          marginBottom: 28
        }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="panel"
            style={{ padding: '14px 12px', textAlign: 'center' }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 18,
                color: s.color,
                textShadow: `0 0 8px ${s.color}80`,
                marginBottom: 2
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-3)',
                letterSpacing: '0.1em'
              }}
            >
              {s.label.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Next module card */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="panel"
          style={{ padding: 24 }}
        >
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 11,
              letterSpacing: '0.15em',
              color: 'var(--text-3)',
              marginBottom: 16
            }}
          >
            ▶ СЛЕДУЮЩИЙ ШАГ
          </div>

          {nextModule ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: `${nextModule.color}22`,
                    border: `1px solid ${nextModule.color}55`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                    boxShadow: `0 0 20px ${nextModule.color}30`
                  }}
                >
                  {nextModule.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 16,
                      color: 'var(--text)',
                      marginBottom: 4
                    }}
                  >
                    {nextModule.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
                    {nextModule.subtitle} · {nextModule.estimatedTime} · +{nextModule.xpReward} XP
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                    {nextModule.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <NeonButton onClick={() => navigate(`/learn/${nextModule.id}`)} icon="▶">
                  Начать модуль
                </NeonButton>
                <NeonButton variant="secondary" onClick={() => navigate('/learn')}>
                  Все модули
                </NeonButton>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 14, color: 'var(--red)' }}>
                ВСЕ ДОСТУПНЫЕ МОДУЛИ ПРОЙДЕНЫ
              </div>
            </div>
          )}
        </motion.div>

        {/* Overall progress */}
        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="panel"
          style={{ padding: 24 }}
        >
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 11,
              letterSpacing: '0.15em',
              color: 'var(--text-3)',
              marginBottom: 20
            }}
          >
            ◈ ПРОГРЕСС К ЦЕЛИ
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <ProgressRing
              percent={overallPercent}
              size={120}
              strokeWidth={8}
              label={`${overallPercent}%`}
              sublabel="READY"
            />
          </div>

          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-2)', textAlign: 'center', lineHeight: 1.6, marginBottom: 16 }}>
            Готовность к собеседованию в Kaspersky GReAT
          </div>

          {/* Module progress list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {modules.filter((m) => m.theory.length > 0).map((m) => {
              const prog = moduleProgress[m.id]
              const done = prog?.quizCompleted
              const partial = (prog?.theorySections.length ?? 0) > 0
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 10px',
                    borderRadius: 4,
                    background: done
                      ? 'rgba(0,255,136,0.06)'
                      : partial
                      ? 'rgba(255,0,48,0.06)'
                      : 'transparent'
                  }}
                >
                  <span style={{ fontSize: 12 }}>
                    {done ? '✅' : partial ? '⏳' : '○'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 12,
                      color: done ? '#00ff88' : partial ? 'var(--text)' : 'var(--text-3)',
                      flex: 1
                    }}
                  >
                    {m.title}
                  </span>
                  {prog?.xpEarned ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>
                      +{prog.xpEarned}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
