'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, User, LogIn } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import CartDrawer from '@/components/cart/cart-drawer'
import { useCollections } from '@/hooks/use-collections'

const STROKE = 1.25

export default function Header() {
  const { itemCount } = useCart()
  const { isLoggedIn } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: collections } = useCollections()

  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuCloseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      mobileMenuCloseRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const handleMobileMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !mobileMenuRef.current) return
    const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  const navLinks: Array<{ href: string; label: string }> = [
    { href: '/products', label: 'Catalog' },
    ...((collections?.slice(0, 3) ?? []) as Array<{
      id: string
      handle: string
      title: string
    }>).map((c) => ({
      href: `/collections/${c.handle}`,
      label: c.title,
    })),
    { href: '/about', label: 'Studio' },
  ]

  return (
    <>
      {/* Fluid Island — fixed, detached, centered glass pill */}
      <header
        className={`fixed inset-x-0 top-0 z-40 pointer-events-none transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isScrolled ? 'pt-3' : 'pt-5 sm:pt-6'
        }`}
      >
        <div className="container-custom flex justify-center">
          <div
            className={`hev-island hev-spring pointer-events-auto backdrop-blur-md rounded-full flex items-center gap-1 pl-3 pr-1.5 py-1.5 ${
              isScrolled ? 'scale-[0.97]' : 'scale-100 translate-y-10'
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 pl-1 pr-2 py-1.5 hev-spring-fast"
              prefetch
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="text-foreground"
              >
                <title>logo</title>
                <path
                  d="M12 3c2.4 2.5 2.4 6.5 0 9-2.4-2.5-2.4-6.5 0-9z"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M3 12c2.5-2.4 6.5-2.4 9 0-2.5 2.4-6.5 2.4-9 0z"
                  fill="currentColor"
                  opacity="0.55"
                />
                <path
                  d="M12 21c-2.4-2.5-2.4-6.5 0-9 2.4 2.5 2.4 6.5 0 9z"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M21 12c-2.5 2.4-6.5 2.4-9 0 2.5-2.4 6.5-2.4 9 0z"
                  fill="currentColor"
                  opacity="0.55"
                />
              </svg>
              <span className="font-heading text-[13px] font-medium tracking-tight">
                store
                <span className="text-foreground/45">/flux</span>
              </span>
            </Link>

            {/* Desktop nav — pill items */}
            <nav className="hidden lg:flex items-center gap-0.5 mx-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  className="px-3 py-1.5 text-[12.5px] text-foreground/75 hover:text-foreground rounded-full hover:bg-foreground/5 hev-spring-fast"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Nested actions pill — Button-in-Button architecture */}
            <div className="flex items-center gap-0.5 rounded-full bg-foreground/[0.04] p-0.5 ml-1">
              <Link
                href="/search"
                aria-label="Search"
                className="grid place-items-center h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-foreground/8 hev-spring-fast"
              >
                <Search className="h-[15px] w-[15px]" strokeWidth={STROKE} />
              </Link>
              <Link
                href={isLoggedIn ? '/account' : '/auth/login'}
                aria-label={isLoggedIn ? 'Account' : 'Sign in'}
                className="hidden sm:grid place-items-center h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-foreground/8 hev-spring-fast"
              >
                {isLoggedIn ? (
                  <User className="h-[15px] w-[15px]" strokeWidth={STROKE} />
                ) : (
                  <LogIn className="h-[15px] w-[15px]" strokeWidth={STROKE} />
                )}
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping bag"
                className="relative grid place-items-center h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-foreground/8 hev-spring-fast"
              >
                <ShoppingBag className="h-[15px] w-[15px]" strokeWidth={STROKE} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 grid place-items-center min-w-[16px] h-[16px] px-1 rounded-full text-[9px] font-semibold text-background"
                    style={{ background: 'hsl(var(--foreground))' }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Hamburger — morphs to X */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                className="lg:hidden grid place-items-center h-8 w-8 rounded-full text-foreground/80 hover:text-foreground hover:bg-foreground/8 hev-spring-fast"
              >
                <span className="relative block h-[10px] w-[14px]">
                  <span className="absolute left-0 top-0 h-px w-full bg-current" />
                  <span className="absolute left-0 bottom-0 h-px w-full bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────── Mobile menu — glass overlay + staggered mask reveal ─────────── */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`absolute inset-0 hev-spring ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'hsl(var(--background) / 0.78)',
            backdropFilter: 'blur(28px) saturate(160%)',
            WebkitBackdropFilter: 'blur(28px) saturate(160%)',
          }}
        />

        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          onKeyDown={handleMobileMenuKeyDown}
          className="relative h-full w-full flex flex-col"
        >
          {/* Top bar with close (hamburger → X morph) */}
          <div className="flex items-center justify-between px-5 pt-5">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading text-[13px] font-medium tracking-tight"
              prefetch
            >
              amboras<span className="text-foreground/45">/flux</span>
            </Link>
            <button
              ref={mobileMenuCloseRef}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="grid place-items-center h-10 w-10 rounded-full hover:bg-foreground/5 hev-spring-fast"
            >
              <span className="relative block h-[14px] w-[14px]">
                <span
                  className={`absolute left-0 top-1/2 h-px w-full bg-current hev-spring ${
                    isMobileMenuOpen ? 'rotate-45' : '-translate-y-[3px]'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-px w-full bg-current hev-spring ${
                    isMobileMenuOpen ? '-rotate-45' : 'translate-y-[3px]'
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Massive staggered links */}
          <nav className="flex-1 flex flex-col justify-center px-7 sm:px-12 gap-1.5 overflow-y-auto">
            {navLinks.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group block py-3 text-foreground/85 hover:text-foreground hev-spring-fast ${
                  isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${120 + i * 60}ms` : '0ms',
                  transitionDuration: '700ms',
                  transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
                  transitionProperty: 'opacity, transform',
                }}
                prefetch
              >
                <span className="font-heading text-[clamp(2rem,8vw,3.75rem)] leading-[1.05] tracking-tight">
                  {l.label.toLowerCase()}
                </span>
                <span
                  className="ml-3 inline-block text-foreground/40 text-base align-top translate-y-3 group-hover:text-foreground hev-spring-fast"
                >
                  ↗
                </span>
              </Link>
            ))}
          </nav>

          {/* Bottom utility row */}
          <div
            className={`px-7 sm:px-12 pb-8 flex items-center gap-3 text-[12px] text-foreground/65 hev-spring ${
              isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? '420ms' : '0ms' }}
          >
            <Link
              href="/search"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={STROKE} />
              Search
            </Link>
            <span className="text-foreground/20">·</span>
            <Link
              href={isLoggedIn ? '/account' : '/auth/login'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              {isLoggedIn ? (
                <User className="h-3.5 w-3.5" strokeWidth={STROKE} />
              ) : (
                <LogIn className="h-3.5 w-3.5" strokeWidth={STROKE} />
              )}
              {isLoggedIn ? 'Account' : 'Sign in'}
            </Link>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
