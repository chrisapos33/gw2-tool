import { gw2Fetch, ApiError } from './client'
import { ENDPOINTS } from './endpoints'
import type { WalletEntry, Currency, WalletEntryWithCurrency } from './types'

async function fetchWalletEntries(key: string): Promise<WalletEntry[]> {
  return gw2Fetch<WalletEntry[]>(ENDPOINTS.wallet, key)
}

async function fetchCurrencyDetails(ids: number[]): Promise<Currency[]> {
  const url = `${ENDPOINTS.currencies}?ids=${ids.join(',')}`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ text: res.statusText }))
    throw new ApiError(res.status, body.text ?? 'Unknown error')
  }
  return res.json() as Promise<Currency[]>
}

export async function fetchWallet(key: string): Promise<WalletEntryWithCurrency[]> {
  const entries = await fetchWalletEntries(key)
  if (entries.length === 0) return []

  const ids = entries.map((e) => e.id)
  const currencies = await fetchCurrencyDetails(ids)

  const currencyMap = new Map(currencies.map((c) => [c.id, c]))

  return entries
    .filter((e) => currencyMap.has(e.id))
    .sort((a, b) => currencyMap.get(a.id)!.order - currencyMap.get(b.id)!.order)
    .map((entry) => ({ entry, currency: currencyMap.get(entry.id)! }))
}
