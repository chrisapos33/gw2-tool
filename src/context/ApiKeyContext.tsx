import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface ApiKeyContextValue {
  apiKey: string | null
  setApiKey: (key: string, remember: boolean) => void
  clearApiKey: () => void
  isKeySet: boolean
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null)

const STORAGE_KEY = 'gw2_api_key'

function loadPersistedKey(): string | null {
  return (
    localStorage.getItem(STORAGE_KEY) ??
    sessionStorage.getItem(STORAGE_KEY) ??
    null
  )
}

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(loadPersistedKey)

  const setApiKey = useCallback((key: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem(STORAGE_KEY, key)
      sessionStorage.removeItem(STORAGE_KEY)
    } else {
      sessionStorage.setItem(STORAGE_KEY, key)
      localStorage.removeItem(STORAGE_KEY)
    }
    setApiKeyState(key)
  }, [])

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    setApiKeyState(null)
  }, [])

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, isKeySet: apiKey !== null }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export function useApiKey(): ApiKeyContextValue {
  const ctx = useContext(ApiKeyContext)
  if (!ctx) throw new Error('useApiKey must be used within ApiKeyProvider')
  return ctx
}
