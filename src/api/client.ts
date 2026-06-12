export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function gw2Fetch<T>(endpoint: string, apiKey: string): Promise<T> {
  const url = `${endpoint}?access_token=${apiKey}`
  const res = await fetch(url)

  if (!res.ok) {
    const body = await res.json().catch(() => ({ text: res.statusText }))
    throw new ApiError(res.status, body.text ?? 'Unknown error')
  }

  return res.json() as Promise<T>
}
