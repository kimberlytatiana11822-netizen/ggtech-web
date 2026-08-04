'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { urlFor } from '@/sanity/lib/image'
import { SearchIcon, WhatsAppIcon, TruckIcon, LockIcon, CheckIcon, InstagramIcon } from './icons'
import { Highlight } from '@/app/product/[id]/DescriptionCard'
import { SITE } from './config'
import type { Product } from './types'

const CATEGORY_GROUPS: Record<string, string[]> = {
  Electrónica: ['electronica', 'computadoras', 'perifericos', 'accesorios', 'gaming', 'otros'],
  Cocina: ['cocina', 'hogar'],
  Belleza: ['belleza'],
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

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Orden: Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
] as const

function ExpandableDescription({ text }: { text: string }) {
  return (
    <div className="mt-3 w-full">
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        <CheckIcon className="w-3 h-3 text-sky-400" />
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-stone-500">Características</span>
      </div>
      <div className="flex items-center justify-center w-fit mx-auto max-w-full h-[52px] md:h-[62px]">
        <p className="text-stone-300 text-[11px] md:text-[13px] leading-relaxed font-normal text-center break-words line-clamp-3">
          <Highlight text={text} />
        </p>
      </div>
    </div>
  )
}

const MemoizedExpandableDescription = memo(ExpandableDescription)

type SortValue = typeof SORT_OPTIONS[number]['value']

export default function CatalogView({
  initialProducts,
  initialCategory,
  initialQuery,
  initialFilter,
  initialSort,
}: {
  initialProducts: Product[]
  initialCategory?: string
  initialQuery?: string
  initialFilter?: string
  initialSort?: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  const validCategory = initialCategory && Object.keys(CATEGORY_GROUPS).includes(initialCategory)
    ? initialCategory
    : 'Todos'
  const validSort = SORT_OPTIONS.some((o) => o.value === initialSort) ? initialSort as SortValue : 'relevance'

  const [selectedCategory, setSelectedCategory] = useState<string>(validCategory)
  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '')
  const [activeFilter, setActiveFilter] = useState<string | null>(initialFilter ?? null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortValue>(validSort)
  const [sortOpen, setSortOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? SORT_OPTIONS[0].label

  const filtersRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory !== 'Todos') params.set('categoria', selectedCategory)
    if (searchQuery) params.set('q', searchQuery)
    if (activeFilter) params.set('filtro', activeFilter)
    if (sortBy !== 'relevance') params.set('orden', sortBy)
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname)
  }, [selectedCategory, searchQuery, activeFilter, sortBy, pathname])

  useEffect(() => {
    if (!filtersOpen && !sortOpen) return
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (filtersRef.current && !filtersRef.current.contains(target)) setFiltersOpen(false)
      if (sortRef.current && !sortRef.current.contains(target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [filtersOpen, sortOpen])

  const matchesQuickFilter = (p: Product, filter: { label: string; keywords: string[] }) => {
    const text = [p.name, p.shortName].filter(Boolean).join(' ').toLowerCase()
    const words = text.split(/\s+/)
    return words.some(w => filter.keywords.includes(w))
  }

  const categories = ['Todos', ...Object.keys(CATEGORY_GROUPS)]
  const categoryFilters = useMemo(
    () => CATEGORY_FILTERS[selectedCategory] ?? [],
    [selectedCategory]
  )
  const showFilters = selectedCategory !== 'Todos' && categoryFilters.length > 0

  const searchableText = (p: Product) =>
    [p.name, p.shortName, p.description, p.shortDescription, p.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

  const filteredProducts = useMemo(() => {
    const matches = initialProducts.filter((p) => {
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
    if (sortBy === 'price-asc') matches.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') matches.sort((a, b) => b.price - a.price)
    return matches
  }, [initialProducts, selectedCategory, searchQuery, activeFilter, categoryFilters, sortBy])

  const filterSignature = `${selectedCategory}|${activeFilter}|${sortBy}`

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 selection:bg-sky-500 selection:text-stone-950 relative overflow-x-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-tr from-sky-600/20 via-indigo-600/10 to-fuchsia-500/10 blur-[150px] pointer-events-none rounded-full animate-orbit" />

      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-0 -right-32 w-[32rem] h-[32rem] bg-fuchsia-600/10 rounded-full blur-[130px] pointer-events-none animate-float" />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(148,163,184,0.14)_1px,transparent_1px)] [background-size:22px_22px]" />

      <header className="sticky top-0 z-50">
        <div className={`rounded-b-2xl border-b transition-all duration-300 relative ${scrolled ? 'border-sky-500/30 bg-stone-950/90 backdrop-blur-xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)]' : 'border-stone-800/80 bg-stone-950/80 backdrop-blur-xl'}`}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-600/5 via-transparent to-fuchsia-600/5 rounded-b-2xl" />
          <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="px-3 pt-2 pb-1.5 md:h-16 md:px-6 md:py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 transition-all duration-300 relative">

          <Link href="/" className="flex items-center gap-2 group shrink-0 relative">
            <span className="text-lg md:text-2xl font-black tracking-tight text-stone-100 group-hover:text-orange-400 transition-colors">
              Artigas<span className="text-orange-500"> Shop</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1.5 md:gap-2 overflow-x-auto max-w-full md:pb-0 no-scrollbar relative z-10 md:pr-40" role="tablist">
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
                  className={`px-2.5 py-0.5 md:px-4 md:py-2 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap border ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-sky-600 to-sky-500 border-sky-400/60 shadow-[0_0_20px_-4px_rgba(56,189,248,0.8)]'
                      : 'text-stone-400 border-transparent hover:text-sky-300 hover:border-sky-500/40 hover:bg-sky-500/10'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </nav>

          <div className="relative w-full md:w-auto md:absolute md:right-4 md:top-1/2 md:-translate-y-1/2 z-20" ref={filtersRef}>
            <div className={`grid transition-all duration-300 ease-out ${showFilters ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="relative overflow-hidden">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  aria-expanded={filtersOpen}
                  aria-haspopup="menu"
                  aria-hidden={!showFilters}
                  tabIndex={showFilters ? 0 : -1}
                  className={`flex items-center gap-1.5 whitespace-nowrap w-full md:w-auto justify-center max-w-[10rem] transition-all duration-300 ease-out will-change-transform ${
                    showFilters
                      ? `opacity-100 translate-y-0 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                          activeFilter
                            ? 'bg-sky-600 text-white shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-orange-400/50'
                            : 'bg-stone-900/50 text-stone-400 hover:text-stone-100 hover:bg-stone-800 border border-stone-800'
                        }`
                      : 'opacity-0 translate-y-2 px-4 py-0 border-transparent'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="shrink-0 min-w-0 truncate">{activeFilter || 'Filtros'}</span>
                </button>
              </div>
            </div>

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
                          ? 'bg-sky-600/20 text-sky-400'
                          : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                      }`}
                    >
                      {f.label}
                      {isSelected && (
                        <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
        </div>
        </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-8 relative z-10 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_70%)]" />
        <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-500/10 border border-sky-500/30 px-4 py-1.5 rounded-full relative">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          Tienda en <span className="text-white">Artigas, Uruguay</span>
        </span>
        <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-stone-100 leading-tight">
          Encontrá todo lo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-fuchsia-400">necesitás</span>
        </h1>
        <p className="mt-5 text-stone-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-light">
          Tecnología, cocina, belleza y más. Productos seleccionados con los mejores precios, hacé tu pedido directo por WhatsApp.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hola! Quiero consultar por un producto de Artigas Shop')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black py-3.5 px-7 rounded-xl transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer hover:shadow-[0_0_25px_rgba(22,163,74,0.5)] hover:-translate-y-0.5 active:scale-95"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Consultar por WhatsApp
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: TruckIcon, label: 'Envío', sub: 'a domicilio' },
            { icon: LockIcon, label: 'Pago seguro', sub: 'abonás al recibir' },
            { icon: CheckIcon, label: 'Garantía', sub: 'calidad garantizada' },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-3 bg-stone-900/70 backdrop-blur-sm border border-stone-800 rounded-2xl py-4 px-5 hover:border-sky-500/40 hover:bg-stone-900 transition-all duration-300">
              <span className="text-sky-400 shrink-0" aria-hidden="true">
                <b.icon className="w-6 h-6" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-100">{b.label}</span>
                <span className="text-xs text-stone-500">{b.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="mb-8 flex items-center justify-between border-b border-stone-800/60 pb-4">
          <h2 className="flex items-center gap-3 text-xl font-black tracking-tight text-stone-200">
            Catálogo <span className="text-sky-400">{selectedCategory === 'Todos' ? '' : `(${selectedCategory})`}</span>
            <span className="text-xs font-black tracking-widest text-white bg-sky-600 shadow-[0_0_15px_rgba(255,255,255,0.6)] px-3 py-1.5 rounded-full">
              {filteredProducts.length}
            </span>
          </h2>
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
              className="w-full bg-stone-900/80 border border-stone-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/20 transition-all"
            />
          </label>
          <div className="relative self-center sm:self-auto sm:shrink-0" ref={sortRef}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-1.5 bg-stone-900/80 border border-stone-700 rounded-xl pl-3 pr-2.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/20 transition-all cursor-pointer"
            >
              <span className="whitespace-nowrap">{sortLabel}</span>
              <svg
                className={`w-3 h-3 text-stone-400 transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {sortOpen && (
              <div
                role="listbox"
                className="absolute top-full right-0 mt-2 w-60 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-dropdown-in"
              >
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortBy === opt.value
                  return (
                    <button
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortBy(opt.value)
                        setSortOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-sky-600/20 text-sky-400'
                          : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
                      }`}
                    >
                      {opt.label}
                      {isSelected && (
                        <svg className="w-4 h-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mb-5">
              <SearchIcon className="w-7 h-7 text-stone-500" />
            </div>
            <h3 className="text-lg font-black text-stone-200">
              {searchQuery
                ? <>No encontramos nada para <span className="text-sky-400">&ldquo;{searchQuery}&rdquo;</span></>
                : 'No hay productos en esta categoría'}
            </h3>
            <p className="text-stone-500 text-sm mt-2 max-w-sm leading-relaxed">
              {searchQuery
                ? 'Probá con otra palabra o revisá otra categoría.'
                : 'Probá con otra categoría o buscá por nombre.'}
            </p>
            {(searchQuery || activeFilter || selectedCategory !== 'Todos') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveFilter(null)
                  setSelectedCategory('Todos')
                }}
                className="mt-6 inline-flex items-center justify-center gap-2 bg-stone-900 border border-stone-700 hover:border-orange-500/50 hover:text-sky-400 text-stone-200 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div key={filterSignature} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => {
              const mainImg = product.image || product.mainImage

              return (
                <div
                  key={product._id}
                  style={{ animationDelay: `${Math.min(index, 9) * 25}ms` }}
                  onClick={() => router.push(`/product/${product._id}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      router.push(`/product/${product._id}`)
                    }
                  }}
                  className="group relative min-w-0 bg-gradient-to-b from-stone-900/95 to-stone-900/70 backdrop-blur-sm rounded-2xl border border-stone-800/60 hover:border-sky-500/60 hover:ring-1 hover:ring-sky-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.5),0_0_60px_-10px_rgba(56,189,248,0.3)] flex flex-col justify-between overflow-hidden animate-fade-up cursor-pointer"
                >
                  <div className="relative p-3 pb-0 flex flex-col gap-3">
                    {product.oldPrice && product.oldPrice > product.price && (
                      <div className="absolute top-9 left-2 z-10">
                        <span className="text-[9px] font-black tracking-widest uppercase text-white bg-red-600/90 shadow-[0_0_15px_rgba(220,38,38,0.8)] px-3 py-1.5 rounded-full backdrop-blur-md">
                          OFERTA -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                        </span>
                      </div>
                    )}

                    <div className="w-full aspect-square bg-stone-900 relative overflow-hidden rounded-2xl border border-stone-800/60 shadow-lg">
                      {mainImg ? (
                        <Image
                          src={urlFor(mainImg).width(500).auto('format').url()}
                          alt={product.name}
                          fill
                          priority={index < 6}
                          className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="text-stone-500 text-xs font-mono">Sin Imagen</div>
                      )}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[450%] transition-transform duration-[900ms] ease-out pointer-events-none" />
                    </div>

                    {typeof product.stock === 'number' && (
                      <div className="absolute top-0 left-2 z-10">
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase text-white bg-green-600/95 shadow-[0_0_12px_rgba(34,197,94,0.4)] px-2 py-1 rounded-full backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Disponible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase text-white bg-red-600/95 shadow-[0_0_12px_rgba(220,38,38,0.6)] px-2 py-1 rounded-full backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                            Sin stock
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex flex-col flex-grow relative z-10">
                    <h3 className="flex justify-center text-sm md:text-base font-black text-stone-100 group-hover:text-sky-400 transition-colors">
                      <span className="min-w-0 max-w-full text-left overflow-hidden text-ellipsis whitespace-nowrap">
                        <Highlight text={product.shortName || product.name} />
                      </span>
                    </h3>

                    <div className="mt-auto pt-3 flex flex-col gap-2">
                      <div className="flex items-baseline gap-2 justify-center">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 tracking-tight">${product.price}</span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-sm font-bold text-stone-500 line-through">${product.oldPrice}</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <a
                          href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hola! Me interesa "${(product.shortName || product.name).trim()}" a $${product.price} UY`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Consultar ${product.shortName || product.name} por WhatsApp`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black py-2.5 px-4 rounded-xl transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer hover:shadow-[0_0_20px_rgba(34,197,94,0.35)] hover:-translate-y-0.5 active:scale-95"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                          Consultar
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-600 to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <a
        href={SITE.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Seguinos en Instagram"
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-fuchsia-600 via-rose-500 to-amber-400 hover:from-fuchsia-500 hover:via-rose-400 hover:to-amber-300 text-white shadow-[0_8px_30px_rgba(217,70,239,0.4)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <InstagramIcon className="w-7 h-7" />
      </a>
    </main>
  )
}
