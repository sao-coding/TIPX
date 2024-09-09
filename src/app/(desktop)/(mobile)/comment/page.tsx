'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Artalk from 'artalk'

import 'artalk/dist/Artalk.css'

const ArtalkComment = () => {
  const container = React.useRef<HTMLDivElement>(null)
  const artalk = React.useRef<Artalk>()
  const pathname = usePathname()

  React.useEffect(() => {
    artalk.current = Artalk.init({
      el: container.current!,
      pageKey: pathname,
      pageTitle: '留言板',
      server: 'https://artalk.sao-x.com',
      site: 'TIPX'
      // ...
    })

    // 設定 artalk 黑暗模式 如果 localStorage 有是 system 則跟隨系統設定 若是 dark 則強制黑暗模式 若是 light 則強制白天模式
    const theme = localStorage.getItem('theme')
    switch (theme) {
      case 'dark':
        artalk.current.setDarkMode(true)
        break
      case 'light':
        artalk.current.setDarkMode(false)
        break
      default:
        // 系統判斷目前是否為黑暗模式
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          artalk.current.setDarkMode(true)
        } else {
          artalk.current.setDarkMode(false)
        }
        break
    }

    return () => {
      artalk.current?.destroy()
    }
  }, [container, pathname])

  return <div ref={container}></div>
}

export default ArtalkComment
