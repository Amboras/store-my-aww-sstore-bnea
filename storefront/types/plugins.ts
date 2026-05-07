import type { ComponentType } from 'react'

export type ScriptSlotEntry = {
  id: string
  src: string
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive'
  when?: string
}

export type ComponentSlotEntry = {
  id: string
  Component: ComponentType<Record<string, unknown>>
  propsFromConfig?: Record<string, string>
  propsFromContext?: string[]
}

export type SlotEntry = ScriptSlotEntry | ComponentSlotEntry

export type PluginRegistry = Record<string, SlotEntry[]>

export function isScriptEntry(e: SlotEntry): e is ScriptSlotEntry {
  return 'src' in e
}
