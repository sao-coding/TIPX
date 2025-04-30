'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Artalk from 'artalk'

import Title from '@/components/Title'
import LoadingUI from '@/components/ui/Loading'

import 'artalk/dist/Artalk.css'

const ArtalkComment = () => {
  const [Loading, setLoading] = React.useState(true)
  const container = React.useRef<HTMLDivElement>(null)
  const artalk = React.useRef<Artalk | null>(null)
  const pathname = usePathname()

  React.useEffect(() => {
    // 設定 artalk 黑暗模式 如果 localStorage 有是 system 則跟隨系統設定 若是 dark 則強制黑暗模式 若是 light 則強制白天模式
    let theme
    if (localStorage.getItem('theme') === 'dark') {
      theme = true
    } else if (localStorage.getItem('theme') === 'light') {
      theme = false
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = true
      } else {
        theme = false
      }
    }

    artalk.current = Artalk.init({
      el: container.current!,
      pageKey: pathname,
      pageTitle: '留言板',
      server: 'https://artalk.sao-x.com',
      site: 'TIPX',
      darkMode: theme
    })

    setLoading(false)

    return () => {
      artalk.current?.destroy()
    }
  }, [container, pathname])

  const titleData = {
    title: '留言區',
    children: ''
  }

  return (
    <>
      <Title {...titleData} />
      {Loading && <LoadingUI />}
      <div ref={container} />
    </>
  )
}

export default ArtalkComment
