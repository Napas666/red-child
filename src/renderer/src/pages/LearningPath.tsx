import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { modules } from '../data/courses/securityResearcher'
import NeonButton from '../components/ui/NeonButton'

export default function LearningPath() {
  const navigate = useNavigate()
  const moduleProgress = useStore((s) => s.moduleProgress)
  const isUnlocked = useStore((s) => s.isModuleUnlocked)

  return (
    <div style={{ maxWidth: 800, width: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 22,
            letterSpacing: '0.12em',
            color: 'var(--text)',
            marginBottom: 6
          }}
        >
          LEARNING PATH
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-2)' }}>
          Security Researcher Track — Kaspersky Internship
        </p>
      </motion.div>

      {/* Module list with connecting line */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 27,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(to bottom, var(--red), rgba(255,0,48,0.1))',
            boxShadow: '0 0 8px rgba(255,0,48,0.4)'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {modules.map((mod, i) => {
            const prog = moduleProgress[mod.id]
            const unlocked = isUnlocked(mod.id, mod.prerequisites)
            const completed = prog?.quizCompleted
            const theoryDone = prog?.theorySections.length ?? 0
            const theoryTotal = mod.theory.length
            const hasContent = theoryTotal > 0

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}
              >
                {/* Dot */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: `2px solid ${
                      completed ? '#00ff88' : unlocked ? mod.color : 'rgba(255,255,255,0.1)'
                    }`,
                    background: completed
                      ? 'rgba(0,255,136,0.12)'
                      : unlocked
                      ? `${mod.color}18`
                      : 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: completed
                      ? '0 0 16px rgba(0,255,136,0.3)'
                      : unlocked
                      ? `0 0 16px ${mod.color}40`
                      : 'none',
                    filter: unlocked ? 'none' : 'grayscale(1) opacity(0.4)'
                  }}
                >
                  {completed ? '✓' : mod.icon}
                </div>

                {/* Card */}
                <div
                  className="panel"
                  style={{
                    flex: 1,
                    padding: '16px 20px',
                    borderColor: completed
                      ? 'rgba(0,255,136,0.25)'
                      : unlocked
                      ? 'var(--border)'
                      : 'rgba(255,255,255,0.06)',
                    opacity: unlocked ? 1 : 0.5
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-head)',
                            fontSize: 14,
                            color: completed ? '#00ff88' : unlocked ? 'var(--text)' : 'var(--text-3)',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {mod.title}
                        </span>
                        {!unlocked && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 9,
                              color: 'var(--text-3)',
                              background: 'rgba(255,255,255,0.06)',
                              padding: '2px 6px',
                              borderRadius: 3,
                              letterSpacing: '0.1em'
                            }}
                          >
                            🔒 LOCKED
                          </span>
                        )}
                        {completed && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 9,
                              color: '#00ff88',
                              background: 'rgba(0,255,136,0.12)',
                              padding: '2px 6px',
                              borderRadius: 3
                            }}
                          >
                            COMPLETE
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
                        {mod.subtitle} · {mod.estimatedTime}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 12,
                        color: completed ? '#00ff88' : 'var(--red)',
                        textShadow: completed ? '0 0 8px rgba(0,255,136,0.7)' : 'var(--red-glow-sm)'
                      }}
                    >
                      +{mod.xpReward} XP
                    </div>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 13,
                      color: 'var(--text-2)',
                      lineHeight: 1.5,
                      marginBottom: hasContent && unlocked ? 14 : 0
                    }}
                  >
                    {mod.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: hasContent && unlocked ? 14 : 0 }}>
                    {mod.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          color: 'var(--text-3)',
                          background: 'rgba(255,255,255,0.05)',
                          padding: '2px 8px',
                          borderRadius: 3,
                          border: '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Theory progress mini-bar */}
                  {hasContent && unlocked && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>
                          Теория: {theoryDone}/{theoryTotal}
                        </span>
                        {prog?.quizCompleted && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00ff88' }}>
                            Тест: {prog.quizScore}/{prog.quizTotal} ✓
                          </span>
                        )}
                      </div>
                      <div style={{ height: 3, background: 'rgba(255,0,48,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${(theoryDone / theoryTotal) * 100}%`,
                            background: 'var(--red)',
                            boxShadow: 'var(--red-glow-sm)',
                            transition: 'width 0.5s ease',
                            borderRadius: 2
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {hasContent && unlocked && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <NeonButton
                        size="sm"
                        onClick={() => navigate(`/learn/${mod.id}`)}
                        variant={completed ? 'secondary' : 'primary'}
                      >
                        {completed ? 'Повторить' : theoryDone > 0 ? 'Продолжить' : 'Начать'}
                      </NeonButton>
                      {theoryDone === theoryTotal && !completed && (
                        <NeonButton
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/quiz/${mod.id}`)}
                          icon="🎯"
                        >
                          Пройти тест
                        </NeonButton>
                      )}
                      {completed && (
                        <NeonButton
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/quiz/${mod.id}`)}
                        >
                          Тест снова
                        </NeonButton>
                      )}
                    </div>
                  )}

                  {!hasContent && (
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--text-3)',
                        marginTop: 8
                      }}
                    >
                      ⚙ В РАЗРАБОТКЕ — скоро
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
