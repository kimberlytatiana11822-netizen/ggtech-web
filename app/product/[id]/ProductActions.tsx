'use client'

import { useEffect, useRef, useState } from 'react'
import { WhatsAppIcon, ShareIcon, CheckIcon } from '@/app/icons'
import { SITE } from '@/app/config'

const COLOR_SWATCHES: Record<string, string> = {
  blanco: '#f5f5f4',
  negro: '#1c1917',
  gris: '#78716c',
  rojo: '#dc2626',
  rosa: '#ec4899',
  celeste: '#38bdf8',
  azul: '#2563eb',
  verde: '#22c55e',
  amarillo: '#eab308',
  lila: '#a78bfa',
  naranja: '#f97316',
  marron: '#92400e',
  bordo: '#7f1d1d',
  dorado: '#d4af37',
  plateado: '#cbd5e1',
}

export default function ProductActions({
  name,
  price,
  stock,
  hasColors,
  colors,
  quantity,
  onQuantityChange,
  selectedColors,
  onToggleColor,
  colorQty,
  onColorQtyChange,
  totalUnits,
}: {
  name: string
  price: number
  stock?: number
  hasColors?: boolean
  colors?: string[]
  quantity: number
  onQuantityChange: (q: number) => void
  selectedColors: string[]
  onToggleColor: (c: string) => void
  colorQty: Record<string, number>
  onColorQtyChange: (c: string, q: number) => void
  totalUnits: number
}) {
  const [copied, setCopied] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const [colorWarning, setColorWarning] = useState(false)
  const colorRef = useRef<HTMLDivElement>(null)

  const canPickColor = hasColors && !!colors && colors.length > 0
  const hasStock = !!stock && stock > 0
  const maxQty = hasStock ? Math.max(1, stock!) : 99
  const atMaxStock = stock && stock > 0 ? totalUnits >= maxQty : false
  const total = price * totalUnits

  const qtyOf = (c: string) => colorQty[c] ?? 1

  const colorPart =
    canPickColor && selectedColors.length > 0
      ? selectedColors.filter((c) => qtyOf(c) > 0).map((c) => `color ${c} x${qtyOf(c)}`).join(', ')
      : ''
  const qtyPart = !canPickColor && quantity > 1 ? ` x${quantity}` : ''

  const productText = `Hola! Me interesa "${name.trim()}"${colorPart ? ` ${colorPart}` : ''}${qtyPart} a $${total} UY`

  useEffect(() => {
    if (!colorOpen) return
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setColorOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [colorOpen])

  const handleWhatsApp = () => {
    if (canPickColor && selectedColors.length === 0) {
      setColorWarning(true)
      return
    }
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(productText)}`, '_blank')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col gap-3">
      {canPickColor && (
        <div className="relative" ref={colorRef}>
          <button
            onClick={() => {
              setColorOpen(!colorOpen)
              setColorWarning(false)
            }}
            aria-expanded={colorOpen}
            aria-haspopup="listbox"
            className="w-full flex items-center justify-between bg-neutral-900/80 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {selectedColors.length > 0 ? (
                <span className="flex -space-x-1.5">
                  {selectedColors.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="w-3.5 h-3.5 rounded-full border border-neutral-600 shrink-0"
                      style={{ background: COLOR_SWATCHES[c] ?? '#a8a29e' }}
                    />
                  ))}
                </span>
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-dashed border-neutral-500 shrink-0" />
              )}
              <span className="font-bold uppercase tracking-wider text-xs">
                {selectedColors.length === 0
                  ? 'Color'
                  : selectedColors.length === 1
                    ? `Color: ${selectedColors[0]}`
                    : `Colores: ${selectedColors.join(' + ')}`}
              </span>
            </span>
            <svg
              className={`w-3 h-3 text-neutral-400 transition-transform duration-300 ${colorOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {colorOpen && (
            <div
              role="listbox"
              className="absolute top-full left-0 right-0 mt-2 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl shadow-black overflow-hidden z-50 animate-dropdown-in"
            >
              {colors?.map((c) => {
                const isSelected = selectedColors.includes(c)
                return (
                  <button
                    key={c}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onToggleColor(c)
                      setColorWarning(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-white/10 text-white'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-neutral-600 shrink-0"
                      style={{ background: COLOR_SWATCHES[c] ?? '#a8a29e' }}
                    />
                    {c}
                    {isSelected && <CheckIcon className="w-4 h-4 ml-auto" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {colorWarning && (
        <p className="text-xs text-white font-bold">Elegí al menos un color para consultar</p>
      )}

      {hasStock && canPickColor && selectedColors.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Cantidad por color</span>
            <span className="text-xs font-bold text-neutral-500">
              Total: {totalUnits}
              {atMaxStock ? ` · máx ${maxQty}` : ''}
            </span>
          </div>
          {selectedColors.map((c) => {
            const q = qtyOf(c)
            return (
              <div
                key={c}
                className="flex items-center justify-between gap-3 bg-neutral-900/80 border border-neutral-700 rounded-xl px-4 py-3"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-600 shrink-0"
                    style={{ background: COLOR_SWATCHES[c] ?? '#a8a29e' }}
                  />
                  <span className="text-sm font-bold text-white truncate">{c}</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onColorQtyChange(c, Math.max(1, q - 1))}
                    disabled={q <= 1}
                    aria-label={`Disminuir cantidad de ${c}`}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-black text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-lg font-black text-white">{q}</span>
                  <button
                    onClick={() => onColorQtyChange(c, Math.min(maxQty, q + 1))}
                    disabled={atMaxStock}
                    aria-label={`Aumentar cantidad de ${c}`}
                    className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-black text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {hasStock && !canPickColor && (
        <div className="flex items-center justify-between gap-3 bg-neutral-900/80 border border-neutral-700 rounded-xl px-4 py-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Cantidad</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label="Disminuir cantidad"
              className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-black text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              −
            </button>
            <span className="w-8 text-center text-lg font-black text-white">{quantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty}
              aria-label="Aumentar cantidad"
              className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-black text-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-300 font-black py-4 px-6 rounded-xl transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Consultar por WhatsApp
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-black py-4 px-4 rounded-xl transition-all duration-300 text-xs cursor-pointer"
        >
          {copied ? '✓' : <ShareIcon className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
          stock && stock > 0 ? 'bg-white/10 text-white border border-white/30' : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${stock && stock > 0 ? 'bg-white animate-pulse' : 'bg-neutral-500'}`} />
          {stock && stock > 0 ? `Disponible · Quedan ${stock}` : 'Sin stock'}
        </span>
      </div>
    </div>
  )
}
