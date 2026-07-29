import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import Link from 'next/link'
import GalleryViewer from './GalleryViewer'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zji8ijvh',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

async function getProduct(id: string) {
  const query = `*[_type == "product" && _id == $id][0]{
    _id,
    name,
    price,
    description,
    category,
    image,
    images
  }`
  return await client.fetch(query, { id })
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-sm font-mono text-neutral-400">Producto no encontrado</p>
      </div>
    )
  }

  const builder = imageUrlBuilder(client)
  const allImages: string[] = []
  
  if (product.image) allImages.push(builder.image(product.image).url())
  if (product.images) {
    product.images.forEach((img: any) => allImages.push(builder.image(img).url()))
  }

  const trustBadges = [
    { icon: '🚚', label: 'Envío', sub: 'Artigas' },
    { icon: '🔒', label: 'Pago seguro', sub: 'Protegido' },
    { icon: '✅', label: 'Garantía', sub: '3 dias' },
  ]

  return (
    <main className="min-h-screen bg-neutral-950 text-white py-12 px-6 relative selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* Fondo ambiental estático y controlado */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-cyan-400/15 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-bold text-neutral-400 hover:text-cyan-400 transition-colors mb-8 group uppercase tracking-wider"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform mr-2">←</span> Volver al catálogo
        </Link>

        <div className="bg-neutral-900/90 backdrop-blur-2xl rounded-3xl border border-neutral-800 p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          <div className="flex flex-col gap-5">
            <GalleryViewer images={allImages} productName={product.name} />

            {/* Badges de confianza - llenan el espacio bajo la galería */}
            <div className="grid grid-cols-3 gap-3">
              {trustBadges.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center gap-1 bg-neutral-800/50 border border-neutral-800 rounded-2xl py-4 px-2 hover:border-cyan-500/30 transition-colors"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">{item.label}</span>
                  <span className="text-[10px] text-neutral-400">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.8)] px-3.5 py-1.5 rounded-full inline-block">
                {product.category || 'General'}
              </span>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-5">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tight">${product.price}</span>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">UY</span>
              </div>
              
              <div className="mt-8">
                <div className="relative rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 p-6 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />
                  <div className="relative flex items-center gap-2 mb-4">
                    <span className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Descripción</h3>
                  </div>
                  <p className="relative text-neutral-200 text-sm leading-relaxed font-light whitespace-pre-line">
                    {product.description || 'Sin descripción disponible.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-800">
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-neutral-950 font-black py-4 px-6 rounded-xl shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer">
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}