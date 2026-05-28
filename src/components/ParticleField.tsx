'use client'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 12,
        opacity: 0.15 + Math.random() * 0.4,
      }))
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            background: `radial-gradient(circle, #d4a847, #e8c4d0)`,
            animation: `lumina-rise ${p.duration}s ${p.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  )
}
