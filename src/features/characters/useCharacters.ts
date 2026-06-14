import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiKey } from '@/context/ApiKeyContext'
import { fetchAllCharacters } from '@/api/characters'
import { ApiError } from '@/api/client'
import type { Character } from '@/api/types'

interface UseCharactersResult {
  characters: Character[]
  loading: boolean
  error: string | null
}

export function useCharacters(): UseCharactersResult {
  const { apiKey, clearApiKey } = useApiKey()
  const navigate = useNavigate()
  const [characters, setCharacters] = useState<Character[]>([])
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

    fetchAllCharacters(apiKey)
      .then((data) => {
        if (!cancelled) setCharacters(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          clearApiKey()
          navigate('/apikey')
        } else if (err instanceof ApiError) {
          setError(`Failed to load characters (${err.status}). Please try again.`)
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

  return { characters, loading, error }
}
