export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-neutral-500">Cargando producto...</p>
      </div>
    </main>
  )
}
