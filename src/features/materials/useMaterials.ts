import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiKey } from '@/context/ApiKeyContext'
import { fetchMaterials } from '@/api/materials'
import { ApiError } from '@/api/client'
import type { MaterialEntryWithDetails } from '@/api/types'

interface UseMaterialsResult {
  materials: MaterialEntryWithDetails[]
  loading: boolean
  error: string | null
}

export function useMaterials(): UseMaterialsResult {
  const { apiKey, clearApiKey } = useApiKey()
  const navigate = useNavigate()
  const [materials, setMaterials] = useState<MaterialEntryWithDetails[]>([])
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

    fetchMaterials(apiKey)
      .then((data) => {
        if (!cancelled) setMaterials(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearApiKey()
          navigate('/apikey')
        } else if (err instanceof ApiError) {
          setError(`Failed to load materials (${err.status}). Please try again.`)
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

  return { materials, loading, error }
}
