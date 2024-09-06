'use client'

import React from 'react'
import toast from 'react-hot-toast'

import Title from '@/components/Title'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import Loading from '@/components/ui/Loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useMediaQuery } from '@/hooks/use-media-query'
import api from '@/lib/api'
import { UserSettings } from '@prisma/client'
import {
  Icon,
  IconDeviceDesktop,
  IconMapPin,
  IconMoon,
  IconPaint,
  IconPhoto,
  IconSun,
  IconTrash,
  IconUpload,
  IconUserSquareRounded
} from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const SettingsPage = () => {
  const [theme, setTheme] = React.useState('system')
  const [location, setLocation] = React.useState(false)
  const [avatar, setAvatar] = React.useState('')
  const [banner, setBanner] = React.useState('')
  const queryClient = useQueryClient()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const { data, isLoading } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await api.get('/settings')
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

  // theme
  // location
  const updateSettings = async (
    theme: string,
    location: boolean,
    avatar: string,
    banner: string
  ) => {
    const { data } = await api.patch('/settings', {
      theme,
      location,
      avatar,
      banner
    })
    queryClient.invalidateQueries({ queryKey: ['settings'] })
  }

  const handleTheme = (theme: string) => {
    // color-scheme: dark;
    switch (theme) {
      case 'system':
        localStorage.removeItem('theme')
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
      default:
        break
    }
    setTheme(theme)
    updateSettings(theme, location, avatar, banner)
  }

  const handleLocation = async () => {
    const newLocation = !location
    localStorage.setItem('location', String(newLocation))
    setLocation(newLocation)

    if (newLocation) {
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('position', position)
        },
        (error) => {
          console.log('error', error)
        }
      )
    }

    updateSettings(theme, newLocation, avatar, banner)
  }

  const handleAvatar = (avatar: string) => {
    updateSettings(theme, location, avatar, banner)
  }

  const handleBanner = (banner: string) => {
    updateSettings(theme, location, avatar, banner)
  }

  // 清除快取
  const clearCache = async () => {
    const { data } = await api.delete('/clear')
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
      {isLoading ? (
        <Loading />
      ) : (
        <div className='grid grid-rows-5 gap-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
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
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <IconMapPin className='stroke-red-500' />
              定位
            </div>
            <Switch checked={location} onCheckedChange={handleLocation} />
          </div>
          {isDesktop ? (
            <Dialog>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <IconUserSquareRounded className='stroke-orange-500' />
                  大頭貼
                </div>
                <DialogTrigger asChild>
                  <Button variant='secondary'>
                    <IconUpload />
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>上傳大頭貼</DialogTitle>
                  <DialogDescription>請貼上大頭貼網址</DialogDescription>
                </DialogHeader>
                <Input
                  placeholder='https://tipx.sao-x.com/avatar.jpg'
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
                <DialogClose asChild>
                  <Button onClick={() => handleAvatar(avatar)}>儲存</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <IconUserSquareRounded className='stroke-orange-500' />
                  大頭貼
                </div>
                <DrawerTrigger asChild>
                  <Button variant='secondary'>
                    <IconUpload />
                  </Button>
                </DrawerTrigger>
              </div>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>上傳大頭貼</DrawerTitle>
                  <DrawerDescription>請貼上大頭貼網址</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Input
                    placeholder='https://tipx.sao-x.com/avatar.jpg'
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                  <DrawerClose asChild>
                    <Button onClick={() => handleAvatar(avatar)}>儲存</Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button variant='outline'>取消</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
          {/* 橫幅設定 */}
          {isDesktop ? (
            <Dialog>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <IconPhoto className='stroke-amber-500' />
                  橫幅
                </div>
                <DialogTrigger asChild>
                  <Button variant='secondary'>
                    <IconUpload />
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>上傳橫幅</DialogTitle>
                  <DialogDescription>請貼上橫幅網址</DialogDescription>
                </DialogHeader>
                <Input
                  placeholder='https://tipx.sao-x.com/banner.jpg'
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                />
                <DialogClose asChild>
                  <Button onClick={() => handleBanner(banner)}>儲存</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          ) : (
            <Drawer>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <IconPhoto className='stroke-amber-500' />
                  橫幅
                </div>
                <DrawerTrigger asChild>
                  <Button variant='secondary'>
                    <IconUpload />
                  </Button>
                </DrawerTrigger>
              </div>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>上傳橫幅</DrawerTitle>
                  <DrawerDescription>請貼上橫幅網址</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Input
                    placeholder='https://tipx.sao-x.com/banner.jpg'
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                  />
                  <DrawerClose asChild>
                    <Button onClick={() => handleBanner(banner)}>儲存</Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button variant='outline'>取消</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <IconTrash className='stroke-gray-500' />
              清除快取
            </div>
            <Button onClick={clearCache} variant='destructive'>
              <IconTrash />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default SettingsPage
