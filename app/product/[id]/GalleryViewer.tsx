'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { SearchIcon } from '@/app/icons'

export default function GalleryViewer({ images, productName }: { images: string[], productName: string }) {
  const [activeImage, setActiveImage] = useState(images[0] || '')
  const [isZoomed, setIsZoomed] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isZoomed) {
      setShowModal(true)
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true)
        })
      })
    } else {
      setAnimateIn(false)
      document.body.style.overflow = ''
      const timer = setTimeout(() => setShowModal(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isZoomed])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const goToPrev = useCallback(() => {
    setActiveImage((current) => {
      const idx = images.indexOf(current)
      const prevIdx = (idx - 1 + images.length) % images.length
      return images[prevIdx]
    })
  }, [images])

  const goToNext = useCallback(() => {
    setActiveImage((current) => {
      const idx = images.indexOf(current)
      const nextIdx = (idx + 1) % images.length
      return images[nextIdx]
    })
  }, [images])

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
    if (!isZoomed) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
      if (e.key === 'Escape') setIsZoomed(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed, goToPrev, goToNext])

  if (images.length === 0) {
    return (
      <div className="w-full h-80 bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-500 font-mono text-xs">
        Sin Imagen
      </div>
    )
  }

  const isFirstImage = activeImage === images[0]
  const isSecondImage = images.length > 1 && activeImage === images[1]
  const isLastImage = images.length > 1 && activeImage === images[images.length - 1]
  const isFourthImage = images.length > 3 && activeImage === images[3]
  const isWideImage = isSecondImage || isFourthImage || isLastImage

  const prevButton = images.length > 1 ? (
    <button
      onClick={(e) => { e.stopPropagation(); goToPrev() }}
      className="hidden md:flex shrink-0 bg-neutral-900/80 backdrop-blur-md text-white w-11 h-11 rounded-full font-bold items-center justify-center hover:bg-cyan-500 hover:text-neutral-950 transition-colors cursor-pointer shadow-md text-xl"
      aria-label="Imagen anterior"
    >
      ‹
    </button>
  ) : null

  const nextButton = images.length > 1 ? (
    <button
      onClick={(e) => { e.stopPropagation(); goToNext() }}
      className="hidden md:flex shrink-0 bg-neutral-900/80 backdrop-blur-md text-white w-11 h-11 rounded-full font-bold items-center justify-center hover:bg-cyan-500 hover:text-neutral-950 transition-colors cursor-pointer shadow-md text-xl"
      aria-label="Imagen siguiente"
    >
      ›
    </button>
  ) : null



  const modal = showModal ? (
    <div 
      onClick={(e) => { if (wasDragged.current) { wasDragged.current = false; return }; setIsZoomed(false) }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`fixed inset-0 z-50 flex items-center justify-center gap-3 p-4 overflow-y-auto cursor-zoom-out transition-opacity duration-300 ${
        animateIn ? 'opacity-100 bg-neutral-950/90 backdrop-blur-md' : 'opacity-0 bg-neutral-950/0 backdrop-blur-none'
      }`}
    >
      {prevButton}
      {isWideImage ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.3)] my-auto bg-neutral-900 transition-all duration-300 flex items-center justify-center ${
            animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <button 
            onClick={() => setIsZoomed(false)}
            className="absolute top-3 right-3 bg-neutral-900 text-white w-8 h-8 rounded-full font-bold flex items-center justify-center hover:bg-cyan-500 hover:text-neutral-950 transition-colors z-10 cursor-pointer shadow-md"
          >
            ✕
          </button>
        <Image
            src={activeImage}
            alt={productName}
            width={800}
            height={600}
            className="max-w-full max-h-[85vh] w-auto h-auto object-contain block"
          />
        </div>
      ) : (
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-2xl h-[80vh] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.3)] my-auto transition-all duration-300 flex items-center justify-center ${
            animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          } ${isFirstImage ? 'bg-white p-8' : 'bg-neutral-900'}`}
        >
          <button 
            onClick={() => setIsZoomed(false)}
            className="absolute top-3 right-3 bg-neutral-900 text-white w-8 h-8 rounded-full font-bold flex items-center justify-center hover:bg-cyan-500 hover:text-neutral-950 transition-colors z-10 cursor-pointer shadow-md"
          >
            ✕
          </button>
        <Image
            src={activeImage}
            alt={productName}
            fill
            className={isFirstImage ? 'object-contain p-8' : 'object-contain'}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      {nextButton}
    </div>
  ) : null

  return (
    <div className="flex flex-col gap-4">
      {isWideImage ? (
        <div
          onClick={(e) => { if (wasDragged.current) { wasDragged.current = false; return }; setIsZoomed(true) }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full rounded-2xl relative overflow-hidden shadow-2xl cursor-zoom-in group bg-neutral-900"
        >
          <Image
            src={activeImage}
            alt={productName}
            width={800}
            height={600}
            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-3 right-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <span>Click para ampliar</span>
            <SearchIcon className="w-3 h-3" />
          </div>
        </div>
      ) : (
        <div 
          onClick={(e) => { if (wasDragged.current) { wasDragged.current = false; return }; setIsZoomed(true) }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`w-full h-80 md:h-96 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-2xl cursor-zoom-in group ${
            isFirstImage ? 'bg-white p-8' : 'bg-neutral-900'
          }`}
        >
          <Image
            src={activeImage}
            alt={productName}
            fill
            className={`transition-transform duration-500 group-hover:scale-105 ${
              isFirstImage ? 'object-contain p-8' : 'object-cover'
            }`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute bottom-3 right-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <span>Click para ampliar</span>
            <SearchIcon className="w-3 h-3" />
          </div>
        </div>
      )}

      {images.length > 1 && (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
        >
          {images.map((img, index) => {
            const isActive = activeImage === img
            return (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`relative aspect-square bg-neutral-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                  isActive 
                    ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] opacity-100' 
                    : 'border-neutral-700 opacity-60 hover:opacity-100 hover:border-neutral-500'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover pointer-events-none" sizes="100px" />
              </button>
            )
          })}
        </div>
      )}

      {mounted && modal && createPortal(modal, document.body)}
    </div>
  )
}