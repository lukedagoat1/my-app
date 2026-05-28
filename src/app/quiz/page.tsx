'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { determineSkinType } from '@/lib/skinAnalysis'

const QUESTIONS = [
  {
    id: 'q1',
    question: 'Hours after washing, your skin feels…',
    options: [
      { id: 'a', label: 'Oily & shiny all over' },
      { id: 'b', label: 'Tight & dry' },
      { id: 'c', label: 'Oily in middle, dry on sides' },
      { id: 'd', label: 'Comfortable' },
    ],
  },
  {
    id: 'q2',
    question: 'How often do you break out?',
    options: [
      { id: 'a', label: 'Almost every week' },
      { id: 'b', label: 'A few times a month' },
      { id: 'c', label: 'Rarely' },
      { id: 'd', label: 'Basically never' },
    ],
  },
  {
    id: 'q3',
    question: 'Your pores look…',
    options: [
      { id: 'a', label: 'Large everywhere' },
      { id: 'b', label: 'Barely visible' },
      { id: 'c', label: 'Big on nose only' },
      { id: 'd', label: 'Normal' },
    ],
  },
  {
    id: 'q4',
    question: 'New products on your skin…',
    options: [
      { id: 'a', label: 'Often sting or redden' },
      { id: 'b', label: 'Usually fine' },
      { id: 'c', label: 'Occasionally react' },
      { id: 'd', label: 'Never a problem' },
    ],
  },
  {
    id: 'q5',
    question: 'By end of day, skin looks…',
    options: [
      { id: 'a', label: 'Very oily all over' },
      { id: 'b', label: 'Tight & dull' },
      { id: 'c', label: 'Shiny in middle only' },
      { id: 'd', label: 'Same as morning' },
    ],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const { setQuizAnswer, quizAnswers, setSkinType, setConcerns, skinMetrics } = useAppStore()
  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState<string | null>(null)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    setSelected(quizAnswers[QUESTIONS[current].id] ?? null)
  }, [current, quizAnswers])

  const handleSelect = (optionId: string) => {
    setSelected(optionId)
    setQuizAnswer(QUESTIONS[current].id, optionId)
    setTimeout(() => advance(), 350)
  }

  const advance = () => {
    if (current < QUESTIONS.length - 1) {
      setDirection(1)
      setCurrent(c => c + 1)
    } else {
      finish()
    }
  }

  const back = () => {
    if (current > 0) { setDirection(-1); setCurrent(c => c - 1) }
  }

  const finish = () => {
    const answers = useAppStore.getState().quizAnswers
    const { type, concerns } = determineSkinType(answers, skinMetrics)
    setSkinType(type)
    setConcerns(concerns)
    router.push('/results')
  }

  const q = QUESTIONS[current]
  const progress = ((current + 1) / QUESTIONS.length) * 100

  return (
    <div className="min-h-screen bg-[#06060f] flex flex-col">
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <button onClick={back} className="text-white/40 hover:text-white/80 transition-colors text-sm">
          ← Back
        </button>
        <span className="text-lg font-bold tracking-[0.15em]" style={{
          background: 'linear-gradient(135deg, #f5e6c8, #d4a847)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          LUMINA
        </span>
        <span className="text-white/30 text-sm">{current + 1} / {QUESTIONS.length}</span>
      </div>

      <div className="h-0.5 bg-white/5">
        <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #d4a847, #e8c4d0)' }}
          animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current} custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

              <div className="mb-8">
                <p className="text-xs font-semibold text-gold/50 tracking-widest uppercase mb-4">
                  Question {current + 1}
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold text-white/90 leading-snug">
                  {q.question}
                </h2>
              </div>

              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <motion.button key={opt.id}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handleSelect(opt.id)}
                    className="w-full text-left px-6 py-4 rounded-2xl border transition-all duration-200 flex items-center gap-4"
                    style={{
                      background: selected === opt.id
                        ? 'linear-gradient(135deg, rgba(212,168,71,0.15), rgba(232,196,208,0.08))'
                        : 'rgba(255,255,255,0.03)',
                      borderColor: selected === opt.id ? 'rgba(212,168,71,0.6)' : 'rgba(255,255,255,0.08)',
                    }}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all" style={{
                      borderColor: selected === opt.id ? '#d4a847' : 'rgba(255,255,255,0.15)',
                      background:  selected === opt.id ? 'rgba(212,168,71,0.2)' : 'transparent',
                      color:       selected === opt.id ? '#d4a847' : 'rgba(255,255,255,0.3)',
                    }}>
                      {opt.id.toUpperCase()}
                    </div>
                    <span className="text-sm leading-snug transition-colors" style={{
                      color: selected === opt.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                    }}>
                      {opt.label}
                    </span>
                    {selected === opt.id && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-gold text-lg">
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>

              {selected && current === QUESTIONS.length - 1 && (
                <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  onClick={finish}
                  className="mt-8 w-full py-4 rounded-full font-semibold text-[#06060f]"
                  style={{ background: 'linear-gradient(135deg, #d4a847, #e8cc70, #e8c4d0)' }}>
                  See My Results →
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
