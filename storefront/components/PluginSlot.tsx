import Script from 'next/script'
import type { SlotEntry } from '@/types/plugins'
import { isScriptEntry } from '@/types/plugins'
import { PLUGIN_REGISTRY } from '@/app/_generated/plugin-registry'
import { getPluginConfigs } from '@/lib/plugin-config'

interface PluginSlotProps {
  name: string
  context?: Record<string, unknown>
}

export default async function PluginSlot({ name, context = {} }: PluginSlotProps) {
  const entries: SlotEntry[] = (PLUGIN_REGISTRY as Record<string, SlotEntry[]>)[name] ?? []
  if (!entries.length) return null

  const configs = await getPluginConfigs()

  return (
    <>
      {entries.flatMap((entry, i) => {
        if (isScriptEntry(entry)) {
          if (entry.when) {
            const key = entry.when.startsWith('config.') ? entry.when.slice(7) : entry.when
            if (!(configs[entry.id] as Record<string, unknown>)?.[key]) return []
          }
          return [
            <Script
              key={`${entry.id}-${i}`}
              id={`plugin-script-${entry.id}`}
              src={entry.src}
              strategy={entry.strategy ?? 'afterInteractive'}
            />,
          ]
        }

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
