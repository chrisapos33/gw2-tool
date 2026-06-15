import { gw2Fetch } from './client'
import { ENDPOINTS } from './endpoints'
import { publicFetch, fetchItemMap } from './utils'
import type { MaterialEntry, MaterialCategory, MaterialEntryWithDetails } from './types'

async function fetchMaterialEntries(key: string): Promise<MaterialEntry[]> {
  return gw2Fetch<MaterialEntry[]>(ENDPOINTS.accountMaterials, key)
}

async function fetchMaterialCategories(): Promise<MaterialCategory[]> {
  return publicFetch<MaterialCategory[]>(`${ENDPOINTS.materialCategories}?ids=all`)
}

export async function fetchMaterials(key: string): Promise<MaterialEntryWithDetails[]> {
  const [allEntries, categories] = await Promise.all([
    fetchMaterialEntries(key),
    fetchMaterialCategories(),
  ])

  const entries = allEntries.filter((e) => e.count > 0)
  if (entries.length === 0) return []

  const itemMap = await fetchItemMap(entries.map((e) => e.id))
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  const result: MaterialEntryWithDetails[] = entries
    .filter((e) => itemMap.has(e.id))
    .map((entry) => ({
      entry,
      item: itemMap.get(entry.id)!,
      category: categoryMap.get(entry.category) ?? null,
    }))

  result.sort((a, b) => {
    const orderA = a.category?.order ?? Infinity
    const orderB = b.category?.order ?? Infinity
    if (orderA !== orderB) return orderA - orderB
    return a.item.name.localeCompare(b.item.name)
  })

  return result
}
