import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SkinMetrics {
  oiliness: number
  hydration: number
  redness: number
  texture: number
  uniformity: number
}

export type SkinType = 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal'

interface AppState {
  captures: string[]
  metricsHistory: SkinMetrics[]
  skinMetrics: SkinMetrics | null
  quizAnswers: Record<string, string>
  skinType: SkinType | null
  concerns: string[]

  addCapture: (img: string) => void
  addMetrics: (m: SkinMetrics) => void
  setSkinMetrics: (m: SkinMetrics) => void
  setQuizAnswer: (id: string, answer: string) => void
  setSkinType: (t: SkinType) => void
  setConcerns: (c: string[]) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      captures: [],
      metricsHistory: [],
      skinMetrics: null,
      quizAnswers: {},
      skinType: null,
      concerns: [],

      addCapture: (img) => set((s) => ({ captures: [...s.captures, img] })),
      addMetrics: (m) => set((s) => ({ metricsHistory: [...s.metricsHistory, m] })),
      setSkinMetrics: (m) => set({ skinMetrics: m }),
      setQuizAnswer: (id, answer) =>
        set((s) => ({ quizAnswers: { ...s.quizAnswers, [id]: answer } })),
      setSkinType: (t) => set({ skinType: t }),
      setConcerns: (c) => set({ concerns: c }),
      reset: () =>
        set({
          captures: [],
          metricsHistory: [],
          skinMetrics: null,
          quizAnswers: {},
          skinType: null,
          concerns: [],
        }),
    }),
    { name: 'lumina-store' }
  )
)
