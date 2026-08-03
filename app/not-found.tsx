import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative text-center max-w-md">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-fuchsia-500">404</h1>
        <p className="text-sm font-mono text-stone-400 mt-4">Página no encontrada</p>
        <Link
          href="/"
          className="inline-block mt-8 text-xs font-bold uppercase tracking-wider text-sky-400 hover:text-sky-300 transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    </main>
  )
}
