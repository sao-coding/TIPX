import { cookies } from 'next/headers'
import axios from 'axios'

import { site } from '@/config/site'

const api = axios.create({
  baseURL: `${site.url}/api`
})

// api.interceptors.request.use((config) => {
//   const accessToken = cookies().get('accessToken')?.value
//   console.log('server axios interceptor get cookie', accessToken)
//   if (accessToken) {
//     config.headers['Authorization'] = `Bearer ${accessToken}`
//   }
//   return config
// })

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('server error', error.response)
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      // console.log('cookie', cookies().getAll())

      try {
        // 附帶 cookie
        const { data } = await axios.get(`${site.url}/api/refresh-token`, {
          headers: {
            Cookie: cookies().toString()
          }
        })

        const { accessToken } = data
        // console.log('server get access token', accessToken)
        // console.log('server get all cookie', cookies().getAll())

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // /login?redirect=
        // 重新導向到登入頁面或處理登出邏輯
        // window.location.href = '/login?redirect=' + window.location.pathname
        console.log('server refresh token error', refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api