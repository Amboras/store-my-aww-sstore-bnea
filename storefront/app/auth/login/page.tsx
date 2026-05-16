'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import AuthShell, {
  AUTH_INPUT_CLASS,
  AUTH_INPUT_STYLE,
  AUTH_LABEL_CLASS,
} from '@/components/auth/auth-shell'

const STROKE = 1.25

function LoginForm() {
  const searchParams = useSearchParams()
  const prefillEmail = searchParams.get('email') || ''
  const redirectTo = searchParams.get('redirect') || '/account'

  const [email, setEmail] = useState(prefillEmail)
  const [password, setPassword] = useState('')
  const { login, isLoggingIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login({ email, password })
      toast.success('Welcome back!')
      router.push(redirectTo)
    } catch (error: any) {
      toast.error(error?.message || 'Invalid email or password')
    }
  }

  return (
    <AuthShell
      eyebrow="Sign in · studio account"
      title={
        <>
          Welcome{' '}
          <span className="italic font-normal text-foreground/85">back</span>.
        </>
      }
      subtitle="Sign in to track orders, manage addresses, and pick up where you left off."
      footer={
        <>
          Don&apos;t have an account yet?{' '}
          <Link
            href="/auth/register"
            prefetch
            className="font-medium text-foreground link-underline pb-0.5"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
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
            autoComplete="current-password"
            placeholder="Your password"
            className={AUTH_INPUT_CLASS}
            style={AUTH_INPUT_STYLE}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
          {prefillEmail && (
            <Link
              href={`/auth/forgot-password?email=${encodeURIComponent(prefillEmail)}`}
              prefetch
              className="text-foreground/80 hover:text-foreground link-underline pb-0.5"
            >
              First time? Set your password
            </Link>
          )}
          <Link
            href={`/auth/forgot-password${
              prefillEmail ? `?email=${encodeURIComponent(prefillEmail)}` : ''
            }`}
            prefetch
            className="ml-auto text-foreground/55 hover:text-foreground hev-spring-fast"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press disabled:opacity-50"
        >
          <span className="text-[13px] font-medium tracking-tight pr-1">
            {isLoggingIn ? 'Signing in…' : 'Sign in'}
          </span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
            {isLoggingIn ? (
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-custom pt-32 pb-28 grid place-items-center">
          <Loader2
            className="h-5 w-5 animate-spin text-foreground/50"
            strokeWidth={STROKE}
          />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
