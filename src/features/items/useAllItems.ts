import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiKey } from '@/context/ApiKeyContext'
import { fetchAllItems } from '@/api/allItems'
import { ApiError } from '@/api/client'
import type { MergedItem } from '@/api/types'

interface UseAllItemsResult {
  items: MergedItem[]
  loading: boolean
  error: string | null
}

export function useAllItems(): UseAllItemsResult {
  const { apiKey, clearApiKey } = useApiKey()
  const navigate = useNavigate()
  const [items, setItems] = useState<MergedItem[]>([])
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

    fetchAllItems(apiKey)
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearApiKey()
          navigate('/apikey')
        } else if (err instanceof ApiError) {
          setError(`Failed to load items (${err.status}). Please try again.`)
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

  return { items, loading, error }
}
