import { createClient } from 'next-sanity'
import CatalogView from './CatalogView'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zji8ijvh',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function getProducts() {
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