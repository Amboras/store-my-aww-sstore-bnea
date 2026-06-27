'use client'

import { useKlaviyoIdentifyEffect } from '@amboras-dev/klaviyo'

interface Props {
  email?: string
  customerId?: string
}

/**
 * Thin wrapper that calls Klaviyo identify whenever the logged-in
 * user's email changes. Renders nothing.
 */
export default function KlaviyoIdentifyOnLogin({ email, customerId }: Props) {
  useKlaviyoIdentifyEffect(email ?? null, customerId ? { id: customerId } : undefined)
  return null
}
