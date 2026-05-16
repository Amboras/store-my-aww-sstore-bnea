'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react'
import { getMedusaClient } from '@/lib/medusa-client'
import { toast } from 'sonner'
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

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <AuthShell
        eyebrow="Link · invalid"
        title={
          <>
            That link is{' '}
            <span className="italic font-normal text-foreground/85">
              no longer
            </span>{' '}
            valid.
          </>
        }
        subtitle="Reset links expire quickly for safety. Request a fresh one and we'll send it again."
        footer={<BackToLogin />}
      >
        <div className="flex flex-col items-center text-center gap-5">
          <span className="grid place-items-center h-12 w-12 rounded-full bg-foreground/[0.05]">
            <AlertCircle
              className="h-5 w-5 text-foreground/70"
              strokeWidth={STROKE}
            />
          </span>
          <p className="font-editorial italic text-foreground text-xl leading-tight">
            Expired or never minted.
          </p>
          <Link
            href="/auth/forgot-password"
            prefetch
            className="group inline-flex items-center gap-1.5 rounded-full bg-foreground text-background pl-5 pr-1 py-1 hev-spring-fast"
          >
            <span className="text-[12.5px] font-medium tracking-tight">
              Request a new link
            </span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
              <ArrowUpRight className="h-3 w-3" strokeWidth={STROKE} />
            </span>
          </Link>
        </div>
      </AuthShell>
    )
  }

  if (success) {
    return (
      <AuthShell
        eyebrow="Updated"
        title={
          <>
            Password{' '}
            <span className="italic font-normal text-foreground/85">reset</span>.
          </>
        }
        subtitle="Sign in with your new password — we'll route you straight to your account."
        footer={null}
      >
        <div className="flex flex-col items-center text-center gap-5">
          <span
            className="grid place-items-center h-12 w-12 rounded-full"
            style={{ background: 'hsl(var(--accent) / 0.12)' }}
          >
            <CheckCircle2
              className="h-5 w-5"
              strokeWidth={STROKE}
              style={{ color: 'hsl(var(--accent))' }}
            />
          </span>
          <p className="font-editorial italic text-foreground text-xl leading-tight">
            All set.
          </p>
          <button
            onClick={() =>
              router.push(
                `/auth/login${
                  email ? `?email=${encodeURIComponent(email)}` : ''
                }`,
              )
            }
            className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-6 pr-1.5 py-1.5 hev-spring-fast hev-press"
          >
            <span className="text-[13px] font-medium tracking-tight pr-1">
              Sign in
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/15 hev-spring-fast group-hover:bg-background/25 group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} />
            </span>
          </button>
        </div>
      </AuthShell>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await getMedusaClient().auth.updateProvider(
        'customer',
        'emailpass',
        { password },
        token,
      )
      setSuccess(true)
    } catch (err: any) {
      toast.error(
        err?.message || 'Failed to reset password. The link may have expired.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      eyebrow="New password"
      title={
        <>
          Set a{' '}
          <span className="italic font-normal text-foreground/85">
            new password
          </span>
          .
        </>
      }
      subtitle="Eight characters minimum — long, weird, and only yours."
      footer={<BackToLogin />}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className={AUTH_LABEL_CLASS}>
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            autoFocus
            placeholder="At least eight characters"
            className={AUTH_INPUT_CLASS}
            style={AUTH_INPUT_STYLE}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm_password" className={AUTH_LABEL_CLASS}>
            Confirm password
          </label>
          <input
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Type it again"
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
            {loading ? 'Resetting…' : 'Reset password'}
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

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  )
}
