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
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [colorQty, setColorQty] = useState<Record<string, number>>({})

  const hasColors = !!product.hasColors && !!product.colors && product.colors.length > 0
  const totalUnits = hasColors
    ? Math.max(1, selectedColors.reduce((acc, c) => acc + (colorQty[c] ?? 1), 0))
    : quantity
  const total = product.price * totalUnits

  const toggleColor = (c: string) => {
    if (selectedColors.includes(c)) {
      setSelectedColors((prev) => prev.filter((x) => x !== c))
      return
    }
    const stockLimit = product.stock && product.stock > 0 ? product.stock : Infinity
    const currentTotal = selectedColors.reduce((a, x) => a + (colorQty[x] ?? 1), 0)
    const remaining = Number.isFinite(stockLimit) ? Math.max(0, stockLimit - currentTotal) : 1
    setColorQty((q) => ({ ...q, [c]: Math.min(1, remaining) }))
    setSelectedColors((prev) => [...prev, c])
  }

  const changeColorQty = (c: string, q: number) => {
    setColorQty((prev) => ({ ...prev, [c]: q }))
  }

  const titleBlock = (
    <div>
      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-red-700 shadow-[0_0_15px_rgba(185,28,28,0.9)] px-3.5 py-1.5 rounded-full inline-block">
        {product.category || 'General'}
      </span>

      <h1 className="text-3xl md:text-4xl font-black text-stone-100 tracking-tight mt-5">
        {product.name}
      </h1>
    </div>
  )

  const priceBlock = (
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-black text-sky-400 tracking-tight">${total}</span>
      {product.oldPrice && product.oldPrice > product.price && (
        <span className="text-lg font-bold text-stone-500 line-through tracking-tight">
          ${product.oldPrice * totalUnits}
        </span>
      )}
      <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">UY</span>
      {totalUnits > 1 && (
        <span className="text-sm font-bold text-stone-500">({totalUnits} × ${product.price})</span>
      )}
    </div>
  )

  const badgesBlock = (
    <div className="grid grid-cols-3 gap-3">
      {trustBadges.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center text-center gap-1 bg-stone-800/50 border border-stone-800 rounded-2xl py-4 px-2 hover:border-orange-500/30 transition-colors"
        >
          <span className="text-xl text-sky-400" aria-hidden="true">
            <item.icon className="w-6 h-6" />
          </span>
          <span className="text-[11px] font-bold text-stone-100 uppercase tracking-wider">{item.label}</span>
          <span className="text-[10px] text-stone-400">{item.sub}</span>
        </div>
      ))}
    </div>
  )

  const actionsBlock = (
    <ProductActions
      name={product.name}
      price={product.price}
      stock={product.stock}
      hasColors={product.hasColors}
      colors={product.colors}
      quantity={quantity}
      onQuantityChange={setQuantity}
      selectedColors={selectedColors}
      onToggleColor={toggleColor}
      colorQty={colorQty}
      onColorQtyChange={changeColorQty}
      totalUnits={totalUnits}
    />
  )

  return (
    <div className="bg-stone-900/90 backdrop-blur-2xl rounded-3xl border border-stone-800 p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
      {/* Móvil: título → galería → badges → descripción → precio → acciones */}
      <div className="md:hidden flex flex-col gap-8">
        <div>{titleBlock}</div>
        <div className="flex flex-col gap-5">
          <GalleryViewer images={images} productName={product.name} />
          {badgesBlock}
        </div>
        <div>
          <div className="mt-8">
            <DescriptionCard description={product.description} />
          </div>
        </div>
        <div className="-mb-12">
          <div className="mt-0">{priceBlock}</div>
        </div>
        <div>{actionsBlock}</div>
      </div>

      {/* PC: imágenes y botones a la izquierda, título/precio/descripción a la derecha */}
      <div className="hidden md:grid md:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div className="flex flex-col gap-5">
          <GalleryViewer images={images} productName={product.name} />
          {actionsBlock}
          {badgesBlock}
        </div>
        <div className="flex flex-col">
          {titleBlock}
          <div className="mt-4">{priceBlock}</div>
          <div className="mt-8">
            <DescriptionCard description={product.description} />
          </div>
        </div>
      </div>
    </div>
  )
}
