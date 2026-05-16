'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Loader2, ArrowUpRight } from 'lucide-react'
import { getMedusaClient } from '@/lib/medusa-client'
import AuthShell, {
  AUTH_INPUT_CLASS,
  AUTH_INPUT_STYLE,
  AUTH_LABEL_CLASS,
} from '@/components/auth/auth-shell'

const STROKE = 1.25

function BackToLogin() {
  return (
    <Link
      href="/auth/login"
      prefetch
      className="group inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] hover:bg-foreground/[0.07] text-foreground/80 pl-2 pr-4 py-1 hev-spring-fast"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background hev-spring-fast group-hover:-translate-x-[2px]">
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={STROKE} />
      </span>
      <span className="text-[12.5px] font-medium tracking-tight">
        Back to sign in
      </span>
    </Link>
  )
}

function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const prefillEmail = searchParams.get('email') || ''

  const [email, setEmail] = useState(prefillEmail)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await getMedusaClient().auth.resetPassword('customer', 'emailpass', {
        identifier: email,
      })
    } catch {
      // Don't reveal whether the email exists — always show success
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <AuthShell
        eyebrow="Check your inbox"
        title={
          <>
            On its{' '}
            <span className="italic font-normal text-foreground/85">way</span>.
          </>
        }
        subtitle={
          <>
            If an account exists for{' '}
            <span className="font-medium text-foreground">{email}</span>, a reset
            link is on its way. It may take a minute.
          </>
        }
        footer={<BackToLogin />}
      >
        <div className="flex flex-col items-center text-center gap-5">
          <span className="grid place-items-center h-12 w-12 rounded-full bg-foreground/[0.05]">
            <Mail className="h-5 w-5 text-foreground/70" strokeWidth={STROKE} />
          </span>
          <p className="font-editorial italic text-foreground text-xl leading-tight">
            Reset link dispatched.
          </p>
          <p className="text-[13px] text-foreground/60 max-w-xs">
            No email after five minutes? Check spam, or request a new one below.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-[12px] text-foreground/55 hover:text-foreground hev-spring-fast"
          >
            Send to a different email
          </button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      eyebrow="Reset · password"
      title={
        <>
          Forgot your{' '}
          <span className="italic font-normal text-foreground/85">password</span>?
        </>
      }
      subtitle="Drop in your email and we'll send a link to set a new one."
      footer={<BackToLogin />}
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

        <button
          type="submit"
          disabled={loading}
          className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press disabled:opacity-50"
        >
          <span className="text-[13px] font-medium tracking-tight pr-1">
            {loading ? 'Sending…' : 'Send reset link'}
          </span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
            {loading ? (
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

export default function ForgotPasswordPage() {
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
      <ForgotPasswordForm />
    </Suspense>
  )
}
