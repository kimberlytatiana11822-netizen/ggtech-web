import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-black text-neutral-800">404</h1>
        <p className="text-sm font-mono text-neutral-400 mt-4">Producto no encontrado</p>
        <Link
          href="/"
          className="inline-block mt-8 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-white transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    </main>
  )
}
