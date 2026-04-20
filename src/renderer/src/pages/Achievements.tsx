import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { achievements } from '../data/achievements'

export default function Achievements() {
  const earnedAchievements = useStore((s) => s.earnedAchievements)
  const earnAchievement = useStore((s) => s.earnAchievement)
  const storeState = useStore((s) => ({
    xp: s.xp,
    level: s.currentLevel(),
    streak: s.streak,
    lastStudyDate: s.lastStudyDate,
    moduleProgress: s.moduleProgress,
    earnedAchievements: s.earnedAchievements
  }))

  // Check and award achievements
  useEffect(() => {
    achievements.forEach((a) => {
      if (!earnedAchievements.includes(a.id) && a.condition(storeState)) {
        earnAchievement(a.id, a.xpReward)
      }
    })
  }, [storeState.xp, storeState.streak, storeState.moduleProgress])

  const earned = achievements.filter((a) => earnedAchievements.includes(a.id))
  const locked = achievements.filter((a) => !earnedAchievements.includes(a.id))

  return (
    <div style={{ maxWidth: 900, width: '100%' }}>
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
          ACHIEVEMENTS
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-2)' }}>
          {earned.length} / {achievements.length} разблокировано
        </p>
      </motion.div>

      {/* Earned */}
      {earned.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, letterSpacing: '0.12em', color: '#00ff88', marginBottom: 14 }}>
            ✅ ПОЛУЧЕНО
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {earned.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="panel"
                style={{
                  padding: '16px 18px',
                  borderColor: 'rgba(0,255,136,0.25)',
                  background: 'rgba(0,255,136,0.04)',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center'
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(0,255,136,0.12)',
                    border: '1px solid rgba(0,255,136,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                    boxShadow: '0 0 16px rgba(0,255,136,0.2)'
                  }}
                >
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, color: '#00ff88', marginBottom: 3 }}>
                    {a.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4, marginBottom: 4 }}>
                    {a.description}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00ff8888' }}>
                    +{a.xpReward} XP
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-3)', marginBottom: 14 }}>
            🔒 ЗАБЛОКИРОВАНО
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {locked.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (earned.length + i) * 0.04 }}
                className="panel"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  opacity: 0.5
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    flexShrink: 0,
                    filter: 'grayscale(1)'
                  }}
                >
                  {a.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, color: 'var(--text-3)', marginBottom: 3 }}>
                    {a.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-3)', lineHeight: 1.4, marginBottom: 4 }}>
                    {a.description}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>
                    +{a.xpReward} XP
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
