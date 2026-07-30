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
    description: product.description || `Producto ${product.name} en GG TECH`,
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
    <main className="min-h-screen bg-neutral-950 text-white py-12 px-6 relative selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
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

            <div className="grid grid-cols-3 gap-3">
              {trustBadges.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center text-center gap-1 bg-neutral-800/50 border border-neutral-800 rounded-2xl py-4 px-2 hover:border-cyan-500/30 transition-colors"
                >
                  <span className="text-xl text-cyan-400" aria-hidden="true">
                    <item.icon className="w-6 h-6" />
                  </span>
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