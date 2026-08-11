'use client'

import { useState } from 'react'

export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:[.,]\d+)?\s*(?:°C|º|mm|cm|m|kg|g|L|ml|W|V|A|mAh|Hz|GHz|TB|GB|MB|K|%|€|\$|UY|"|pulg)\b)/gi)
  return (
    <>
      {parts.map((part, i) =>
        /^\d+(?:[.,]\d+)?\s*(?:°C|º|mm|cm|m|kg|g|L|ml|W|V|A|mAh|Hz|GHz|TB|GB|MB|K|%|€|\$|UY|"|pulg)\b$/i.test(part) ? (
          <span key={i} className="text-white font-bold">{part}</span>
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
    <div className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-4 md:p-6 overflow-hidden">
      <div className="relative flex items-center gap-2 mb-4">
        <span className="w-1 h-4 bg-white rounded-full" />
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Descripción</h3>
      </div>
      <p className={`relative text-neutral-300 text-sm leading-relaxed font-light whitespace-pre-line ${expanded ? '' : 'line-clamp-6'}`}>
        {description ? <Highlight text={description} /> : 'Sin descripción disponible.'}
      </p>
      {description && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          {expanded ? 'Ver menos ↑' : 'Ver más ↓'}
        </button>
      )}
    </div>
  )
}
