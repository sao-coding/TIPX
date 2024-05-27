"use client"

import React from "react"
import clsx from "clsx"
import toast from "react-hot-toast"

import { init } from "@/lib/firebase"
import * as Switch from "@radix-ui/react-switch"
import { IconBell } from "@tabler/icons-react"

const Notify = () => {
  const [notification, setNotification] = React.useState(false)

  React.useEffect(() => {
    if (localStorage.getItem("notification") === "true") {
      setNotification(true)
    }
    if (localStorage.getItem("notification") === "false") {
      setNotification(false)
    }
  }, [])

  const isIOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return /iphone|ipad|ipod/.test(userAgent)
  }

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
        } as NotificationOptions) // Add 'as NotificationOptions' to specify the type
      })

      // 註冊通知
      // 是否允許瀏覽器通知
      await Notification.requestPermission()
      if (Notification.permission === "granted") {
        setNotification(true)
        init()
      }
      if (Notification.permission === "denied") {
        setNotification(false)
        if (isIOS()) {
          toast.error("Apple 裝置請加入主畫面使用")
        }
      }
    }
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-2'>
        <IconBell className='stroke-yellow-500' />
        <div>通知訊息</div>
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
  )
}

export default Notify
