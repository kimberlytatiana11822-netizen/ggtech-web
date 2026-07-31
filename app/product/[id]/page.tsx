import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import GalleryViewer from './GalleryViewer'
import ProductActions from './ProductActions'
import DescriptionCard from './DescriptionCard'
import { TruckIcon, LockIcon, CheckIcon } from '@/app/icons'
import type { Metadata } from 'next'
import type { Product } from '@/app/types'

async function getProduct(id: string): Promise<Product | null> {
  const query = `*[_type == "product" && _id == $id][0]{
    _id,
    name,
    shortName,
    price,
    description,
    shortDescription,
    category,
    stock,
    image,
    images
  }`
  return await client.fetch(query, { id })
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description || `Producto ${product.name} en Artigas Shop`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const allImages: string[] = []
  
  if (product.image) allImages.push(urlFor(product.image).url())
  if (product.images) {
    product.images.forEach((img) => allImages.push(urlFor(img).url()))
  }

  const trustBadges = [
    { icon: TruckIcon, label: 'Envío', sub: 'Artigas' },
    { icon: LockIcon, label: 'Pago seguro', sub: 'Protegido' },
    { icon: CheckIcon, label: 'Garantía', sub: '3 dias' },
  ]

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 py-12 px-6 relative selection:bg-orange-500 selection:text-stone-950 overflow-x-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[350px] bg-gradient-to-tr from-orange-600/15 via-amber-600/10 to-yellow-500/15 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-bold text-stone-400 hover:text-orange-400 transition-colors mb-8 group uppercase tracking-wider"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform mr-2">←</span> Volver al catálogo
        </Link>

        <div className="bg-stone-900/90 backdrop-blur-2xl rounded-3xl border border-stone-800 p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          <div className="flex flex-col gap-5">
            <GalleryViewer images={allImages} productName={product.name} />

            <div className="grid grid-cols-3 gap-3">
              {trustBadges.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center gap-1 bg-stone-800/50 border border-stone-800 rounded-2xl py-4 px-2 hover:border-orange-500/30 transition-colors"
                >
                  <span className="text-xl text-orange-400" aria-hidden="true">
                    <item.icon className="w-6 h-6" />
                  </span>
                  <span className="text-[11px] font-bold text-stone-100 uppercase tracking-wider">{item.label}</span>
                  <span className="text-[10px] text-stone-400">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.8)] px-3.5 py-1.5 rounded-full inline-block">
                {product.category || 'General'}
              </span>

              <h1 className="text-3xl md:text-4xl font-black text-stone-100 tracking-tight mt-5">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-stone-100 tracking-tight">${product.price}</span>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">UY</span>
              </div>
              
              <div className="mt-8">
                <DescriptionCard description={product.description} />
              </div>
            </div>

            <ProductActions name={product.name} price={product.price} stock={product.stock} />
          </div>
        </div>

      </div>
    </main>
  )
}