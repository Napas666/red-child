import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProgress, ModuleProgress } from '../types'

function xpToLevel(xp: number): number {
  // Level formula: each level needs level * 150 XP
  let level = 1
  let required = 0
  while (true) {
    required += level * 150
    if (xp < required) break
    level++
  }
  return level
}

function xpForCurrentLevel(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) total += i * 150
  return total
}

function xpForNextLevel(level: number): number {
  let total = 0
  for (let i = 1; i <= level; i++) total += i * 150
  return total
}

interface StoreState extends UserProgress {
  // Derived helpers
  currentLevel: () => number
  xpProgress: () => { current: number; needed: number; percent: number }
  isModuleUnlocked: (moduleId: string, prerequisites: string[]) => boolean

  // Actions
  completeTheorySection: (moduleId: string, sectionId: string) => void
  completeQuiz: (moduleId: string, score: number, total: number, xpEarned: number) => void
  earnAchievement: (id: string, xp: number) => void
  refreshStreak: () => void
  resetProgress: () => void
}

const initialState: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  moduleProgress: {},
  earnedAchievements: []
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      currentLevel: () => xpToLevel(get().xp),

      xpProgress: () => {
        const xp = get().xp
        const level = xpToLevel(xp)
        const start = xpForCurrentLevel(level)
        const end = xpForNextLevel(level)
        return {
          current: xp - start,
          needed: end - start,
          percent: Math.round(((xp - start) / (end - start)) * 100)
        }
      },

      isModuleUnlocked: (_moduleId, prerequisites) => {
        if (prerequisites.length === 0) return true
        const { moduleProgress } = get()
        return prerequisites.every(
          (prereq) => moduleProgress[prereq]?.quizCompleted
        )
      },

      completeTheorySection: (moduleId, sectionId) => {
        set((s) => {
          const prev = s.moduleProgress[moduleId] ?? {
            moduleId,
            theorySections: [],
            quizCompleted: false,
            quizScore: 0,
            quizTotal: 0,
            xpEarned: 0
          }
          if (prev.theorySections.includes(sectionId)) return s
          const sectionXp = 30
          return {
            xp: s.xp + sectionXp,
            moduleProgress: {
              ...s.moduleProgress,
              [moduleId]: {
                ...prev,
                theorySections: [...prev.theorySections, sectionId],
                xpEarned: prev.xpEarned + sectionXp
              }
            }
          }
        })
        get().refreshStreak()
      },

      completeQuiz: (moduleId, score, total, xpEarned) => {
        set((s) => {
          const prev = s.moduleProgress[moduleId] ?? {
            moduleId,
            theorySections: [],
            quizCompleted: false,
            quizScore: 0,
            quizTotal: 0,
            xpEarned: 0
          }
          if (prev.quizCompleted && score <= prev.quizScore) return s
          const bonus = score === total ? Math.round(xpEarned * 0.5) : 0
          return {
            xp: s.xp + xpEarned + bonus,
            moduleProgress: {
              ...s.moduleProgress,
              [moduleId]: {
                ...prev,
                quizCompleted: true,
                quizScore: Math.max(prev.quizScore, score),
                quizTotal: total,
                xpEarned: prev.xpEarned + xpEarned + bonus,
                completedAt: new Date().toISOString()
              }
            }
          }
        })
        get().refreshStreak()
      },

      earnAchievement: (id, xp) => {
        set((s) => {
          if (s.earnedAchievements.includes(id)) return s
          return {
            xp: s.xp + xp,
            earnedAchievements: [...s.earnedAchievements, id]
          }
        })
      },

      refreshStreak: () => {
        set((s) => {
          const today = new Date().toDateString()
          if (s.lastStudyDate === today) return s
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          const newStreak = s.lastStudyDate === yesterday ? s.streak + 1 : 1
          return { streak: newStreak, lastStudyDate: today }
        })
      },

      resetProgress: () => set(initialState)
    }),
    {
      name: 'red-protocol-progress',
      version: 1
    }
  )
)
