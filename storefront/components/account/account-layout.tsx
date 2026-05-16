'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  Package,
  MapPin,
  User,
  LogOut,
  Loader2,
  ChevronRight,
  LayoutGrid,
} from 'lucide-react'
import { Cormorant_Garamond } from 'next/font/google'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

const navItems = [
  { href: '/account', label: 'Overview', icon: LayoutGrid },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/profile', label: 'Profile', icon: User },
]

const STROKE = 1.25

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { customer, isLoggedIn, isLoading, logout, isLoggingOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isLoggedIn, router, pathname])

  if (isLoading) {
    return (
      <div className={`${editorial.variable} pt-28 sm:pt-32 lg:pt-36 pb-28`}>
        <div className="container-custom flex flex-col items-center justify-center gap-4">
          <div className="hev-shell rounded-full p-[5px]">
            <div className="hev-core h-11 w-11 rounded-full grid place-items-center">
              <Loader2 className="h-4 w-4 animate-spin text-foreground/70" strokeWidth={STROKE} />
            </div>
          </div>
          <p className="font-editorial italic text-foreground/65 text-base">
            Loading the studio account…
          </p>
        </div>
      </div>
    )
  }

  if (!customer) return null

  const activeLabel =
    navItems.find((item) => item.href === pathname)?.label ?? 'Account'

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay (Editorial Luxury) */}
      <div aria-hidden className="hev-grain" />

      {/* ─────────── Header strip — eyebrow breadcrumb, soft ambient ─────────── */}
      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-6 lg:pb-8">
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.14), transparent 70%)',
            }}
          />
          <div
            className="absolute top-1/2 -left-20 h-[360px] w-[360px] rounded-full blur-3xl opacity-40"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.16), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[12px] text-foreground/55"
          >
            <Link
              href="/"
              prefetch
              className="hover:text-foreground hev-spring-fast"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-foreground/35" strokeWidth={STROKE} />
            <Link
              href="/account"
              prefetch
              className="hover:text-foreground hev-spring-fast"
            >
              Account
            </Link>
            {activeLabel !== 'Overview' && (
              <>
                <ChevronRight className="h-3 w-3 text-foreground/35" strokeWidth={STROKE} />
                <span className="text-foreground/85">{activeLabel}</span>
              </>
            )}
          </nav>
        </div>
      </section>

      {/* ─────────── Body — sidebar + content ─────────── */}
      <section className="pb-28 lg:pb-36">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
            {/* Sidebar */}
            <aside>
              <div className="lg:sticky lg:top-28 space-y-8">
                {/* Identity card */}
                <div>
                  <p className="font-editorial italic text-foreground text-xl mt-3 leading-tight">
                    {customer.first_name || 'Studio member'}
                  </p>
                  <p className="text-[12px] text-foreground/55 mt-1 truncate">
                    {customer.email}
                  </p>
                </div>

                {/* Nav list */}
                <ul className="divide-y divide-foreground/[0.07]">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          prefetch
                          className={`group flex items-center justify-between gap-3 py-2.5 hev-spring-fast ${
                            isActive
                              ? 'text-foreground'
                              : 'text-foreground/70 hover:text-foreground'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <span className="inline-flex items-center gap-2.5">
                            <Icon
                              className={`h-[15px] w-[15px] ${
                                isActive ? 'text-foreground' : 'text-foreground/55'
                              } hev-spring-fast group-hover:text-foreground`}
                              strokeWidth={STROKE}
                            />
                            <span
                              className={`text-[13.5px] tracking-tight ${
                                isActive ? 'font-medium' : ''
                              }`}
                            >
                              {item.label}
                            </span>
                          </span>
                          {isActive && (
                            <span
                              className="font-editorial italic text-foreground/55 text-[13px]"
                              aria-hidden
                            >
                              ·
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>

                {/* Sign-out — Button-in-Button pill */}
                <button
                  onClick={() => logout()}
                  disabled={isLoggingOut}
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground/85 pl-4 pr-1 py-1 hev-spring-fast disabled:opacity-50"
                >
                  <span className="text-[12.5px] font-medium tracking-tight">
                    {isLoggingOut ? 'Signing out…' : 'Sign out'}
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast">
                    {isLoggingOut ? (
                      <Loader2 className="h-3 w-3 animate-spin" strokeWidth={STROKE} />
                    ) : (
                      <LogOut className="h-3 w-3" strokeWidth={STROKE} />
                    )}
                  </span>
                </button>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0">{children}</div>
          </div>
        </div>
      </section>
    </div>
  )
}
