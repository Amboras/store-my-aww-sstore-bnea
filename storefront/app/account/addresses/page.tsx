'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMedusaClient } from '@/lib/medusa-client'
import AccountLayout from '@/components/account/account-layout'
import { MapPin, Plus, Trash2, Loader2, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'

const STROKE = 1.25

const INPUT_CLASS =
  'w-full rounded-full bg-foreground/[0.04] px-5 py-3 text-[13.5px] text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/15 hev-spring-fast'
const INPUT_STYLE: React.CSSProperties = {
  boxShadow: 'inset 0 0 0 1px hsl(var(--foreground) / 0.06)',
}

export default function AddressesPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    postal_code: '',
    country_code: 'us',
    phone: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await getMedusaClient().store.customer.listAddress({
        limit: 50,
      })
      return response.addresses
    },
    retry: false,
  })

  const createAddress = useMutation({
    mutationFn: async () => {
      return getMedusaClient().store.customer.createAddress(form)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setShowForm(false)
      setForm({
        first_name: '',
        last_name: '',
        address_1: '',
        city: '',
        postal_code: '',
        country_code: 'us',
        phone: '',
      })
      toast.success('Address added')
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to add address'),
  })

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      return getMedusaClient().store.customer.deleteAddress(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Address removed')
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to remove address'),
  })

  const addresses = data || []

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AccountLayout>
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-editorial text-foreground mt-4 leading-[0.95] tracking-tight text-[clamp(2rem,4.2vw,3rem)]">
            Your{' '}
            <span className="italic font-normal text-foreground/85">
              addresses
            </span>
            .
          </h1>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-5 pr-1 py-1 hev-spring-fast hev-press self-start sm:self-end"
          >
            <span className="text-[12.5px] font-medium tracking-tight">
              Add an address
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
              <Plus className="h-3.5 w-3.5" strokeWidth={STROKE} />
            </span>
          </button>
        )}
      </header>

      {/* Add address form — Double-Bezel */}
      {showForm && (
        <div className="mb-10 hev-shell rounded-[1.75rem] p-[5px] hev-rise-soft">
          <div className="hev-core rounded-[calc(1.75rem-5px)] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-[12px] text-foreground/55 hover:text-foreground hev-spring-fast"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                createAddress.mutate()
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-3">
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
                    required
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
                    required
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="address_1"
                  className="text-[10px] uppercase tracking-[0.2em] text-foreground/55"
                >
                  Street address
                </label>
                <input
                  id="address_1"
                  type="text"
                  value={form.address_1}
                  onChange={(e) => updateField('address_1', e.target.value)}
                  required
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="city"
                    className="text-[10px] uppercase tracking-[0.2em] text-foreground/55"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    required
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="postal_code"
                    className="text-[10px] uppercase tracking-[0.2em] text-foreground/55"
                  >
                    Postal code
                  </label>
                  <input
                    id="postal_code"
                    type="text"
                    value={form.postal_code}
                    onChange={(e) => updateField('postal_code', e.target.value)}
                    required
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
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={createAddress.isPending}
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-5 pr-1 py-1 hev-spring-fast hev-press disabled:opacity-50"
                >
                  <span className="text-[12.5px] font-medium tracking-tight">
                    {createAddress.isPending ? 'Saving…' : 'Save address'}
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25">
                    {createAddress.isPending ? (
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
      )}

      {/* Address list */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="hev-shell rounded-[1.5rem] p-[5px] hev-rise-soft"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="hev-core rounded-[calc(1.5rem-5px)] p-6 h-36 grid place-items-center">
                <Loader2
                  className="h-4 w-4 animate-spin text-foreground/40"
                  strokeWidth={STROKE}
                />
              </div>
            </div>
          ))}
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="mx-auto max-w-md hev-shell rounded-[1.5rem] p-[5px]">
          <div className="hev-core rounded-[calc(1.5rem-5px)] p-10 text-center">
            <span className="inline-grid place-items-center h-11 w-11 rounded-full bg-foreground/[0.05]">
              <MapPin
                className="h-4 w-4 text-foreground/70"
                strokeWidth={STROKE}
              />
            </span>
            <p className="font-editorial italic text-foreground text-xl mt-5 leading-tight">
              No addresses saved.
            </p>
            <p className="mt-2 text-[13px] text-foreground/60 max-w-xs mx-auto">
              Add one now and we&rsquo;ll keep it on file for next time.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] hover:bg-foreground/[0.08] text-foreground pl-4 pr-1 py-1 hev-spring-fast"
            >
              <span className="text-[12.5px] font-medium tracking-tight">
                Add your first address
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
                <Plus className="h-3 w-3" strokeWidth={STROKE} />
              </span>
            </button>
          </div>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {addresses.map((addr: any) => (
            <li key={addr.id} className="group">
              <div className="hev-shell rounded-[1.5rem] p-[5px] hev-spring group-hover:-translate-y-[2px]">
                <div className="hev-core relative rounded-[calc(1.5rem-5px)] p-6">
                  <p className="font-editorial text-foreground text-lg leading-tight">
                    {addr.first_name}{' '}
                    <span className="italic text-foreground/85">
                      {addr.last_name}
                    </span>
                  </p>
                  <div className="mt-3 text-[13px] text-foreground/65 leading-relaxed space-y-0.5">
                    <p>{addr.address_1}</p>
                    <p>
                      {addr.city}
                      {addr.postal_code ? `, ${addr.postal_code}` : ''}
                    </p>
                    <p className="uppercase tracking-wide text-foreground/55 text-[11px]">
                      {addr.country_code}
                    </p>
                    {addr.phone && (
                      <p className="pt-1 text-foreground/55">{addr.phone}</p>
                    )}
                  </div>

                  {/* Delete chip */}
                  <button
                    onClick={() => deleteAddress.mutate(addr.id)}
                    aria-label="Delete address"
                    className="absolute top-4 right-4 inline-grid place-items-center h-8 w-8 rounded-full bg-foreground/[0.04] text-foreground/60 hover:bg-destructive/10 hover:text-destructive hev-spring-fast opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={STROKE} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountLayout>
  )
}
