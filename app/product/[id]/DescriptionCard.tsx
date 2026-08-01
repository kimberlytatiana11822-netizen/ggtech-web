export function Highlight({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:[.,]\d+)?\s*(?:°C|º|mm|cm|m|kg|g|L|ml|W|V|A|mAh|Hz|GHz|TB|GB|MB|K|%|€|\$|UY|"|pulg)\b)/gi)
  return (
    <>
      {parts.map((part, i) =>
        /^\d+(?:[.,]\d+)?\s*(?:°C|º|mm|cm|m|kg|g|L|ml|W|V|A|mAh|Hz|GHz|TB|GB|MB|K|%|€|\$|UY|"|pulg)\b$/i.test(part) ? (
          <span key={i} className="text-orange-400 font-bold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function DescriptionCard({ description }: { description?: string | null }) {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/40 shadow-[0_0_30px_-8px_rgba(234,88,12,0.4)] p-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_circle_at_20%_10%,rgba(234,88,12,0.15),transparent_40%)]" />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full pointer-events-none" />
      <div className="relative flex items-center gap-2 mb-4">
        <span className="w-1 h-4 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
        <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest">Descripción</h3>
      </div>
      <p className="relative text-stone-200 text-sm leading-relaxed font-light whitespace-pre-line">
        {description ? <Highlight text={description} /> : 'Sin descripción disponible.'}
      </p>
    </div>
  )
}
