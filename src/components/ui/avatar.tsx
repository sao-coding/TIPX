'use client'
// import Image, { ImageProps } from "next/image"
import { useEffect, useRef, useState } from 'react'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageRef.current?.complete) {
      setLoading(false)
    }
  }, [])

  // useEffect(() => {
  //   console.log("Loading:", loading)
  //   console.log("Error:", error)
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
