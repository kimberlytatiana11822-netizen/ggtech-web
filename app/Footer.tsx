import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-black tracking-tight text-stone-100">
              Artigas<span className="text-orange-500"> Shop</span>
            </Link>
            <p className="text-stone-400 text-sm mt-3 leading-relaxed max-w-md">
              Tu tienda de confianza en Artigas. Productos seleccionados con los mejores precios.
            </p>
          </div>

          <div>
            <h3 className="text-stone-100 font-bold text-xs uppercase tracking-widest mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-stone-400 hover:text-orange-400 text-sm transition-colors">Inicio</Link></li>
              <li><Link href="/" className="text-stone-400 hover:text-orange-400 text-sm transition-colors">Catálogo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-stone-100 font-bold text-xs uppercase tracking-widest mb-4">Contacto</h3>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li>Artigas, Uruguay</li>
              <li>contacto@artigasshop.uy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800/60 mt-8 pt-8 text-center text-stone-500 text-xs">
          &copy; {new Date().getFullYear()} Artigas Shop. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
