import type { Achievement } from '../types'

export const achievements: Achievement[] = [
  {
    id: 'first-blood',
    title: 'First Blood',
    description: 'Прочитай первый теоретический раздел',
    icon: '🩸',
    xpReward: 50,
    condition: (s) => Object.values(s.moduleProgress).some((m) => m.theorySections.length > 0)
  },
  {
    id: 'quiz-master-1',
    title: 'Quiz Master I',
    description: 'Пройди первый тест на 100%',
    icon: '🎯',
    xpReward: 100,
    condition: (s) =>
      Object.values(s.moduleProgress).some(
        (m) => m.quizCompleted && m.quizScore === m.quizTotal && m.quizTotal > 0
      )
  },
  {
    id: 'module-complete-1',
    title: 'Operator',
    description: 'Полностью пройди модуль «Основы ИБ»',
    icon: '🛡',
    xpReward: 150,
    condition: (s) => s.moduleProgress['mod-01']?.quizCompleted === true
  },
  {
    id: 'module-complete-2',
    title: 'Web Hunter',
    description: 'Полностью пройди модуль «Веб-безопасность»',
    icon: '🕸',
    xpReward: 200,
    condition: (s) => s.moduleProgress['mod-02']?.quizCompleted === true
  },
  {
    id: 'module-complete-3',
    title: 'Researcher',
    description: 'Полностью пройди модуль «Исследование уязвимостей»',
    icon: '🔬',
    xpReward: 250,
    condition: (s) => s.moduleProgress['mod-03']?.quizCompleted === true
  },
  {
    id: 'streak-3',
    title: 'On Fire',
    description: 'Учись 3 дня подряд',
    icon: '🔥',
    xpReward: 75,
    condition: (s) => s.streak >= 3
  },
  {
    id: 'streak-7',
    title: 'Dedicated',
    description: 'Учись 7 дней подряд',
    icon: '⚡',
    xpReward: 200,
    condition: (s) => s.streak >= 7
  },
  {
    id: 'level-5',
    title: 'Level 5',
    description: 'Достигни 5 уровня',
    icon: '⭐',
    xpReward: 300,
    condition: (s) => s.level >= 5
  },
  {
    id: 'blockchain-bridge',
    title: 'Chain Breaker',
    description: 'Пройди модуль исследования уязвимостей — твои навыки Solidity теперь в кибербезе',
    icon: '⛓',
    xpReward: 200,
    condition: (s) => s.moduleProgress['mod-03']?.quizCompleted === true
  },
  {
    id: 'all-theory',
    title: 'Теоретик',
    description: 'Прочитай всю теорию в первых 3 модулях',
    icon: '📖',
    xpReward: 300,
    condition: (s) => {
      const totals: Record<string, number> = {
        'mod-01': 3,
        'mod-02': 3,
        'mod-03': 3
      }
      return Object.entries(totals).every(
        ([id, count]) => (s.moduleProgress[id]?.theorySections.length ?? 0) >= count
      )
    }
  }
]
