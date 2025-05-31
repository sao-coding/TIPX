import React from 'react'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

import api from '@/lib/api'
import { UserSettings } from '@prisma/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useUserSettings = () => {
  const [theme, setTheme] = React.useState('system')
  const [location, setLocation] = React.useState(false)
  const [avatar, setAvatar] = React.useState('')
  const [banner, setBanner] = React.useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('settings')
      return data
    }
  })

  React.useEffect(() => {
    if (data) {
      setTheme(data.theme)
      setLocation(data.location)
      setAvatar(data.avatar)
      setBanner(data.banner)
    }
  }, [data])

  const updateSettings = async (
    theme: string,
    location: boolean,
    avatar: string,
    banner: string
  ) => {
    await api.patch('settings', {
      theme,
      location,
      avatar,
      banner
    })
    queryClient.invalidateQueries({ queryKey: ['settings'] })
  }

  const handleTheme = (newTheme: string) => {
    switch (newTheme) {
      case 'system':
        localStorage.removeItem('theme')
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.remove('light')
          document.documentElement.classList.add('dark')
          document.documentElement.style.setProperty('color-scheme', 'dark')
        } else {
          document.documentElement.classList.add('light')
          document.documentElement.style.setProperty('color-scheme', 'light')
        }
        break
      case 'dark':
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
        document.documentElement.style.setProperty('color-scheme', 'dark')
        break
      case 'light':
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
        document.documentElement.style.setProperty('color-scheme', 'light')
        break
    }
    setTheme(newTheme)
    updateSettings(newTheme, location, avatar, banner)
  }

  const handleLocation = async () => {
    const newLocation = !location
    localStorage.setItem('location', String(newLocation))
    setLocation(newLocation)

    if (newLocation) {
      await navigator.geolocation.getCurrentPosition(
        (position) => console.log('position', position),
        (error) => console.log('error', error)
      )
    }

    updateSettings(theme, newLocation, avatar, banner)
  }

  const handleAvatar = (newAvatar: string) => {
    setAvatar(newAvatar)
    updateSettings(theme, location, newAvatar, banner)
  }

  const handleBanner = (newBanner: string) => {
    setBanner(newBanner)
    updateSettings(theme, location, avatar, newBanner)
  }

  const clearCache = async () => {
    const { data } = await api.delete('clear')
    if (data.message === 'success') {
      toast.success('清除成功')
    } else {
      toast.error('清除失敗')
    }
  }

  const createPassword = async (password: string): Promise<boolean> => {
    try {
      const { data } = await api.post('password', { password })
      if (data.status === 'success') {
        toast.success('密碼創建成功')
        // 更新用戶密碼狀態
        queryClient.invalidateQueries({ queryKey: ['user-password'] })
        return true
      }
      return false
    } catch (error) {
      const err = error as AxiosError
      console.error(error)
      type Error = {
        message: string
      }
      toast.error((err.response?.data as Error).message || '密碼創建失敗')
      return false
    }
  }

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { data } = await api.patch('password', { oldPassword, newPassword })
      if (data.status === 'success') {
        toast.success('密碼更新成功')
        // 更新用戶密碼狀態
        queryClient.invalidateQueries({ queryKey: ['user-password'] })
        return true
      }
      return false
    } catch (error) {
      const err = error as AxiosError
      console.error(error)
      type Error = {
        message: string
      }
      toast.error((err.response?.data as Error).message || '密碼更新失敗')
      return false
    }
  }

  return {
    theme,
    location,
    avatar,
    banner,
    isLoading,
    setAvatar,
    setBanner,
    handleTheme,
    handleLocation,
    handleAvatar,
    handleBanner,
    clearCache,
    createPassword,
    updatePassword
  }
}
