'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'

type Props = {
  before: string
  after: string
  alt?: string
}

export function BeforeAfter({ before, after, alt = 'Detailing result' }: Props) {
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const update = useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(0, Math.min(100, x)))
  }, [])

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
      onPointerDown={(e) => {
        setDragging(true)
        ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
        update(e.clientX)
      }}
      onPointerMove={(e) => dragging && update(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {/* After (full) */}
      <Image
        src={after}
        alt={`${alt} — after`}
        fill
        sizes="(max-width: 768px) 100vw, 600px"
        className="object-cover"
        priority
      />
      <span className="absolute right-3 top-3 z-20 rounded-full bg-crystal/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ink">
        After
      </span>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <div className="relative h-full" style={{ width: ref.current?.clientWidth ?? '100%' }}>
          <Image
            src={before}
            alt={`${alt} — before`}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
        </div>
        <span className="absolute left-3 top-3 z-20 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
          Before
        </span>
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 z-30 flex h-full w-1 -translate-x-1/2 items-center justify-center bg-white/80"
        style={{ left: `${pos}%` }}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-crystal text-ink shadow-lg transition group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
            <path d="m9 6 6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
