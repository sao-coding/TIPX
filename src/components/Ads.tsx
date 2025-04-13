'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[]
  }
}

type AdsProps = {
  className?: string
  dataAdFormat: string
  dataAdLayoutKey: string
  dataAdClient: string
  dataAdSlot: string
}

const Ads = (adsProps: AdsProps) => {
  const { className, dataAdFormat, dataAdLayoutKey, dataAdClient, dataAdSlot } = adsProps
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
    <div className={className} ref={adRef}>
      <ins
        className='adsbygoogle'
        style={{ display: 'block' }}
        data-ad-format={dataAdFormat}
        data-ad-layout-key={dataAdLayoutKey}
        data-ad-client={dataAdClient}
        data-ad-slot={dataAdSlot}
      />
    </div>
  )
}

export default Ads
