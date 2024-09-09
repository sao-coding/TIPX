'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import 'artalk/dist/Artalk.css'
import Artalk from 'artalk'

const ArtalkComment = () => {
  const container = React.useRef<HTMLDivElement>(null)
  const artalk = React.useRef<Artalk>()
  const pathname = usePathname()

  React.useEffect(() => {
    artalk.current = Artalk.init({
      el: container.current!,
      pageKey: pathname,
      pageTitle: '留言板',
      server: 'http://artalk.sao-x.com',
      site: 'TIPX',
      // ...
    })

    return () => {
      artalk.current?.destroy()
    }
  }, [container, pathname])

  return <div ref={container}></div>
}

export default ArtalkComment