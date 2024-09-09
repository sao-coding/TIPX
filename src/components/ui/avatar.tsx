'use client'

import React from 'react'

// import Image, { ImageProps } from "next/image"
import { cn } from '@/lib/utils'

type AvatarProps = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallback: React.ReactNode
}
// & ImageProps

const Avatar = (props: AvatarProps) => {
  const { src, width, height, alt, fallback, className, ...rest } = props
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  const imageRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    if (imageRef.current?.complete) {
      setLoading(false)
    }
  }, [])

  // React.useEffect(() => {
  //   console.log('Loading:', loading)
  //   console.log('Error:', error)
  // }, [loading, error])

  return (
    <>
      {error ? (
        fallback
      ) : (
        <div className={cn(loading && 'animate-pulse')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src}
            width={width}
            height={height}
            sizes='fill'
            className={cn(
              'h-[100px] w-[75px] rounded-md object-cover transition-[scale,filter] duration-700',
              loading && 'scale-[1.02] blur-xl grayscale',
              className
            )}
            alt={alt}
            loading='lazy'
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
            {...rest}
          />
        </div>
      )}
    </>
  )
}

export default Avatar
