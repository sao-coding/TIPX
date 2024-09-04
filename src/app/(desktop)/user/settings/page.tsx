'use client'

import { useEffect, useState } from 'react'
import Cookie from 'js-cookie'
import toast from 'react-hot-toast'

import Title from '@/components/Title'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Icon, IconDeviceDesktop, IconMoon, IconPaint, IconSun } from '@tabler/icons-react'

const SettingsPage = () => {
  const [theme, setTheme] = useState('system')
  const [location, setLocation] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('location') === 'true') {
      setLocation(true)
    }
    if (localStorage.getItem('location') === 'false') {
      setLocation(false)
    }
  }, [])

  useEffect(() => {
    if (localStorage.theme === 'dark') {
      setTheme('dark')
    } else if (localStorage.theme === 'light') {
      setTheme('light')
    } else {
      setTheme('system')
    }
  }, [])

  const handleTheme = (theme: string) => {
    switch (theme) {
      case 'system':
        localStorage.removeItem('theme')
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark')
          document.documentElement.classList.remove('light')
          document.documentElement.classList.add('dark')
        } else {
          setTheme('light')
          document.documentElement.classList.remove('dark')
          document.documentElement.classList.add('light')
        }
        break
      case 'dark':
        localStorage.setItem('theme', 'dark')
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
        break
      case 'light':
        localStorage.setItem('theme', 'light')
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
        break
      default:
        break
    }
  }

  const handleLocation = async () => {
    // 是否允許瀏覽器定位
    if (location) {
      localStorage.setItem('location', 'false')
      setLocation(false)
    }
    if (!location) {
      localStorage.setItem('location', 'true')
      setLocation(true)
    }

    // 註冊定位
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('position', position)
      },
      (error) => {
        console.log('error', error)
      }
    )
  }

  // 清除快取
  const clearCache = async () => {
    const res = await fetch('/api/clear', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userid: Cookie.get('cookie_userid') })
    })
    const data = await res.json()
    if (data.message === 'success') {
      toast.success('清除成功')
    } else {
      toast.error('清除失敗')
    }
  }

  const titleData = {
    title: '設定',
    children: ''
  }

  type ThemeConfig = {
    icon: Icon
    color: string
    value: string
    label: string
  }

  const themeConfig: ThemeConfig[] = [
    {
      icon: IconDeviceDesktop,
      color: 'text-blue-500',
      value: 'system',
      label: '跟隨系統'
    },
    {
      icon: IconSun,
      color: 'text-orange-500',
      value: 'light',
      label: '明亮模式'
    },
    {
      icon: IconMoon,
      color: 'text-yellow-500',
      value: 'dark',
      label: '暗黑模式'
    }
  ]

  return (
    <>
      {/* 跟隨系統 明亮模式 暗黑模式 */}
      {/* 主題 */}
      <Title {...titleData} />
      <div className='flex items-center justify-between'>
        <div className='flex gap-2'>
          <IconPaint className='stroke-pink-500' />
          主題
        </div>
        <Select value={theme} onValueChange={(value) => handleTheme(value)}>
          <SelectTrigger className='w-40'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {themeConfig.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className='flex items-center gap-2'>
                  <item.icon className={item.color} />
                  {item.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

export default SettingsPage
