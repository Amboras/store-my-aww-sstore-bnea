'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import { ClientPluginSlot } from '@/components/ClientPluginSlot'
import AuthShell, {
  AUTH_INPUT_CLASS,
  AUTH_INPUT_STYLE,
  AUTH_LABEL_CLASS,
} from '@/components/auth/auth-shell'

const STROKE = 1.25

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register, isRegistering } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      })
      toast.success('Account created successfully!')
      router.push('/account')
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create account',
      )
    }
  }

  return (
    <AuthShell
      eyebrow="Join · studio account"
      title={
        <>
          Open an{' '}
          <span className="italic font-normal text-foreground/85">account</span>.
        </>
      }
      subtitle="Track orders, save addresses, and hear about restocks before the rest."
      aboveHeader={
        /* authSignup slot — social proof panel, benefits list */
        <ClientPluginSlot name="authSignup" />
      }
      footer={
        <>
          Already have an account?{' '}
          <Link
            href="/auth/login"
            prefetch
            className="font-medium text-foreground link-underline pb-0.5"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="first_name" className={AUTH_LABEL_CLASS}>
              First name
            </label>
            <input
              id="first_name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
              placeholder="Mira"
              className={AUTH_INPUT_CLASS}
              style={AUTH_INPUT_STYLE}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="last_name" className={AUTH_LABEL_CLASS}>
              Last name
            </label>
            <input
              id="last_name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
              placeholder="Halterman"
              className={AUTH_INPUT_CLASS}
              style={AUTH_INPUT_STYLE}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={AUTH_LABEL_CLASS}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@yourdomain.com"
            className={AUTH_INPUT_CLASS}
            style={AUTH_INPUT_STYLE}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className={AUTH_LABEL_CLASS}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least eight characters"
            className={AUTH_INPUT_CLASS}
            style={AUTH_INPUT_STYLE}
          />
          <p className="text-[11px] text-foreground/50">
            Eight characters is the floor — make it unguessable.
          </p>
        </div>

        <button
          type="submit"
          disabled={isRegistering}
          className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press disabled:opacity-50"
        >
          <span className="text-[13px] font-medium tracking-tight pr-1">
            {isRegistering ? 'Creating account…' : 'Create account'}
          </span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
            {isRegistering ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={STROKE} />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
            )}
          </span>
        </button>
      </form>
    </AuthShell>
  )
}
