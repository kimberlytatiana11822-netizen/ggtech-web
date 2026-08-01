import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import GalleryViewer from './GalleryViewer'
import ProductActions from './ProductActions'
import DescriptionCard from './DescriptionCard'
import { TruckIcon, LockIcon, CheckIcon } from '@/app/icons'
import { SITE } from '@/app/config'
import type { Metadata } from 'next'
import type { Product } from '@/app/types'

export const dynamic = 'force-dynamic'

const getProduct = cache(async (id: string): Promise<Product | null> => {
  const query = `*[_type == "product" && _id == $id][0]{
    _id,
    name,
    shortName,
    price,
    oldPrice,
    description,
    shortDescription,
    category,
    stock,
    hasColors,
    colors,
    image,
    images
  }`
  return await client.fetch(query, { id })
})

async function getRelatedProducts(product: Product): Promise<Product[]> {
  if (!product.category) return []
  const query = `*[_type == "product" && category == $category && _id != $id][0...4]{
    _id,
    name,
    shortName,
    price,
    oldPrice,
    shortDescription,
    category,
    image,
    images
  }`
  return await client.fetch(query, { category: product.category, id: product._id })
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return {}
  const ogImage = product.image || (product.images && product.images[0])
  return {
    title: product.name,
    description: product.description || `Producto ${product.name} en Artigas Shop`,
    openGraph: {
      title: product.name,
      description: product.description || `Producto ${product.name} en Artigas Shop`,
      type: 'website',
      images: ogImage
        ? [{ url: urlFor(ogImage).width(1200).auto('format').url(), alt: product.name }]
        : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product)

  const allImages: string[] = []
  const seen = new Set<string>()

  const addImage = (img: Parameters<typeof urlFor>[0]) => {
    const url = urlFor(img).width(1200).auto('format').url()
    if (!seen.has(url)) {
      seen.add(url)
      allImages.push(url)
    }
  }

  if (product.image) addImage(product.image)
  if (product.images) product.images.forEach(addImage)

  const trustBadges = [
    { icon: TruckIcon, label: 'Envío', sub: 'a domicilio' },
    { icon: LockIcon, label: 'Pago seguro', sub: 'abonás al recibir' },
    { icon: CheckIcon, label: 'Garantía', sub: 'calidad garantizada' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    image: allImages.length > 0 ? allImages[0] : undefined,
    url: `${SITE.url}/product/${product._id}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'UYU',
      price: product.price,
      availability:
        product.stock && product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 py-12 px-6 relative selection:bg-orange-500 selection:text-stone-950 overflow-x-hidden">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                <span className="text-4xl font-black text-orange-400 tracking-tight">${product.price}</span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-lg font-bold text-stone-500 line-through tracking-tight">${product.oldPrice}</span>
                )}
                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">UY</span>
              </div>
              
              <div className="mt-8">
                <DescriptionCard description={product.description} />
              </div>
            </div>

            <ProductActions name={product.name} price={product.price} stock={product.stock} hasColors={product.hasColors} colors={product.colors} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black tracking-tight text-stone-100 mb-8">
              También te puede <span className="text-orange-400">interesar</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => {
                const rpImg = rp.image || (rp.images && rp.images[0])
                return (
                  <Link
                    key={rp._id}
                    href={`/product/${rp._id}`}
                    className="group bg-stone-900/80 backdrop-blur-sm rounded-2xl border border-stone-800 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(234,88,12,0.25)] overflow-hidden"
                  >
                    <div className="w-full aspect-[4/3] bg-stone-900 relative overflow-hidden">
                      {rpImg ? (
                        <Image
                          src={urlFor(rpImg).width(600).auto('format').url()}
                          alt={rp.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="text-stone-500 text-xs font-mono flex items-center justify-center h-full">Sin Imagen</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-stone-100 line-clamp-1">
                        {rp.shortName || rp.name}
                      </h3>
                      <span className="text-lg font-black text-orange-400 tracking-tight mt-1 inline-block">
                        ${rp.price}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}