import { client } from '@/sanity/lib/client'
import CatalogView from './CatalogView'
import type { Product } from './types'

export const dynamic = 'force-dynamic'

type SearchParams = {
  categoria?: string
  q?: string
  filtro?: string
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
    image,
    images
  }`
  return await client.fetch(query)
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const products = await getProducts()

  return (
    <CatalogView
      initialProducts={products || []}
      initialCategory={params.categoria}
      initialQuery={params.q}
      initialFilter={params.filtro}
      initialSort={params.orden}
    />
  )
}
