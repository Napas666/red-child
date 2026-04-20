import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { modules } from '../data/courses/securityResearcher'
import XPBar from '../components/ui/XPBar'
import ProgressRing from '../components/ui/ProgressRing'
import NeonButton from '../components/ui/NeonButton'

export default function Profile() {
  const xp = useStore((s) => s.xp)
  const streak = useStore((s) => s.streak)
  const currentLevel = useStore((s) => s.currentLevel())
  const xpProgress = useStore((s) => s.xpProgress())
  const moduleProgress = useStore((s) => s.moduleProgress)
  const earnedAchievements = useStore((s) => s.earnedAchievements)
  const reset = useStore((s) => s.resetProgress)

  const completedModules = modules.filter((m) => moduleProgress[m.id]?.quizCompleted)
  const totalSections = Object.values(moduleProgress).reduce((a, m) => a + m.theorySections.length, 0)
  const overallPercent = Math.round(
    (completedModules.length / modules.filter((m) => m.theory.length > 0).length) * 100
  )

  const roadmap = [
    { label: 'Основы ИБ', done: !!moduleProgress['mod-01']?.quizCompleted },
    { label: 'Веб-безопасность', done: !!moduleProgress['mod-02']?.quizCompleted },
    { label: 'Vuln Research', done: !!moduleProgress['mod-03']?.quizCompleted },
    { label: 'Сетевая безопасность', done: false },
    { label: 'Malware Analysis', done: false },
    { label: 'Reverse Engineering', done: false },
    { label: 'CTF Challenge', done: false },
    { label: 'Kaspersky Interview', done: false }
  ]

  return (
    <div style={{ maxWidth: 900, width: '100%' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 22, letterSpacing: '0.12em', color: 'var(--text)', marginBottom: 6 }}>
          ПРОФИЛЬ
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Left: profile card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="panel"
          style={{ padding: 24 }}
        >
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <ProgressRing
              percent={xpProgress.percent}
              size={100}
              strokeWidth={6}
              label={String(currentLevel)}
              sublabel="LEVEL"
            />
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, color: 'var(--text)', marginTop: 14, letterSpacing: '0.1em' }}>
              ARTEM
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
              Security Researcher Track
            </div>
          </div>

          <XPBar
            level={currentLevel}
            current={xpProgress.current}
            needed={xpProgress.needed}
            percent={xpProgress.percent}
          />

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Всего XP', value: xp, color: 'var(--red)' },
              { label: 'Стрик', value: `${streak} дн.`, color: '#ff6600' },
              { label: 'Модулей', value: `${completedModules.length}/${modules.filter(m => m.theory.length > 0).length}`, color: '#00ff88' },
              { label: 'Разделов', value: totalSections, color: '#00aaff' },
              { label: 'Достижений', value: earnedAchievements.length, color: '#ffb800' }
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 13, color }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <NeonButton variant="danger" size="sm" fullWidth onClick={() => {
              if (window.confirm('Сбросить весь прогресс? Это нельзя отменить.')) reset()
            }}>
              Сбросить прогресс
            </NeonButton>
          </div>
        </motion.div>

        {/* Right: roadmap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="panel"
          style={{ padding: 24 }}
        >
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: 20 }}>
            ◈ ROADMAP → KASPERSKY
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, var(--red), rgba(255,0,48,0.1))' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {roadmap.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `2px solid ${step.done ? '#00ff88' : i === roadmap.findIndex(s => !s.done) ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
                    background: step.done ? 'rgba(0,255,136,0.12)' : i === roadmap.findIndex(s => !s.done) ? 'rgba(255,0,48,0.12)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    flexShrink: 0,
                    zIndex: 1,
                    position: 'relative',
                    boxShadow: step.done ? '0 0 12px rgba(0,255,136,0.3)' : i === roadmap.findIndex(s => !s.done) ? 'var(--red-glow-sm)' : 'none'
                  }}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: step.done ? '#00ff88' : i === roadmap.findIndex(s => !s.done) ? 'var(--text)' : 'var(--text-3)',
                    fontWeight: i === roadmap.findIndex(s => !s.done) ? 600 : 400
                  }}>
                    {step.label}
                    {i === roadmap.findIndex(s => !s.done) && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--red)', marginLeft: 10 }}>← СЕЙЧАС</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, padding: '16px', background: 'rgba(255,0,48,0.04)', border: '1px solid rgba(255,0,48,0.12)', borderRadius: 8 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 10, color: 'var(--red)', letterSpacing: '0.12em', marginBottom: 8 }}>
              ЦЕЛЬ: KASPERSKY GREAT TEAM
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ProgressRing percent={overallPercent} size={60} strokeWidth={5} label={`${overallPercent}%`} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                Kaspersky GReAT (Global Research & Analysis Team) — одна из сильнейших команд threat intelligence в мире. Путь туда — через глубокое знание уязвимостей, анализа малвари и реверс-инжиниринга.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
