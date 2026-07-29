'use client'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-black text-neutral-800">Error</h1>
        <p className="text-sm font-mono text-neutral-400 mt-4">
          Ocurrió un error al cargar el producto.
        </p>
        <button
          onClick={() => reset()}
          className="mt-8 text-xs font-bold uppercase tracking-wider text-cyan-400 hover:text-white transition-colors bg-transparent cursor-pointer"
        >
          Intentar de nuevo
        </button>
      </div>
    </main>
  )
}
