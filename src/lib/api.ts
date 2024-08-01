// api.ts
const API_BASE_URL = 'https://api.example.com'

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  })

  if (response.status === 401 && !isRefreshing) {
    isRefreshing = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const refreshResponse = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await refreshResponse.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)

      processQueue(null, data.token)

      // Retry the original request
      headers.set('Authorization', `Bearer ${data.token}`)
      return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
      })
    } catch (error) {
      processQueue(error, null)
      throw error
    } finally {
      isRefreshing = false
    }
  } else if (response.status === 401 && isRefreshing) {
    // Wait for the refresh to complete
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    }).then(() => {
      const newToken = localStorage.getItem('token')
      headers.set('Authorization', `Bearer ${newToken}`)
      return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
      })
    })
  }

  return response
}

const api = {
  get: (url: string) => fetchWithAuth(url),
  post: (url: string, body: any) =>
    fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  // 可以根據需要添加其他方法（PUT, DELETE 等）
}

export default api
