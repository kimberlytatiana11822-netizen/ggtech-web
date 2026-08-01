import type { SanityImageSource } from '@sanity/image-url'

export interface Product {
  _id: string
  name: string
  shortName?: string
  price: number
  oldPrice?: number
  description?: string
  shortDescription?: string
  category?: string
  stock?: number
  hasColors?: boolean
  colors?: string[]
  image: SanityImageSource
  mainImage?: SanityImageSource
  images?: SanityImageSource[]
}
