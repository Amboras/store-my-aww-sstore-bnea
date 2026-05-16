'use client'

import { useAuth } from '@/hooks/use-auth'
import AccountLayout from '@/components/account/account-layout'
import Link from 'next/link'
import { Package, MapPin, User, ArrowUpRight } from 'lucide-react'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'

const STROKE = 1.25

const QUICK_LINKS = [
  {
    href: '/account/orders',
    label: 'Orders',
    body: 'Past purchases, tracking, invoices.',
    icon: Package,
  },
  {
    href: '/account/addresses',
    label: 'Addresses',
    body: 'Shipping destinations, on file.',
    icon: MapPin,
  },
  {
    href: '/account/profile',
    label: 'Profile',
    body: 'Name, contact, login details.',
    icon: User,
  },
]

export default function AccountPage() {
  const { customer } = useAuth()

  return (
    <AccountLayout>
      {/* account slot — invisible identify-on-login trackers */}
      <ClientPluginSlot
        name="account"
        context={{ customerId: customer?.id, email: customer?.email }}
      />

      {/* Greeting */}
      <header>
        <h1 className="font-editorial text-foreground mt-4 leading-[0.95] tracking-tight text-[clamp(2.25rem,4.6vw,3.5rem)]">
          Hello,{' '}
          <span className="italic font-normal text-foreground/85">
            {customer?.first_name || 'studio member'}
          </span>
          .
        </h1>
        <p className="mt-5 text-[14.5px] leading-relaxed text-foreground/65 max-w-md">
          Quietly manage your orders, addresses, and contact details. Nothing
          fancy — just the controls you need.
        </p>
      </header>

      {/* Quick links — Double-Bezel mini cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {QUICK_LINKS.map((q) => {
          const Icon = q.icon
          return (
            <Link
              key={q.href}
              href={q.href}
              prefetch
              className="group block hev-spring"
            >
              <div className="hev-shell rounded-[1.5rem] p-[5px] hev-spring group-hover:-translate-y-1">
                <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <span className="grid place-items-center h-9 w-9 rounded-full bg-foreground/[0.05]">
                      <Icon
                        className="h-4 w-4 text-foreground/75"
                        strokeWidth={STROKE}
                      />
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.04] hev-spring-fast group-hover:bg-foreground group-hover:text-background group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
                    </span>
                  </div>
                  <h2 className="font-editorial text-foreground text-xl mt-6 leading-tight">
                    {q.label}
                  </h2>
                  <p className="mt-1.5 text-[13px] text-foreground/60 leading-relaxed">
                    {q.body}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* accountOverview slot — loyalty balance, rewards hub */}
      <ClientPluginSlot
        name="accountOverview"
        context={{ customerId: customer?.id }}
      />

      {/* Account details — divider-only, no card boxing */}
      {customer && (
        <section className="mt-14">

          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-foreground/[0.08] border-y border-foreground/[0.08]">
            <div className="py-6 sm:pr-8">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                Name
              </dt>
              <dd className="font-editorial text-foreground text-2xl mt-1.5 leading-tight">
                {customer.first_name || '—'}{' '}
                <span className="italic text-foreground/85">
                  {customer.last_name || ''}
                </span>
              </dd>
            </div>
            <div className="py-6 sm:pl-8">
              <dt className="text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                Email
              </dt>
              <dd className="font-editorial text-foreground text-2xl mt-1.5 leading-tight truncate">
                {customer.email}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </AccountLayout>
  )
}
