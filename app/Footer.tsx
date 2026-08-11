import Link from 'next/link'
import Image from 'next/image'
import { SITE } from './config'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tight text-white">
              <span className="h-10 w-10 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-black/20">
                <Image src="/logo.jpg" alt="Artigas Shop" width={40} height={40} className="object-contain w-full h-full" />
              </span>
              ARTIGAS<span className="text-neutral-600">SHOP</span>
            </Link>
            <p className="text-neutral-400 text-sm mt-4 leading-relaxed max-w-md">
              Tu tienda de confianza en Artigas, Uruguay. Tecnología, cocina, belleza y más
              con los mejores precios y envío a domicilio.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Enlaces</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-neutral-400 hover:text-white text-sm transition-colors">Inicio</Link></li>
              <li><Link href="/#catalogo" className="text-neutral-400 hover:text-white text-sm transition-colors">Catálogo</Link></li>
              <li><Link href="/" className="text-neutral-400 hover:text-white text-sm transition-colors">Ofertas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">Contacto</h3>
            <ul className="space-y-3 text-neutral-400 text-sm">
              <li>{SITE.location}</li>
              <li>{SITE.email}</li>
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: 098 610 733
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-xs">
          <span>&copy; {new Date().getFullYear()} Artigas Shop. Todos los derechos reservados.</span>
          <span className="uppercase tracking-widest">Hecho con ♥ en Artigas, Uruguay</span>
        </div>
      </div>
    </footer>
  )
}
