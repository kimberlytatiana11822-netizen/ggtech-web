import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-black tracking-tight text-white">
              GG<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400">TECH</span>
            </Link>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed max-w-md">
              Tu tienda de tecnología en Uruguay. Productos seleccionados con los mejores precios.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-cyan-400 text-sm transition-colors">Inicio</Link></li>
              <li><Link href="/" className="text-neutral-400 hover:text-cyan-400 text-sm transition-colors">Catálogo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Contacto</h3>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li>Uruguay</li>
              <li>contacto@ggtech.uy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800/60 mt-8 pt-8 text-center text-neutral-500 text-xs">
          &copy; {new Date().getFullYear()} GG TECH. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
