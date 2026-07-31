import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black text-stone-800">404</h1>
        <p className="text-sm font-mono text-stone-400 mt-4">Página no encontrada</p>
        <Link
          href="/"
          className="inline-block mt-8 text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-white transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    </main>
  )
}
