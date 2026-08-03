import Link from 'next/link'
import { SITE } from './config'
import { WhatsAppIcon, InstagramIcon } from './icons'

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800/80 relative overflow-hidden">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-black tracking-tight text-stone-100">
              Artigas<span className="text-orange-500"> Shop</span>
            </Link>
            <p className="text-stone-400 text-sm mt-3 leading-relaxed max-w-md">
              Tu tienda de confianza en Artigas. Productos seleccionados con los mejores precios.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hola! Quiero consultar por un producto de Artigas Shop')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-tr from-fuchsia-600 via-rose-500 to-amber-400 hover:brightness-110 text-white font-black py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4" />
                Instagram
              </a>
            </div>
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
              <li>{SITE.location}</li>
              <li>{SITE.email}</li>
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors"
                >
                  WhatsApp: {SITE.whatsapp}
                </a>
              </li>
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
