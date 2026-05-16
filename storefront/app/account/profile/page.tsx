'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getMedusaClient } from '@/lib/medusa-client'
import { useQueryClient } from '@tanstack/react-query'
import AccountLayout from '@/components/account/account-layout'
import { Loader2, ArrowUpRight, Lock } from 'lucide-react'
import { toast } from 'sonner'

const STROKE = 1.25

const INPUT_CLASS =
  'w-full rounded-full bg-foreground/[0.04] px-5 py-3 text-[13.5px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/15 hev-spring-fast'
const INPUT_STYLE: React.CSSProperties = {
  boxShadow: 'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
}

export default function ProfilePage() {
  const { customer } = useAuth()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })

  useEffect(() => {
    if (customer) {
      setForm({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone: customer.phone || '',
      })
    }
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { customer: updated } = await getMedusaClient().store.customer.update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || undefined,
      })
      queryClient.setQueryData(['customer'], updated)
      toast.success('Profile updated')
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AccountLayout>
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-editorial text-foreground mt-4 leading-[0.95] tracking-tight text-[clamp(2rem,4.2vw,3rem)]">
          Your{' '}
          <span className="italic font-normal text-foreground/85">profile</span>
          .
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-foreground/65 max-w-md">
          The details we ship under. Update once, applied everywhere.
        </p>
      </header>

      {/* Form — Double-Bezel card */}
      <div className="hev-shell rounded-[1.75rem] p-[5px]">
        <div className="hev-core rounded-[calc(1.75rem-5px)] p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            {/* Email — locked */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[10px] uppercase tracking-[0.2em] text-foreground/55"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={customer?.email || ''}
                  disabled
                  className={`${INPUT_CLASS} pr-12 text-foreground/55 cursor-not-allowed`}
                  style={INPUT_STYLE}
                />
                <span
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
                  aria-hidden
                >
                  <Lock className="h-3.5 w-3.5" strokeWidth={STROKE} />
                </span>
              </div>
              <p className="text-[11px] text-foreground/50">
                Email is locked. Reach the studio to change it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="first_name"
                  className="text-[10px] uppercase tracking-[0.2em] text-foreground/55"
                >
                  First name
                </label>
                <input
                  id="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="last_name"
                  className="text-[10px] uppercase tracking-[0.2em] text-foreground/55"
                >
                  Last name
                </label>
                <input
                  id="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-[10px] uppercase tracking-[0.2em] text-foreground/55"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="Optional"
                className={INPUT_CLASS}
                style={INPUT_STYLE}
              />
              <p className="text-[11px] text-foreground/50">
                Used only for delivery questions, never for marketing.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-5 pr-1 py-1 hev-spring-fast hev-press disabled:opacity-50"
              >
                <span className="text-[12.5px] font-medium tracking-tight">
                  {saving ? 'Saving…' : 'Save changes'}
                </span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={STROKE} />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  )
}
