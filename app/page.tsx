import { client } from '@/sanity/lib/client'
import CatalogView from './CatalogView'
import type { Product } from './types'

async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"]{
    _id,
    name,
    price,
    description,
    category,
    image,
    images
  }`
  return await client.fetch(query)
}

export default async function Home() {
  const products = await getProducts()
  return <CatalogView initialProducts={products || []} />
}