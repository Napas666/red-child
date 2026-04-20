import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { modules } from '../data/courses/securityResearcher'
import NeonButton from '../components/ui/NeonButton'

type Phase = 'intro' | 'question' | 'result'

export default function QuizEngine() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const completeQuiz = useStore((s) => s.completeQuiz)

  const [phase, setPhase] = useState<Phase>('intro')
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [score, setScore] = useState(0)
  const [shake, setShake] = useState(false)

  const mod = modules.find((m) => m.id === moduleId)
  if (!mod || mod.quiz.length === 0) return <div style={{ color: 'var(--red)' }}>Нет теста</div>

  const question = mod.quiz[questionIdx]
  const isLast = questionIdx === mod.quiz.length - 1

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)

    const correct = idx === question.correctIndex
    setAnswers((prev) => [...prev, correct])
    if (correct) {
      setScore((s) => s + 1)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  const handleNext = () => {
    if (isLast) {
      const finalScore = answers.filter(Boolean).length + (selected === question.correctIndex ? 1 : 0)
      const xpEarned = Math.round((finalScore / mod.quiz.length) * mod.xpReward * 0.5)
      completeQuiz(mod.id, finalScore, mod.quiz.length, xpEarned)
      setPhase('result')
    } else {
      setSelected(null)
      setAnswered(false)
      setQuestionIdx((i) => i + 1)
    }
  }

  const finalScore = answers.filter(Boolean).length

  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: 600, width: '100%', margin: '0 auto' }}
      >
        <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>{mod.icon}</div>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 20,
              color: 'var(--text)',
              letterSpacing: '0.1em',
              marginBottom: 8
            }}
          >
            ТЕСТ: {mod.title.toUpperCase()}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-2)', marginBottom: 8 }}>
            {mod.quiz.length} вопросов · максимум {Math.round(mod.xpReward * 0.5)} XP
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-3)', marginBottom: 32 }}>
            100% правильных ответов даёт бонус +50% XP
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <NeonButton onClick={() => setPhase('question')} size="lg" icon="▶">
              Начать тест
            </NeonButton>
            <NeonButton variant="ghost" onClick={() => navigate(`/learn/${mod.id}`)}>
              Повторить теорию
            </NeonButton>
          </div>
        </div>
      </motion.div>
    )
  }

  if (phase === 'result') {
    const pct = Math.round((finalScore / mod.quiz.length) * 100)
    const perfect = finalScore === mod.quiz.length
    const pass = pct >= 60

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 600, width: '100%', margin: '0 auto' }}
      >
        <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{ fontSize: 64, marginBottom: 16 }}
          >
            {perfect ? '🎯' : pass ? '✅' : '❌'}
          </motion.div>

          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, letterSpacing: '0.1em', color: perfect ? '#00ff88' : pass ? 'var(--text)' : 'var(--red)', marginBottom: 8 }}>
            {perfect ? 'ИДЕАЛЬНЫЙ РЕЗУЛЬТАТ!' : pass ? 'ПРОЙДЕНО!' : 'ПОПРОБУЙ ЕЩЁ РАЗ'}
          </h2>

          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 48,
              color: perfect ? '#00ff88' : pass ? 'var(--red)' : 'rgba(255,255,255,0.3)',
              textShadow: perfect ? '0 0 20px rgba(0,255,136,0.6)' : 'var(--red-glow)',
              marginBottom: 8
            }}
          >
            {finalScore}/{mod.quiz.length}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>
            {pct}% правильных ответов
          </div>

          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 32 }}>
            {answers.map((a, i) => (
              <div
                key={i}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: a ? 'rgba(0,255,136,0.2)' : 'rgba(255,50,50,0.2)',
                  border: `1px solid ${a ? 'rgba(0,255,136,0.5)' : 'rgba(255,50,50,0.5)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14
                }}
              >
                {a ? '✓' : '✗'}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <NeonButton onClick={() => navigate('/learn')} icon="◈">
              К модулям
            </NeonButton>
            <NeonButton
              variant="secondary"
              onClick={() => {
                setPhase('intro')
                setQuestionIdx(0)
                setSelected(null)
                setAnswered(false)
                setAnswers([])
                setScore(0)
              }}
            >
              Пройти снова
            </NeonButton>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div style={{ maxWidth: 700, width: '100%', margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: 11, color: 'var(--red)', letterSpacing: '0.1em' }}>
            {mod.icon} {mod.title}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
            {questionIdx + 1} / {mod.quiz.length}
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,0,48,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${((questionIdx + 1) / mod.quiz.length) * 100}%` }}
            style={{ height: '100%', background: 'var(--red)', boxShadow: 'var(--red-glow-sm)', borderRadius: 2 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questionIdx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
        >
          {/* Difficulty badge */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: question.difficulty === 'hard' ? '#ffb800' : question.difficulty === 'medium' ? 'var(--red)' : '#00ff88',
                background: question.difficulty === 'hard' ? 'rgba(255,184,0,0.12)' : question.difficulty === 'medium' ? 'rgba(255,0,48,0.12)' : 'rgba(0,255,136,0.12)',
                padding: '2px 8px',
                borderRadius: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              {question.difficulty === 'hard' ? '⚡ HARD' : question.difficulty === 'medium' ? '◈ MEDIUM' : '○ EASY'}
            </span>
          </div>

          {/* Question */}
          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="panel"
            style={{ padding: '24px 28px', marginBottom: 16 }}
          >
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 17,
                color: 'var(--text)',
                lineHeight: 1.6,
                fontWeight: 500
              }}
            >
              {question.question}
            </p>
          </motion.div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {question.options.map((opt, i) => {
              const isCorrect = i === question.correctIndex
              const isSelected = selected === i
              let borderColor = 'rgba(255,255,255,0.1)'
              let bgColor = 'rgba(255,255,255,0.02)'
              let textColor = 'var(--text-2)'

              if (answered) {
                if (isCorrect) {
                  borderColor = 'rgba(0,255,136,0.6)'
                  bgColor = 'rgba(0,255,136,0.1)'
                  textColor = '#00ff88'
                } else if (isSelected && !isCorrect) {
                  borderColor = 'rgba(255,50,50,0.6)'
                  bgColor = 'rgba(255,50,50,0.1)'
                  textColor = '#ff5555'
                }
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleSelect(i)}
                  whileHover={answered ? {} : { scale: 1.01, x: 4 }}
                  whileTap={answered ? {} : { scale: 0.99 }}
                  style={{
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 8,
                    padding: '14px 18px',
                    textAlign: 'left',
                    cursor: answered ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    transition: 'all 0.2s'
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: `1px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-head)',
                      fontSize: 11,
                      color: textColor,
                      flexShrink: 0
                    }}
                  >
                    {answered
                      ? isCorrect
                        ? '✓'
                        : isSelected
                        ? '✗'
                        : String.fromCharCode(65 + i)
                      : String.fromCharCode(65 + i)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      color: textColor,
                      lineHeight: 1.5
                    }}
                  >
                    {opt}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'rgba(0,170,255,0.06)',
                  border: '1px solid rgba(0,170,255,0.25)',
                  borderRadius: 8,
                  padding: '14px 18px',
                  marginBottom: 20
                }}
              >
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 10, color: '#00aaff', letterSpacing: '0.1em', marginBottom: 6 }}>
                  ◈ ПОЯСНЕНИЕ
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                  {question.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {answered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <NeonButton onClick={handleNext} icon={isLast ? '🏁' : '→'}>
                {isLast ? 'Завершить тест' : 'Следующий вопрос'}
              </NeonButton>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
