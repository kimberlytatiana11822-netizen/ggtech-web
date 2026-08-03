export default function Loading() {
  return (
    <main className="min-h-screen bg-stone-950 text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-9 h-9 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
        <p className="text-sm font-mono text-stone-400">Cargando...</p>
      </div>
    </main>
  )
}
