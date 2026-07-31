import type { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { SITE } from './config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await client.fetch<{ _id: string }[]>(`*[_type == "product"]{_id}`)

  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...products.map((p) => ({
      url: `${SITE.url}/product/${p._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
