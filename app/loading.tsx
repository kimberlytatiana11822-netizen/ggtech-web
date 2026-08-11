export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-9 h-9 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <p className="text-sm font-mono text-neutral-500">Cargando...</p>
      </div>
    </main>
  )
}
