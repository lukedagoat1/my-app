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

export interface ScanRecord {
  id: string
  date: string
  skinType: SkinType | null
  metrics: SkinMetrics
  concerns: string[]
  thumbnail: string
}

interface AppState {
  captures: string[]
  metricsHistory: SkinMetrics[]
  skinMetrics: SkinMetrics | null
  quizAnswers: Record<string, string>
  skinType: SkinType | null
  concerns: string[]
  freeScansUsed: number
  isPremium: boolean
  scanHistory: ScanRecord[]

  addCapture: (img: string) => void
  addMetrics: (m: SkinMetrics) => void
  setSkinMetrics: (m: SkinMetrics) => void
  setQuizAnswer: (id: string, answer: string) => void
  setSkinType: (t: SkinType) => void
  setConcerns: (c: string[]) => void
  reset: () => void
  setIsPremium: (v: boolean) => void
  saveScanToHistory: (record: ScanRecord) => void
  incrementFreeScansUsed: () => void
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
      freeScansUsed: 0,
      isPremium: false,
      scanHistory: [],

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
      setIsPremium: (v) => set({ isPremium: v }),
      saveScanToHistory: (record) =>
        set((s) => ({ scanHistory: [record, ...s.scanHistory].slice(0, 10) })),
      incrementFreeScansUsed: () =>
        set((s) => ({ freeScansUsed: s.freeScansUsed + 1 })),
    }),
    { name: 'lumina-store' }
  )
)
