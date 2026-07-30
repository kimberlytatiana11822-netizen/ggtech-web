import type { SanityImageSource } from '@sanity/image-url'

export interface Product {
  _id: string
  name: string
  shortName?: string
  price: number
  description?: string
  shortDescription?: string
  category?: string
  stock?: number
  image: SanityImageSource
  images?: SanityImageSource[]
}
