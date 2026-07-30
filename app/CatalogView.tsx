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

const QUICK_FILTERS = [
  { label: 'Mandos', keywords: ['mando', 'control', 'gamepad', 'joystick'] },
  { label: 'Auriculares', keywords: ['auricular', 'headset', 'audifono', 'cascos'] },
  { label: 'Teclados', keywords: ['teclado', 'keyboard'] },
  { label: 'Cargadores', keywords: ['cargador', 'carga', 'charger', 'cable'] },
]

export default function CatalogView({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const matchesQuickFilter = (p: Product, filter: typeof QUICK_FILTERS[number]) => {
    const text = [p.name, p.shortName, p.description, p.shortDescription]
      .filter(Boolean).join(' ').toLowerCase()
    return filter.keywords.some(k => text.includes(k))
  }

  const categories = ['Todos', 'Electrónica', 'Cocina']

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
    const filterDef = QUICK_FILTERS.find(f => f.label === activeFilter)
    const matchesFilter = !activeFilter || !filterDef || matchesQuickFilter(p, filterDef)
    return matchesCategory && matchesSearch && matchesFilter
  })

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-cyan-500 selection:text-black relative">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-cyan-400/15 blur-[150px] pointer-events-none rounded-full" />

      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-6 py-4 md:h-20 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              GG<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400">TECH</span>
            </span>
          </Link>

          <nav className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 no-scrollbar relative z-10" role="tablist">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  role="tab"
                  aria-selected={isActive}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50'
                      : 'bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </nav>

          <div className="relative">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter
                  ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] border border-cyan-400/50'
                  : 'bg-neutral-900/50 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {activeFilter || 'Filtros'}
            </button>

            {filtersOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                {QUICK_FILTERS.map((f) => {
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
                        ? 'bg-cyan-600/20 text-cyan-400'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {f.label}
                    {isSelected && (
                      <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )})
                {activeFilter && (
                  <button
                    onClick={() => { setActiveFilter(null); setFiltersOpen(false) }}
                    className="w-full text-left px-4 py-3 text-xs text-neutral-500 hover:text-neutral-300 border-t border-neutral-800 transition-colors"
                  >
                    Limpiar filtro
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="mb-8 flex items-baseline justify-between border-b border-neutral-800/60 pb-4">
          <h2 className="text-xl font-black tracking-tight text-neutral-200">
            Catálogo <span className="text-cyan-400">({selectedCategory})</span>
          </h2>
          <span className="text-xs font-mono text-neutral-500">
            {filteredProducts.length} producto(s)
          </span>
        </div>

        <div className="relative max-w-xs mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar productos..."
            className="w-full bg-neutral-900/80 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 font-mono">
            No hay productos registrados en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const mainImg = product.image || (product.images && product.images[0])

              return (
                <div 
                  key={product._id} 
                  className="group relative bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-800 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.3)] flex flex-col justify-between overflow-hidden"
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[9px] font-black tracking-widest uppercase text-white bg-cyan-600/90 shadow-[0_0_15px_rgba(8,145,178,0.8)] px-3 py-1.5 rounded-full backdrop-blur-md">
                      {product.category || 'General'}
                    </span>
                  </div>

                  <div className="w-full aspect-[4/3] bg-neutral-900 relative overflow-hidden">
                    {mainImg ? (
                      <Image
                        src={urlFor(mainImg).url()}
                        alt={product.name}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="text-neutral-500 text-xs font-mono">Sin Imagen</div>
                    )}
                    
                  </div>

                  <div className="p-6 flex flex-col flex-grow relative z-10">
                    <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                      {product.shortName || product.name}
                    </h3>
                    <p className="text-neutral-400 text-xs mt-2 line-clamp-2 leading-relaxed font-light">
                      {product.shortDescription || product.description || 'Sin descripción disponible.'}
                    </p>

                    <div className="mt-auto pt-6 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-cyan-500/80 uppercase tracking-widest font-bold mb-1">Precio</span>
                        <span className="text-2xl font-black text-white tracking-tight">${product.price}</span>
                      </div>

                      <Link 
                        href={`/product/${product._id}`}
                        className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 bg-neutral-950 border border-neutral-700 rounded-xl hover:bg-cyan-500 hover:border-cyan-400 hover:text-neutral-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] group-hover:bg-neutral-800"
                      >
                        VER MÁS
                      </Link>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}