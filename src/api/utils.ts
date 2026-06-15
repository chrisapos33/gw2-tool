import { ApiError } from './client'

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
