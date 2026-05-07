'use client'

import { useQuery } from '@tanstack/react-query'
import type { SlotEntry, PluginConfigs } from '@/types/plugins'
import { isScriptEntry } from '@/types/plugins'
import { PLUGIN_REGISTRY } from '@/app/_generated/plugin-registry'

interface ClientPluginSlotProps {
  name: string
  context?: Record<string, unknown>
}

export function ClientPluginSlot({ name, context = {} }: ClientPluginSlotProps) {
  const { data: configs = {} } = useQuery<PluginConfigs>({
    queryKey: ['plugin-configs'],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'
      const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ''
      const res = await fetch(`${baseUrl}/store/integrations/active`, {
        headers: { 'x-publishable-api-key': pubKey },
      })
      if (!res.ok) return {}
      return res.json()
    },
    staleTime: 60_000,
  })

  const entries: SlotEntry[] = (PLUGIN_REGISTRY as Record<string, SlotEntry[]>)[name] ?? []
  if (!entries.length) return null

  return (
    <>
      {entries.flatMap((entry, i) => {
        if (isScriptEntry(entry)) return []

        const pluginConfig = (configs[entry.id] ?? {}) as Record<string, unknown>
        const props: Record<string, unknown> = {}
        if (entry.propsFromConfig) {
          for (const [prop, configKey] of Object.entries(entry.propsFromConfig)) {
            props[prop] = pluginConfig[configKey]
          }
        }
        if (entry.propsFromContext) {
          for (const key of entry.propsFromContext) {
            props[key] = context[key]
          }
        }

        const Component = entry.Component
        return [<Component key={`${entry.id}-${i}`} {...props} />]
      })}
    </>
  )
}

export default ClientPluginSlot
