'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'
import { SearchIcon } from './icons'
import type { Product } from './types'

const CATEGORY_GROUPS: Record<string, string[]> = {
  Electrónica: ['electronica', 'computadoras', 'perifericos', 'accesorios', 'gaming', 'otros'],
  Cocina: ['cocina', 'hogar'],
}

const CATEGORY_FILTERS: Record<string, { label: string; keywords: string[] }[]> = {
  Electrónica: [
    { label: 'Mandos', keywords: ['mando', 'mandos', 'gamepad', 'joystick', 'control'] },
    { label: 'Auriculares', keywords: ['auricular', 'auriculares', 'headset', 'audifono'] },
    { label: 'Teclados', keywords: ['teclado', 'teclados', 'keyboard'] },
    { label: 'Cargadores', keywords: ['cargador', 'cargadores', 'charger'] },
  ],
  Cocina: [
    { label: 'Trituradoras', keywords: ['trituradora', 'triturador', 'procesadora', 'picadora'] },
    { label: 'Licuadoras', keywords: ['licuadora', 'licuadoras', 'juguera'] },
  ],
}

export default function CatalogView({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance')

  const matchesQuickFilter = (p: Product, filter: { label: string; keywords: string[] }) => {
    const text = [p.name, p.shortName].filter(Boolean).join(' ').toLowerCase()
    const words = text.split(/\s+/)
    return words.some(w => filter.keywords.includes(w))
  }

  const categories = ['Todos', ...Object.keys(CATEGORY_GROUPS)]
  const categoryFilters = CATEGORY_FILTERS[selectedCategory] ?? []

  const searchableText = (p: Product) =>
    [p.name, p.shortName, p.description, p.shortDescription, p.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

  const filteredProducts = initialProducts.filter((p) => {
    const cat = p.category?.toLowerCase() || ''
    const matchesCategory =
      selectedCategory === 'Todos' ||
      (CATEGORY_GROUPS[selectedCategory] ?? []).includes(cat)
    const matchesSearch = !searchQuery ||
      searchQuery
        .toLowerCase()
        .split(/\s+/)
        .every((word) => searchableText(p).includes(word))
    const filterDef = categoryFilters.find(f => f.label === activeFilter)
    const matchesFilter = !activeFilter || !filterDef || matchesQuickFilter(p, filterDef)
    return matchesCategory && matchesSearch && matchesFilter
  })

  if (sortBy === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price)

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 selection:bg-orange-500 selection:text-stone-950 relative">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-orange-600/10 via-amber-600/8 to-yellow-500/10 blur-[150px] pointer-events-none rounded-full" />

      <header className="sticky top-0 z-50 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-6 py-4 md:h-20 flex flex-col md:flex-row items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-2xl font-black tracking-tight text-stone-100 group-hover:text-orange-400 transition-colors">
              Artigas<span className="text-orange-500"> Shop</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 no-scrollbar relative z-10" role="tablist">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat)
                    setActiveFilter(null)
                    setFiltersOpen(false)
                  }}
                  role="tab"
                  aria-selected={isActive}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] border border-orange-400/50'
                      : 'bg-stone-900/50 text-stone-400 hover:text-stone-100 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </nav>

          {selectedCategory !== 'Todos' && categoryFilters.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                aria-expanded={filtersOpen}
                aria-haspopup="menu"
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  activeFilter
                    ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] border border-orange-400/50'
                    : 'bg-stone-900/50 text-stone-400 hover:text-stone-100 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {activeFilter || 'Filtros'}
              </button>

              {filtersOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  {categoryFilters.map((f) => {
                    const isSelected = activeFilter === f.label
                    return (
                      <button
                        key={f.label}
                        onClick={() => {
                          setActiveFilter(isSelected ? null : f.label)
                          setFiltersOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-orange-600/20 text-orange-400'
                            : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                        }`}
                      >
                        {f.label}
                        {isSelected && (
                          <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                  {activeFilter && (
                    <button
                      onClick={() => { setActiveFilter(null); setFiltersOpen(false) }}
                      className="w-full text-left px-4 py-3 text-xs text-stone-500 hover:text-stone-300 border-t border-stone-800 transition-colors"
                    >
                      Limpiar filtro
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="mb-8 flex items-baseline justify-between border-b border-stone-800/60 pb-4">
          <h2 className="text-xl font-black tracking-tight text-stone-200">
            Catálogo <span className="text-orange-400">({selectedCategory})</span>
          </h2>
          <span className="text-xs font-mono text-stone-500">
            {filteredProducts.length} producto(s)
          </span>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="relative w-full max-w-xs self-center sm:self-auto">
            <span className="sr-only">Buscar productos</span>
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar productos..."
              className="w-full bg-stone-900/80 border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'relevance' | 'price-asc' | 'price-desc')}
            aria-label="Ordenar productos"
            className="bg-stone-900/80 border border-stone-700 rounded-xl px-3 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all cursor-pointer w-auto self-center sm:self-auto sm:shrink-0"
          >
            <option value="relevance">Orden: Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-stone-500 font-mono">
            No hay productos registrados en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              const mainImg = product.image || (product.images && product.images[0])

              return (
                <div
                  key={product._id}
                  className="group relative bg-stone-900/80 backdrop-blur-sm rounded-2xl border border-stone-800 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(234,88,12,0.25)] flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[9px] font-black tracking-widest uppercase text-white bg-orange-600/90 shadow-[0_0_15px_rgba(234,88,12,0.8)] px-3 py-1.5 rounded-full backdrop-blur-md">
                      {product.category || 'General'}
                    </span>
                  </div>

                  <div className="w-full aspect-[4/3] bg-stone-900 relative overflow-hidden">
                    {mainImg ? (
                      <Image
                        src={urlFor(mainImg).url()}
                        alt={product.name}
                        fill
                        priority={index < 6}
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="text-stone-500 text-xs font-mono">Sin Imagen</div>
                    )}

                  </div>

                  <div className="p-6 flex flex-col flex-grow relative z-10">
                    <h3 className="text-lg font-black text-stone-100 group-hover:text-orange-400 transition-colors line-clamp-1">
                      {product.shortName || product.name}
                    </h3>
                    <p className="text-stone-400 text-xs mt-2 line-clamp-2 leading-relaxed font-light">
                      {product.shortDescription || product.description || 'Sin descripción disponible.'}
                    </p>

                    <div className="mt-auto pt-6 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-orange-500/80 uppercase tracking-widest font-bold mb-1">Precio</span>
                        <span className="text-2xl font-black text-stone-100 tracking-tight">${product.price}</span>
                      </div>

                      <Link
                        href={`/product/${product._id}`}
                        className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 bg-stone-950 border border-stone-700 rounded-xl hover:bg-orange-500 hover:border-orange-400 hover:text-stone-950 hover:shadow-[0_0_20px_rgba(234,88,12,0.6)] group-hover:bg-stone-800"
                      >
                        VER MÁS
                      </Link>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
