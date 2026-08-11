'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { urlFor } from '@/sanity/lib/image'
import { SearchIcon, WhatsAppIcon, TruckIcon, LockIcon, CheckIcon, InstagramIcon, CartIcon } from './icons'
import { Highlight } from '@/app/product/[id]/DescriptionCard'
import { SITE } from './config'
import type { Product } from './types'

const CATEGORY_GROUPS: Record<string, string[]> = {
  Electrónica: ['electronica', 'computadoras', 'perifericos', 'accesorios', 'gaming', 'otros'],
  Cocina: ['cocina', 'hogar'],
  Belleza: ['belleza'],
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Orden: Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
] as const

const MARQUEE_ITEMS = [
  'Envíos a domicilio',
  'Pago al recibir',
  'Garantía de calidad',
  'Atención por WhatsApp',
  'Productos seleccionados',
]

const FEATURES = [
  { icon: TruckIcon, label: 'Envío a domicilio', sub: 'Recibí tu pedido en la puerta de tu casa en Artigas.' },
  { icon: LockIcon, label: 'Pago seguro', sub: 'Abonás al recibir. Sin adelantos ni sorpresas.' },
  { icon: CheckIcon, label: 'Calidad garantizada', sub: 'Productos seleccionados y verificados uno por uno.' },
]

type SortValue = typeof SORT_OPTIONS[number]['value']

type CartItem = { key: string; product: Product; qty: number; color?: string }

function categoryNameOf(p: Product): string {
  const cat = (p.category || '').toLowerCase()
  for (const [display, keys] of Object.entries(CATEGORY_GROUPS)) {
    if (keys.includes(cat)) return display
  }
  return 'Productos'
}

export default function CatalogView({
  initialProducts,
  initialCategory,
  initialQuery,
  initialSort,
}: {
  initialProducts: Product[]
  initialCategory?: string
  initialQuery?: string
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
  const [sortBy, setSortBy] = useState<SortValue>(validSort)
  const [sortOpen, setSortOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored: CartItem[] = JSON.parse(localStorage.getItem('artigas-cart') || '[]')
      return stored.map((item) => ({
        ...item,
        key: item.key || (item.color ? `${item.product._id}::${item.color}` : item.product._id),
      }))
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('artigas-cart', JSON.stringify(cart))
    } catch { /* ignore */ }
  }, [cart])

  const cartCount = cart.reduce((n, i) => n + i.qty, 0)
  const cartTotal = cart.reduce((n, i) => n + i.product.price * i.qty, 0)
  const cartItemsQty = (productId: string) =>
    cart
      .filter((i) => i.product._id === productId)
      .reduce((n, i) => n + i.qty, 0)

  const lineKey = (product: Product, color?: string) =>
    color ? `${product._id}::${color}` : product._id

  const addToCart = (product: Product) => {
    if (product.stock === 0) return
    const colors =
      product.hasColors && product.colors && product.colors.length > 0
        ? product.colors
        : []
    setCart((prev) => {
      const stock = product.stock ?? Infinity
      const totalQty = prev
        .filter((i) => i.product._id === product._id)
        .reduce((n, i) => n + i.qty, 0)
      if (totalQty >= stock) return prev
      const inCart = new Set(
        prev
          .filter((i) => i.product._id === product._id && i.color)
          .map((i) => i.color as string)
      )
      const color = colors.length
        ? colors.find((c) => !inCart.has(c)) ?? colors[0]
        : undefined
      const key = lineKey(product, color)
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { key, product, qty: 1, color }]
    })
  }

  const updateQty = (key: string, delta: number) => {
    if (delta > 0) {
      setCart((prev) => {
        const item = prev.find((i) => i.key === key)
        if (!item) return prev
        const stock = item.product.stock ?? Infinity
        const totalQty = prev
          .filter((i) => i.product._id === item.product._id)
          .reduce((n, i) => n + i.qty, 0)
        if (totalQty >= stock) return prev
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
      })
      return
    }
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    )
  }

  const removeItem = (key: string) =>
    setCart((prev) => prev.filter((i) => i.key !== key))

  const setItemColor = (key: string, color: string) =>
    setCart((prev) => {
      const current = prev.find((i) => i.key === key)
      if (!current) return prev
      const product = current.product
      const stock = product.stock ?? Infinity
      const targetKey = lineKey(product, color)
      const target = prev.find((i) => i.key === targetKey)
      if (target) {
        const totalQty = prev
          .filter((i) => i.product._id === product._id)
          .reduce((n, i) => n + i.qty, 0)
        const space = Math.max(0, stock - (totalQty - current.qty))
        const add = Math.min(current.qty, space)
        return prev
          .filter((i) => i.key !== key)
          .map((i) => (i.key === targetKey ? { ...i, qty: i.qty + add, color } : i))
      }
      return prev.map((i) =>
        i.key === key ? { ...i, color, key: targetKey } : i
      )
    })

  const sendOrder = () => {
    const lines = cart
      .map((i) => {
        const colorSuffix = i.color ? ` (${i.color})` : ''
        return `- ${i.qty}x ${(i.product.shortName || i.product.name).trim()}${colorSuffix} — $${i.product.price * i.qty}`
      })
      .join('\n')
    const msg = `Hola! Hago este pedido:\n\n${lines}\n\nTOTAL: $${cartTotal} UY`
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const sortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? SORT_OPTIONS[0].label

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
    if (sortBy !== 'relevance') params.set('orden', sortBy)
    const qs = params.toString()
    window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname)
  }, [selectedCategory, searchQuery, sortBy, pathname])

  useEffect(() => {
    if (!sortOpen) return
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (sortRef.current && !sortRef.current.contains(target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('touchstart', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, [sortOpen])

  const categories = useMemo(() => ['Todos', ...Object.keys(CATEGORY_GROUPS)], [])

  const categoryInfo = useMemo(
    () =>
      categories
        .filter((c) => c !== 'Todos')
        .map((cat) => {
          const keys = CATEGORY_GROUPS[cat]
          const items = initialProducts.filter((p) =>
            keys.includes((p.category || '').toLowerCase())
          )
          const first = items.find((p) => p.image || p.mainImage)
          return {
            name: cat,
            count: items.length,
            image: first ? (first.image || first.mainImage) : null,
          }
        })
        .filter((c) => c.count > 0),
    [initialProducts, categories]
  )

  const featuredProducts = useMemo(
    () => initialProducts.filter((p) => p.featured),
    [initialProducts]
  )

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
      return matchesCategory && matchesSearch
    })
    if (sortBy === 'price-asc') matches.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-desc') matches.sort((a, b) => b.price - a.price)
    return matches
  }, [initialProducts, selectedCategory, searchQuery, sortBy])

  const filterSignature = `${selectedCategory}|${sortBy}`

  const renderProductCard = (product: Product, index: number) => {
    const mainImg = product.image || product.mainImage
    const discount = product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100)
      : null

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
        className="group relative min-w-0 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-white/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,1)] flex flex-col cursor-pointer animate-fade-up"
      >
        <div className="relative aspect-square bg-neutral-950 overflow-hidden">
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
            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 text-xs font-mono">Sin Imagen</div>
          )}

          {discount && (
            <span className="absolute top-3 left-3 z-10 text-[9px] font-black tracking-widest uppercase text-black bg-white px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <span className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border backdrop-blur-md ${
            product.stock === 0
              ? 'text-neutral-400 border-neutral-800 bg-black/60'
              : 'text-white border-neutral-600 bg-black/60'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${product.stock === 0 ? 'bg-neutral-500' : 'bg-white animate-pulse'}`} />
            {product.stock === 0 ? 'Agotado' : 'Stock'}
          </span>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-500">
            {categoryNameOf(product)}
          </span>
          <h3 className="mt-1.5 text-sm font-bold text-white leading-snug line-clamp-2">
            <Highlight text={product.shortName || product.name} />
          </h3>

          <div className="mt-auto pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white tracking-tight">${product.price}</span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-sm font-bold text-neutral-500 line-through">${product.oldPrice}</span>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  addToCart(product)
                }}
                disabled={product.stock === 0}
                aria-label={`Agregar ${product.shortName || product.name} al carrito`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-300 font-bold py-2.5 px-4 rounded-xl transition-all duration-300 uppercase tracking-wider text-[11px] cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                <CartIcon className="w-4 h-4" />
                {product.stock === 0 ? 'Agotado' : 'Agregar'}
              </button>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hola! Me interesa "${(product.shortName || product.name).trim()}" a $${product.price} UY`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Consultar ${product.shortName || product.name} por WhatsApp`}
                className="inline-flex items-center justify-center bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700 font-bold w-11 py-2.5 rounded-xl transition-all duration-300 cursor-pointer active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">

      <div className="bg-white text-black text-center text-[10px] font-bold uppercase tracking-[0.3em] py-2 px-4">
        Envíos a domicilio en Artigas · Abonás al recibir
      </div>

      <header className="sticky top-0 z-50">
        <div className={`border-b transition-all duration-300 ${scrolled ? 'border-neutral-800 bg-black/95 backdrop-blur-xl' : 'border-neutral-900 bg-black/85 backdrop-blur-xl'}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="h-16 md:h-20 flex items-center justify-between gap-4 relative">

              <Link href="/" className="flex items-center gap-3 group shrink-0 animate-float-soft">
                <span className="h-9 w-9 md:h-11 md:w-11 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-black/20">
                  <Image src="/logo.jpg" alt="Artigas Shop" width={44} height={44} className="object-contain w-full h-full" priority />
                </span>
                <span className="hidden sm:block text-lg md:text-xl font-black tracking-tight text-white">
                  ARTIGAS<span className="text-neutral-600 text-[0.88em] ml-1.5">SHOP</span>
                </span>
              </Link>

              <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto max-w-full no-scrollbar relative z-10" role="tablist">
                {categories.map((cat) => {
                  const isActive = selectedCategory.toLowerCase() === cat.toLowerCase()
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      role="tab"
                      aria-selected={isActive}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap border ${
                        isActive
                          ? 'text-black bg-white border-white'
                          : 'text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-500'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <section className="relative border-b border-neutral-900 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-10 right-0 select-none pointer-events-none text-[220px] md:text-[380px] font-black leading-none text-neutral-950 tracking-tight animate-drift"
        >
          SHOP
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-14 md:pb-20 relative z-10">
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05] animate-float">
            TU TIENDA DE
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">CONFIANZA</span>
            <br />
            EN UN SOLO LUGAR
          </h1>
          <p className="mt-6 text-neutral-400 text-sm md:text-lg max-w-xl leading-relaxed font-light">
            Tecnología, cocina, belleza y más. Productos seleccionados con los mejores precios,
            hacé tu pedido directo por WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#catalogo"
              className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-black py-3.5 px-8 rounded-full transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
              Ver catálogo
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hola! Quiero consultar por un producto de Artigas Shop')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-neutral-700 hover:border-white font-black py-3.5 px-8 rounded-full transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
          <div className="grid grid-cols-3 max-w-md mt-12 border-t border-neutral-900 pt-6 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-black">{initialProducts.length}+</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-500">Productos</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-black">{categoryInfo.length}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-500">Categorías</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl md:text-3xl font-black">100%</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-500">Envío local</span>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-neutral-900 overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[0, 1].map((dup) => (
            <span
              key={dup}
              className="flex text-[10px] font-black uppercase tracking-[0.35em] text-neutral-600"
            >
              {MARQUEE_ITEMS.map((item) => (
                <span key={`${dup}-${item}`} className="flex items-center">
                  <span className="mx-6">{item}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {categoryInfo.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-500">Categorías</span>
              <h2 className="mt-2 text-2xl md:text-4xl font-black tracking-tight animate-float">EXPLORÁ LA TIENDA</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categoryInfo.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name)
                  const el = document.getElementById('catalogo')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group relative h-56 md:h-64 rounded-2xl overflow-hidden border border-neutral-800 text-left cursor-pointer"
              >
                {cat.image && (
                  <Image
                    src={urlFor(cat.image).width(700).auto('format').url()}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                      {cat.count} {cat.count === 1 ? 'producto' : 'productos'}
                    </span>
                    <h3 className="mt-1 text-xl md:text-2xl font-black text-white">{cat.name}</h3>
                  </div>
                  <span className="w-10 h-10 shrink-0 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="relative max-w-7xl mx-auto px-6 pb-14 md:pb-20 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -top-10 md:-top-6 right-0 select-none pointer-events-none text-[140px] md:text-[240px] font-black leading-none text-neutral-950 tracking-tight animate-drift"
          >
            SHOP
          </div>
          <div className="flex items-end justify-between mb-8 md:mb-10 relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-500">Destacados</span>
              <h2 className="mt-2 text-2xl md:text-4xl font-black tracking-tight animate-float">LO MÁS PEDIDO</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.slice(0, 8).map((product, index) => renderProductCard(product, index))}
          </div>
        </section>
      )}

      <section id="catalogo" className="max-w-7xl mx-auto px-6 pb-20 scroll-mt-24">
        <div className="flex items-end justify-between border-b border-neutral-900 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-500">Catálogo completo</span>
            <h2 className="mt-2 text-2xl md:text-4xl font-black tracking-tight">
              {selectedCategory === 'Todos' ? 'TODOS LOS PRODUCTOS' : selectedCategory.toUpperCase()}
            </h2>
          </div>
          <span className="text-xs font-bold text-neutral-500">{filteredProducts.length} resultados</span>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="relative w-full max-w-sm self-center sm:self-auto">
            <span className="sr-only">Buscar productos</span>
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscá un producto..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
            />
          </label>
          <div className="relative self-center sm:self-auto sm:shrink-0" ref={sortRef}>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
              className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl pl-3 pr-2.5 py-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all cursor-pointer"
            >
              <span className="whitespace-nowrap">{sortLabel}</span>
              <svg
                className={`w-3 h-3 text-neutral-400 transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`}
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
                className="absolute top-full right-0 mt-2 w-60 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl shadow-black overflow-hidden z-50 animate-dropdown-in"
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
                          ? 'bg-white/10 text-white'
                          : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      {opt.label}
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
              <SearchIcon className="w-7 h-7 text-neutral-500" />
            </div>
            <h3 className="text-lg font-black text-white">
              {searchQuery
                ? <>No encontramos nada para <span className="text-neutral-500">&ldquo;{searchQuery}&rdquo;</span></>
                : 'No hay productos en esta categoría'}
            </h3>
            <p className="text-neutral-500 text-sm mt-2 max-w-sm leading-relaxed">
              {searchQuery
                ? 'Probá con otra palabra o revisá otra categoría.'
                : 'Probá con otra categoría o buscá por nombre.'}
            </p>
            {(searchQuery || selectedCategory !== 'Todos') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('Todos')
                }}
                className="mt-6 inline-flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-white hover:text-white text-neutral-200 font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div key={filterSignature} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => renderProductCard(product, index))}
          </div>
        )}
      </section>

      <section className="bg-white text-black">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-500">Por qué elegirnos</span>
              <h2 className="mt-2 text-2xl md:text-4xl font-black tracking-tight">COMPRÁ TRANQUILO</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-4 bg-neutral-100 hover:bg-neutral-200 rounded-2xl p-6 md:p-8 transition-colors"
              >
                <span className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shrink-0" aria-hidden="true">
                  <f.icon className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-black text-lg tracking-tight">{f.label}</h3>
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            ¿TENÉS ALGUNA DUDA?
          </h2>
          <p className="mt-4 text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Escribinos por WhatsApp y te respondemos al toque. También podés seguirnos en Instagram
            para enterarte de las novedades.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hola! Quiero consultar por un producto de Artigas Shop')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-black py-4 px-8 rounded-full transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white border border-neutral-700 hover:border-white font-black py-4 px-8 rounded-full transition-all duration-300 uppercase tracking-wider text-xs cursor-pointer hover:-translate-y-0.5 active:scale-95"
            >
              <InstagramIcon className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>
      </section>

      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 z-50 w-[calc(100%-5rem)] max-w-[400px]">
          {cartOpen && (
            <div className="mb-3 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl shadow-black overflow-hidden animate-dropdown-in">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <span className="font-black text-sm uppercase tracking-wider">Tu pedido</span>
                <button onClick={() => setCart([])} className="text-xs font-bold text-neutral-500 hover:text-white cursor-pointer">
                  Vaciar
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-neutral-900">
                {cart.map((i) => (
                  <div key={i.key} className="flex items-center gap-3 p-3">
                    {i.product.image ? (
                      <Image
                        src={urlFor(i.product.image).width(80).auto('format').url()}
                        alt={i.product.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover w-10 h-10 bg-neutral-900"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-[8px] text-neutral-600">img</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{i.product.shortName || i.product.name}</p>
                      <p className="text-xs text-neutral-500">${i.product.price} c/u</p>
                      {i.product.hasColors && i.product.colors && i.product.colors.length > 0 && (
                        <select
                          value={i.color || i.product.colors[0]}
                          onChange={(e) => setItemColor(i.key, e.target.value)}
                          className="mt-1 w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-white cursor-pointer"
                          aria-label={`Color de ${i.product.shortName || i.product.name}`}
                        >
                          {i.product.colors.map((c) => (
                            <option key={c} value={c} className="bg-black">{c}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => updateQty(i.key, -1)} className="w-6 h-6 rounded border border-neutral-700 text-neutral-300 hover:border-white cursor-pointer">−</button>
                      <span className="w-5 text-center text-sm font-bold">{i.qty}</span>
                      <button
                        onClick={() => updateQty(i.key, 1)}
                        disabled={i.product.stock !== undefined && i.product.stock <= cartItemsQty(i.product._id)}
                        className="w-6 h-6 rounded border border-neutral-700 text-neutral-300 hover:border-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >+</button>
                    </div>
                    <button onClick={() => removeItem(i.key)} className="text-neutral-600 hover:text-white text-lg leading-none cursor-pointer" aria-label="Quitar">×</button>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total</span>
                  <span className="text-xl font-black">${cartTotal}</span>
                </div>
                <button
                  onClick={sendOrder}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 font-black py-3 rounded-xl uppercase tracking-wider text-xs cursor-pointer active:scale-95"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Enviar pedido por WhatsApp
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="w-full flex items-center justify-between gap-3 bg-white text-black rounded-2xl px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2 font-black uppercase tracking-wider text-xs">
              <CartIcon className="w-5 h-5" />
              {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
            </span>
            <span className="font-black">${cartTotal}</span>
          </button>
        </div>
      )}

      <a
        href={SITE.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Seguinos en Instagram"
        className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-white text-black hover:bg-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <InstagramIcon className="w-6 h-6" />
      </a>
    </main>
  )
}
