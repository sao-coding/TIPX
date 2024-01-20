"use client"

import { useEffect, useState } from "react"
import clsx from "clsx"

import Title from "@/components/Title"
import { Listbox } from "@headlessui/react"
import * as Switch from "@radix-ui/react-switch"
import {
  IconBell,
  IconDeviceDesktop,
  IconMapPin,
  IconMoon,
  IconPaint,
  IconSelector,
  IconSun
} from "@tabler/icons-react"

const SettingsPage = () => {
  const [theme, setTheme] = useState("system")
  const [notification, setNotification] = useState(false)
  const [location, setLocation] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("notification") === "true") {
      setNotification(true)
    }
    if (localStorage.getItem("notification") === "false") {
      setNotification(false)
    }
    if (localStorage.getItem("location") === "true") {
      setLocation(true)
    }
    if (localStorage.getItem("location") === "false") {
      setLocation(false)
    }
  }, [])

  useEffect(() => {
    if (localStorage.theme === "dark") {
      setTheme("dark")
    } else if (localStorage.theme === "light") {
      setTheme("light")
    } else {
      setTheme("system")
    }
  }, [])

  const handleNotification = async () => {
    // 開關通知
    if (notification) {
      localStorage.setItem("notification", "false")
      setNotification(false)
    }
    if (!notification) {
      localStorage.setItem("notification", "true")
      setNotification(true)
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("通知訊息", {
          body: "您已開啟通知",
          icon: "/pwa/android-launchericon-192-192.png",
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: "notification",
          renotify: true
        })
      })

      // 註冊通知
      // 是否允許瀏覽器通知
      await Notification.requestPermission()
      if (Notification.permission === "granted") {
        setNotification(true)
      }
      if (Notification.permission === "denied") {
        setNotification(false)
      }
    }
  }

  const handleLocation = async () => {
    // 是否允許瀏覽器定位
    if (location) {
      localStorage.setItem("location", "false")
      setLocation(false)
    }
    if (!location) {
      localStorage.setItem("location", "true")
      setLocation(true)
    }

    // 註冊定位
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("position", position)
      },
      (error) => {
        console.log("error", error)
      }
    )
  }

  const title = {
    title: "設定",
    position: "text-center",
    close: true
  }

  return (
    <>
      {/* 跟隨系統 明亮模式 暗黑模式 */}
      {/* 主題 */}
      <div className='mb-2 w-full px-2'>
        <Title title={title} />
        <div className='flex flex-col gap-2 px-2'>
          <div className='relative flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <IconPaint className='stroke-pink-500' />
              <div>主題</div>
            </div>
            <Listbox
              value={theme}
              onChange={(e) => {
                setTheme(e)
                // document.documentElement.classList.add("dark")
                if (e === "dark") {
                  document.documentElement.classList.add("dark")
                  document.documentElement.classList.remove("light")
                  localStorage.setItem("theme", e)
                } else if (e === "light") {
                  document.documentElement.classList.remove("dark")
                  document.documentElement.classList.add("light")
                  localStorage.setItem("theme", e)
                } else {
                  // 跟隨系統
                  // 判斷系統主題
                  localStorage.removeItem("theme")
                  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    // 系統暗黑模式
                    document.documentElement.classList.add("dark")
                    document.documentElement.classList.remove("light")
                  } else {
                    // 系統明亮模式
                    document.documentElement.classList.remove("dark")
                    document.documentElement.classList.add("light")
                  }
                }
              }}
            >
              <Listbox.Button className='flex h-8 items-center justify-start rounded-lg bg-card-background p-1 md:border'>
                <IconSelector />
                {theme === "system" && (
                  <div className='flex items-center space-x-1'>
                    <IconDeviceDesktop />
                    <div>跟隨系統</div>
                  </div>
                )}
                {theme === "light" && (
                  <div className='flex items-center space-x-1'>
                    <IconSun className='text-orange-500' />
                    <div>明亮模式</div>
                  </div>
                )}
                {theme === "dark" && (
                  <div className='flex items-center space-x-1'>
                    <IconMoon className='text-yellow-500' />
                    <div>暗黑模式</div>
                  </div>
                )}
              </Listbox.Button>
              <Listbox.Options className='absolute right-0 top-10 z-10 flex flex-col space-y-2 rounded-lg bg-card-background p-2 shadow-md'>
                <Listbox.Option value='system'>
                  <div className='flex items-center space-x-1'>
                    <IconDeviceDesktop />
                    <div>跟隨系統</div>
                  </div>
                </Listbox.Option>
                <Listbox.Option value='light'>
                  <div className='flex items-center space-x-1'>
                    <IconSun className='text-orange-500' />
                    <div>明亮模式</div>
                  </div>
                </Listbox.Option>
                <Listbox.Option value='dark'>
                  <div className='flex items-center space-x-1'>
                    <IconMoon className='text-yellow-500' />
                    <div>暗黑模式</div>
                  </div>
                </Listbox.Option>
              </Listbox.Options>
            </Listbox>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <IconBell className='stroke-yellow-500' />
              <div className=''>通知訊息</div>
            </div>
            <div className='flex items-center space-x-2'>
              <div className={clsx("text-xs", notification ? "text-green-500" : "text-red-500")}>
                {notification ? "已開啟" : "已關閉"}
              </div>
              <Switch.Root
                className='h-6 w-11 rounded-full bg-black outline-none data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300'
                defaultChecked={notification}
                onCheckedChange={handleNotification}
                checked={notification}
              >
                <Switch.Thumb className='block h-5 w-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5' />
              </Switch.Root>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <IconMapPin className='stroke-red-500' />
              <div className=''> 天氣定位</div>
            </div>
            <div className='flex items-center space-x-2'>
              <div className={clsx("text-xs", location ? "text-green-500" : "text-red-500")}>
                {location ? "已開啟" : "已關閉"}
              </div>
              <Switch.Root
                className='h-6 w-11 rounded-full bg-black outline-none data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300'
                defaultChecked={location}
                onCheckedChange={handleLocation}
                checked={location}
              >
                <Switch.Thumb className='block h-5 w-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5' />
              </Switch.Root>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SettingsPage
