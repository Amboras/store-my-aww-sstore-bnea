'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Cormorant_Garamond } from 'next/font/google'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

export const AUTH_INPUT_CLASS =
  'w-full rounded-full bg-foreground/[0.04] px-5 py-3 text-[13.5px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/15 hev-spring-fast'

export const AUTH_INPUT_STYLE: CSSProperties = {
  boxShadow: 'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
}

export const AUTH_LABEL_CLASS =
  'text-[10px] uppercase tracking-[0.2em] text-foreground/55'

interface AuthShellProps {
  /** Eyebrow text shown above the title. Set to null to omit. */
  eyebrow?: string | null
  /** Title node — pass JSX so you can italicise part of it via <span className="italic font-normal text-foreground/85">…</span>. */
  title: ReactNode
  /** Soft 65% body copy below the title. */
  subtitle?: ReactNode
  /** Optional content slotted above the title (used by /auth/register for the authSignup plugin slot). */
  aboveHeader?: ReactNode
  /** Form (or other body content) — already padded by the shell card. */
  children: ReactNode
  /** Optional footer area below the card (link "Don't have an account?", etc.). */
  footer?: ReactNode
  /** Narrow (max-w-md) or wider (max-w-xl) card; default narrow. */
  width?: 'narrow' | 'wide'
}

/**
 * Editorial Luxury auth chrome:
 * - loads Cormorant Garamond as --font-editorial (children get .font-editorial)
 * - film grain overlay
 * - ambient cream/accent blob backdrop
 * - centred Double-Bezel form card
 * - clears the floating nav with pt-28+
 */
export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  aboveHeader,
  children,
  footer,
  width = 'narrow',
}: AuthShellProps) {
  const maxWidth = width === 'wide' ? 'max-w-xl' : 'max-w-md'

  return (
    <div className={editorial.variable}>
      {/* Film-grain overlay */}
      <div aria-hidden className="hev-grain" />

      <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-28 lg:pb-36">
        {/* Ambient backdrop */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full blur-3xl opacity-55"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-[-15%] right-[-10%] h-[460px] w-[460px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(circle, hsl(35 50% 70% / 0.18), transparent 70%)',
            }}
          />
        </div>

        <div className="container-custom">
          <div className={`mx-auto ${maxWidth}`}>
            {aboveHeader}

            {/* Editorial header */}
            <header className="text-center mb-8">
              {eyebrow !== null && eyebrow !== undefined && (
                <span className="hev-eyebrow">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: 'hsl(var(--accent))' }}
                  />
                  {eyebrow}
                </span>
              )}
              <h1 className="font-editorial text-foreground mt-5 leading-[0.95] tracking-tight text-[clamp(2rem,4vw,3rem)]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-4 text-[14px] leading-relaxed text-foreground/65 max-w-sm mx-auto">
                  {subtitle}
                </p>
              )}
            </header>

            {/* Double-Bezel form card */}
            <div className="hev-shell rounded-[1.75rem] p-[5px]">
              <div className="hev-core rounded-[calc(1.75rem-5px)] p-6 sm:p-8 lg:p-10">
                {children}
              </div>
            </div>

            {footer && (
              <div className="mt-8 text-center text-[13px] text-foreground/65">
                {footer}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
