'use client'

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { SearchIcon } from '@/app/icons'

export default function GalleryViewer({ images, productName }: { images: string[], productName: string }) {
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]
  const [isOpen, setIsOpen] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  const openModal = useCallback(() => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimateIn(true))
    })
  }, [])

  const closeModal = useCallback(() => {
    setAnimateIn(false)
    document.body.style.overflow = ''
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setIsOpen(false), 300)
  }, [])

  const goToPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + images.length) % images.length)
  }, [images.length])

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % images.length)
  }, [images.length])

  const dragStartX = useRef(0)
  const wasDragged = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    wasDragged.current = false
    dragStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (Math.abs(dragStartX.current - e.touches[0].clientX) > 15) {
      wasDragged.current = true
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!wasDragged.current) return
    const diff = dragStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext()
      else goToPrev()
    }
  }, [goToNext, goToPrev])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    wasDragged.current = false
    dragStartX.current = e.clientX
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (e.buttons !== 1) return
    if (Math.abs(dragStartX.current - e.clientX) > 15) {
      wasDragged.current = true
    }
  }, [])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!wasDragged.current) return
    const diff = dragStartX.current - e.clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext()
      else goToPrev()
    }
  }, [goToNext, goToPrev])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, goToPrev, goToNext, closeModal])

  if (images.length === 0) {
    return (
      <div className="w-full h-80 bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-500 font-mono text-xs">
        Sin Imagen
      </div>
    )
  }

  const prevButton = images.length > 1 ? (
    <button
      onClick={(e) => { e.stopPropagation(); goToPrev() }}
      className="hidden md:flex shrink-0 bg-stone-900/80 backdrop-blur-md text-white w-11 h-11 rounded-full font-bold items-center justify-center hover:bg-orange-500 hover:text-stone-950 transition-colors cursor-pointer shadow-md text-xl"
      aria-label="Imagen anterior"
    >
      ‹
    </button>
  ) : null

  const nextButton = images.length > 1 ? (
    <button
      onClick={(e) => { e.stopPropagation(); goToNext() }}
      className="hidden md:flex shrink-0 bg-stone-900/80 backdrop-blur-md text-white w-11 h-11 rounded-full font-bold items-center justify-center hover:bg-orange-500 hover:text-stone-950 transition-colors cursor-pointer shadow-md text-xl"
      aria-label="Imagen siguiente"
    >
      ›
    </button>
  ) : null

  const modal = isOpen ? (
    <div
      onClick={() => { if (wasDragged.current) { wasDragged.current = false; return }; closeModal() }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`fixed inset-0 z-50 flex items-center justify-center gap-3 p-4 overflow-y-auto cursor-zoom-out transition-opacity duration-300 ${
        animateIn ? 'opacity-100 bg-stone-950/90 backdrop-blur-md' : 'opacity-0 bg-stone-950/0 backdrop-blur-none'
      }`}
    >
      {prevButton}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden my-auto transition-all duration-300 flex items-center justify-center ${
          animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-white w-8 h-8 rounded-full font-bold flex items-center justify-center hover:bg-orange-500 hover:text-stone-950 transition-colors z-10 cursor-pointer shadow-md"
          aria-label="Cerrar imagen ampliada"
        >
          ✕
        </button>
        <Image
          src={activeImage}
          alt={productName}
          width={1200}
          height={900}
          className="w-full h-auto max-h-[85vh] object-contain"
        />
      </div>
      {nextButton}
    </div>
  ) : null

  return (
    <div className="flex flex-col gap-4">
      <div
        onClick={() => { if (wasDragged.current) { wasDragged.current = false; return }; openModal() }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full rounded-2xl relative overflow-hidden shadow-2xl cursor-zoom-in group bg-stone-900"
      >
        <Image
          src={activeImage}
          alt={productName}
          width={1200}
          height={900}
          priority
          className="w-full h-auto max-h-[440px] md:max-h-none object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md text-stone-100 text-[10px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <span>Click para ampliar</span>
          <SearchIcon className="w-3 h-3" />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-1 min-w-0 aspect-square max-w-20 md:max-w-24 bg-neutral-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                  isActive
                    ? 'border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.5)] opacity-100'
                    : 'border-stone-700 opacity-60 hover:opacity-100 hover:border-stone-500'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
                aria-current={isActive}
              >
                <Image src={img} alt="" fill className="object-cover pointer-events-none" sizes="100px" />
              </button>
            )
          })}
        </div>
      )}

      {isClient && modal && createPortal(modal, document.body)}
    </div>
  )
}
