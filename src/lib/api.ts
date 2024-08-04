import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get('accessToken')
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('error', error)
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { data } = await axios.get('/api/refresh-token')
        const { accessToken } = data
        console.log('refresh token', accessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        // /login?redirect=
        // 重新導向到登入頁面或處理登出邏輯
        // window.location.href = '/login?redirect=' + window.location.pathname
      }
    }

    return Promise.reject(error)
  }
)

export default api
