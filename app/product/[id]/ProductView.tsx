'use client'

import { useState } from 'react'
import GalleryViewer from './GalleryViewer'
import ProductActions from './ProductActions'
import DescriptionCard from './DescriptionCard'
import { TruckIcon, LockIcon, CheckIcon } from '@/app/icons'
import type { Product } from '@/app/types'

const trustBadges = [
  { icon: TruckIcon, label: 'Envío', sub: 'a domicilio' },
  { icon: LockIcon, label: 'Pago seguro', sub: 'abonás al recibir' },
  { icon: CheckIcon, label: 'Garantía', sub: 'calidad garantizada' },
]

export default function ProductView({
  product,
  images,
}: {
  product: Product
  images: string[]
}) {
  const [quantity, setQuantity] = useState(1)
  const total = product.price * quantity

  return (
    <div className="bg-stone-900/90 backdrop-blur-2xl rounded-3xl border border-stone-800 p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch md:items-start">
      <div className="order-1 md:col-start-2 md:row-start-1 flex flex-col">
        <div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.8)] px-3.5 py-1.5 rounded-full inline-block">
            {product.category || 'General'}
          </span>

          <h1 className="text-3xl md:text-4xl font-black text-stone-100 tracking-tight mt-5">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="order-2 md:col-start-1 md:row-start-1 md:row-span-4 flex flex-col gap-5">
        <GalleryViewer images={images} productName={product.name} />

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

      <div className="order-4 md:col-start-2 md:row-start-2 flex flex-col -mb-12 md:mb-0">
        <div className="mt-0">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-orange-400 tracking-tight">${total}</span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-lg font-bold text-stone-500 line-through tracking-tight">
                ${product.oldPrice * quantity}
              </span>
            )}
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">UY</span>
            {quantity > 1 && (
              <span className="text-sm font-bold text-stone-500">({quantity} × ${product.price})</span>
            )}
          </div>
        </div>
      </div>

      <div className="order-3 md:col-start-2 md:row-start-4 flex flex-col">
        <div className="mt-8">
          <DescriptionCard description={product.description} />
        </div>
      </div>

      <div className="order-5 md:col-start-2 md:row-start-3 flex flex-col">
        <ProductActions
          name={product.name}
          price={product.price}
          stock={product.stock}
          hasColors={product.hasColors}
          colors={product.colors}
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      </div>
    </div>
  )
}
