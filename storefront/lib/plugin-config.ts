export type PluginConfigs = Record<string, Record<string, unknown>>

let _cache: { data: PluginConfigs; ts: number } | null = null
const CACHE_TTL_MS = 60_000

export async function getPluginConfigs(): Promise<PluginConfigs> {
  if (_cache && Date.now() - _cache.ts < CACHE_TTL_MS) return _cache.data
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'
    const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ''
    const res = await fetch(`${baseUrl}/store/integrations/active`, {
      headers: { 'x-publishable-api-key': pubKey },
      next: { revalidate: 60 },
    })
    if (!res.ok) return {}
    const data: PluginConfigs = await res.json()
    _cache = { data, ts: Date.now() }
    return data
  } catch {
    return {}
  }
}
