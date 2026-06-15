import { ApiError } from './client'
import { ENDPOINTS } from './endpoints'
import type { Item } from './types'

const ITEM_BATCH_SIZE = 200

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export async function publicFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({ text: res.statusText }))
    throw new ApiError(res.status, body.text ?? 'Unknown error')
  }
  return res.json() as Promise<T>
}

export async function fetchItemMap(ids: number[]): Promise<Map<number, Item>> {
  const unique = [...new Set(ids)]
  if (unique.length === 0) return new Map()

  const chunks = chunkArray(unique, ITEM_BATCH_SIZE)
  const results = await Promise.all(
    chunks.map((chunk) =>
      publicFetch<Item[]>(`${ENDPOINTS.items}?ids=${chunk.join(',')}`)
    )
  )

  return new Map(results.flat().map((item) => [item.id, item]))
}
