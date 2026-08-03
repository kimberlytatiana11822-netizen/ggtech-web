'use client'

import { useState } from 'react'

export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:[.,]\d+)?\s*(?:°C|º|mm|cm|m|kg|g|L|ml|W|V|A|mAh|Hz|GHz|TB|GB|MB|K|%|€|\$|UY|"|pulg)\b)/gi)
  return (
    <>
      {parts.map((part, i) =>
        /^\d+(?:[.,]\d+)?\s*(?:°C|º|mm|cm|m|kg|g|L|ml|W|V|A|mAh|Hz|GHz|TB|GB|MB|K|%|€|\$|UY|"|pulg)\b$/i.test(part) ? (
          <span key={i} className="text-sky-400 font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function DescriptionCard({ description }: { description?: string | null }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-sky-500/10 via-sky-400/5 to-transparent border border-sky-500/40 shadow-[0_0_30px_-8px_rgba(56,189,248,0.4)] p-4 md:p-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_circle_at_20%_10%,rgba(56,189,248,0.15),transparent_40%)]" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="relative flex items-center gap-2 mb-4">
        <span className="w-1 h-4 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
        <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest">Descripción</h3>
      </div>
      <p className={`relative text-stone-200 text-sm leading-relaxed font-light whitespace-pre-line ${expanded ? '' : 'line-clamp-6'}`}>
        {description ? <Highlight text={description} /> : 'Sin descripción disponible.'}
      </p>
      {description && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
        >
          {expanded ? 'Ver menos ↑' : 'Ver más ↓'}
        </button>
      )}
    </div>
  )
}