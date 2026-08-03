import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import ProductView from './ProductView'
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
    "mainImage": images[0]
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
    <main className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4 md:px-6 relative selection:bg-orange-500 selection:text-stone-950 overflow-x-hidden">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[350px] bg-gradient-to-tr from-orange-600/15 via-amber-600/10 to-yellow-500/15 blur-[130px] pointer-events-none rounded-full" />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(120,113,108,0.12)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        <Link 
          href="/" 
          className="inline-flex items-center text-xs font-bold text-stone-400 hover:text-orange-400 transition-colors mb-8 group uppercase tracking-wider"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform mr-2">←</span> Volver al catálogo
        </Link>

        <ProductView product={product} images={allImages} />

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black tracking-tight text-stone-100 mb-8">
              También te puede <span className="text-sky-400">interesar</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => {
                const rpImg = rp.image || rp.mainImage
                return (
                  <Link
                    key={rp._id}
                    href={`/product/${rp._id}`}
                    className="group bg-stone-900/80 backdrop-blur-sm rounded-2xl border border-stone-800 hover:border-sky-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(56,189,248,0.25)] overflow-hidden"
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
                      <span className="text-lg font-black text-stone-100 tracking-tight mt-1 inline-block">
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