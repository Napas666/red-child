export interface TheorySection {
  id: string
  title: string
  content: string          // markdown-like rich text
  codeExample?: string
  keyPoints: string[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface Module {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  xpReward: number
  theory: TheorySection[]
  quiz: QuizQuestion[]
  prerequisites: string[]
  tags: string[]
  estimatedTime: string    // "~45 мин"
}

export interface Track {
  id: string
  title: string
  description: string
  modules: Module[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  condition: (state: UserProgress) => boolean
}

export interface ModuleProgress {
  moduleId: string
  theorySections: string[]   // completed section IDs
  quizCompleted: boolean
  quizScore: number
  quizTotal: number
  xpEarned: number
  completedAt?: string
}

export interface UserProgress {
  xp: number
  level: number
  streak: number
  lastStudyDate: string | null
  moduleProgress: Record<string, ModuleProgress>
  earnedAchievements: string[]
}
