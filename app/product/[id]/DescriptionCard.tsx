'use client'

import { useRef, useState } from 'react'

export default function DescriptionCard({ description }: { description?: string | null }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 p-6 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(34,211,238,0.18), transparent 40%)`,
        }}
      />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="relative flex items-center gap-2 mb-4">
        <span className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Descripción</h3>
      </div>
      <p className="relative text-neutral-200 text-sm leading-relaxed font-light whitespace-pre-line">
        {description || 'Sin descripción disponible.'}
      </p>
    </div>
  )
}
