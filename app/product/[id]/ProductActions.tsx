'use client'

import { useEffect, useRef, useState } from 'react'
import { WhatsAppIcon, ShareIcon } from '@/app/icons'
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
}: {
  name: string
  price: number
  stock?: number
  hasColors?: boolean
  colors?: string[]
}) {
  const [copied, setCopied] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [colorOpen, setColorOpen] = useState(false)
  const [colorWarning, setColorWarning] = useState(false)
  const colorRef = useRef<HTMLDivElement>(null)

  const canPickColor = hasColors && !!colors && colors.length > 0

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

  const productText = canPickColor && selectedColor
    ? `Hola! Me interesa "${name.trim()}" color ${selectedColor} a $${price} UY`
    : `Hola! Me interesa "${name.trim()}" a $${price} UY`

  const handleWhatsApp = () => {
    if (canPickColor && !selectedColor) {
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
    <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col gap-3">
      {canPickColor && (
        <div className="relative" ref={colorRef}>
          <button
            onClick={() => {
              setColorOpen(!colorOpen)
              setColorWarning(false)
            }}
            aria-expanded={colorOpen}
            aria-haspopup="listbox"
            className="w-full flex items-center justify-between bg-stone-900/80 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {selectedColor ? (
                <span
                  className="w-3.5 h-3.5 rounded-full border border-stone-600 shrink-0"
                  style={{ background: COLOR_SWATCHES[selectedColor] ?? '#a8a29e' }}
                />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-dashed border-stone-500 shrink-0" />
              )}
              <span className="font-bold uppercase tracking-wider text-xs">
                {selectedColor ? `Color: ${selectedColor}` : 'Color'}
              </span>
            </span>
            <svg
              className={`w-3 h-3 text-stone-400 transition-transform duration-300 ${colorOpen ? 'rotate-180' : ''}`}
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
              className="absolute top-full left-0 right-0 mt-2 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-dropdown-in"
            >
              {colors?.map((c) => {
                const isSelected = selectedColor === c
                return (
                  <button
                    key={c}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedColor(c)
                      setColorOpen(false)
                      setColorWarning(false)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-orange-600/20 text-orange-400'
                        : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-600 shrink-0"
                      style={{ background: COLOR_SWATCHES[c] ?? '#a8a29e' }}
                    />
                    {c}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {colorWarning && (
        <p className="text-xs text-red-400 font-bold">Elegí un color para consultar</p>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Consultar por WhatsApp
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-100 font-black py-4 px-4 rounded-xl transition-all duration-300 text-xs cursor-pointer"
        >
          {copied ? '✓' : <ShareIcon className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={`w-2 h-2 rounded-full ${stock && stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-stone-400 font-bold uppercase tracking-wider">
          {stock && stock > 0 ? `Quedan ${stock}` : 'Sin stock'}
        </span>
      </div>
    </div>
  )
}
