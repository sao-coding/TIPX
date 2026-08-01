'use client'

import React from 'react'

import { PasswordDialog } from '@/app/(desktop)/user/settings/password-dialog'
import { SettingItem } from '@/app/(desktop)/user/settings/setting-item'
import { UploadDialog } from '@/app/(desktop)/user/settings/upload-dialog'
import Title from '@/components/Title'
import { Button } from '@/components/ui/button'
import Loading from '@/components/ui/Loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useUserSettings } from '@/hooks/use-user-settings'
import api from '@/lib/api'
import {
  Icon,
  IconDeviceDesktop,
  IconKey,
  IconMapPin,
  IconMoon,
  IconPaint,
  IconPhoto,
  IconSun,
  IconTrash,
  IconUserSquareRounded
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

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

const SettingsPage = () => {
  const {
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
  } = useUserSettings()

  // 查詢用戶是否已設定密碼
  const { data: userHasPassword } = useQuery<boolean>({
    queryKey: ['user-password'],
    queryFn: async () => {
      try {
        const { data } = await api.get('password')
        return !!data.password
      } catch {
        return false
      }
    }
  })

  const titleData = {
    title: '設定',
    children: ''
  }

  if (isLoading) {
    return (
      <>
        <Title {...titleData} />
        <Loading />
      </>
    )
  }

  return (
    <>
      <Title {...titleData} />
      <div className='grid grid-rows-6 gap-2'>
        <SettingItem icon={IconPaint} iconColor='stroke-pink-500' label='主題'>
          <Select value={theme} onValueChange={handleTheme}>
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
        </SettingItem>

        <SettingItem
          icon={IconMapPin}
          iconColor='stroke-red-500'
          label='天氣定位(尚未支援 因為我有點累了)'
        >
          <Switch checked={location} onCheckedChange={handleLocation} />
        </SettingItem>

        <SettingItem
          icon={IconKey}
          iconColor='stroke-blue-500'
          label={userHasPassword ? '更新密碼' : '設定密碼'}
        >
          <PasswordDialog
            hasPassword={userHasPassword || false}
            onCreatePassword={createPassword}
            onUpdatePassword={updatePassword}
          />
        </SettingItem>

        <SettingItem
          icon={IconUserSquareRounded}
          iconColor='stroke-orange-500'
          label='大頭貼(如果不想一直看到自己的臉)'
        >
          <UploadDialog
            title='上傳大頭貼'
            description='請貼上大頭貼網址'
            placeholder='https://tipx.sao-x.com/avatar.jpg'
            value={avatar}
            onChange={setAvatar}
            onSave={handleAvatar}
          />
        </SettingItem>

        <SettingItem icon={IconPhoto} iconColor='stroke-amber-500' label='橫幅'>
          <UploadDialog
            title='上傳橫幅'
            description='請貼上橫幅網址'
            placeholder='https://tipx.sao-x.com/banner.jpg'
            value={banner}
            onChange={setBanner}
            onSave={handleBanner}
          />
        </SettingItem>

        <SettingItem icon={IconTrash} iconColor='stroke-gray-500' label='清除快取'>
          <Button onClick={clearCache} variant='destructive'>
            <IconTrash />
          </Button>
        </SettingItem>
      </div>
    </>
  )
}

export default SettingsPage
