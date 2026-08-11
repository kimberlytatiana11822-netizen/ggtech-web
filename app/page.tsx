import { client } from '@/sanity/lib/client'
import { cache } from 'react'
import CatalogView from './CatalogView'
import type { Product } from './types'

export const dynamic = 'force-dynamic'

type SearchParams = {
  categoria?: string
  q?: string
  orden?: string
}

async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"]{
    _id,
    name,
    shortName,
    price,
    oldPrice,
    description,
    shortDescription,
    category,
    stock,
    featured,
    image,
    "mainImage": images[0]
  }`
  return await client.fetch(query)
}

const cachedGetProducts = cache(getProducts)

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const products = await cachedGetProducts()

  return (
    <CatalogView
      initialProducts={products || []}
      initialCategory={params.categoria}
      initialQuery={params.q}
      initialSort={params.orden}
    />
  )
}
