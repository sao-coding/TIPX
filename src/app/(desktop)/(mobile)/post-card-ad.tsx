import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

const PostCardAd = () => {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 確保在客戶端執行
    if (typeof window !== 'undefined') {
      try {
        const adsbygoogle = window.adsbygoogle || []
        adsbygoogle.push({})
      } catch (err) {
        console.error('廣告載入失敗:', err)
      }
    }
  }, [])

  return (
    <div className='my-4 flex justify-center border-b border-background3' ref={adRef}>
      <div className='min-w-full'>
        <ins
          className='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-format='fluid'
          data-ad-layout-key='-fb+5w+4e-db+86'
          data-ad-client='ca-pub-2271001084588765'
          data-ad-slot='9510191337'
        />
      </div>
    </div>
  )
}

export default PostCardAd
