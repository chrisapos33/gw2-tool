import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiKey } from '@/context/ApiKeyContext'
import { fetchInventory } from '@/api/inventory'
import { ApiError } from '@/api/client'
import type { CharacterInventory } from '@/api/types'

interface UseInventoryResult {
  inventory: CharacterInventory[]
  loading: boolean
  error: string | null
}

export function useInventory(): UseInventoryResult {
  const { apiKey, clearApiKey } = useApiKey()
  const navigate = useNavigate()
  const [inventory, setInventory] = useState<CharacterInventory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKey) {
      navigate('/apikey')
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchInventory(apiKey)
      .then((data) => {
        if (!cancelled) setInventory(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearApiKey()
          navigate('/apikey')
        } else if (err instanceof ApiError) {
          setError(`Failed to load inventory (${err.status}). Please try again.`)
        } else {
          setError('Unable to reach the Guild Wars 2 API. Check your connection and try again.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [apiKey, clearApiKey, navigate])

  return { inventory, loading, error }
}
