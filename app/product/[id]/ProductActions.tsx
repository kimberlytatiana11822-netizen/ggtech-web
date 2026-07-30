'use client'

import { useState } from 'react'
import { WhatsAppIcon, ShareIcon } from '@/app/icons'

export default function ProductActions({ name, price, stock }: { name: string; price: number; stock?: number }) {
  const [copied, setCopied] = useState(false)

  const productText = `Hola! Me interesa "${name}" a $${price} UY`

  const handleWhatsApp = () => {
    window.open(`https://wa.me/598?text=${encodeURIComponent(productText)}`, '_blank')
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
          className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-black py-4 px-4 rounded-xl transition-all duration-300 text-xs cursor-pointer"
        >
          {copied ? '✓' : <ShareIcon className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className={`w-2 h-2 rounded-full ${stock && stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-neutral-400 font-bold uppercase tracking-wider">
          {stock && stock > 0 ? `Quedan ${stock}` : 'Sin stock'}
        </span>
      </div>
    </div>
  )
}
