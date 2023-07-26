"use client"
import Image, { ImageProps } from "next/image"
import { useState } from "react"
import { cx } from "@/lib/utils"

type AvatarProps = {
    src: string
    alt: string
    width: number
    height: number
    fallback: React.ReactNode
} & ImageProps

const Avatar = (props: AvatarProps) => {
    const { src, width, height, alt, fallback, className, ...rest } = props
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    return (
        <>
            {error ? (
                fallback
            ) : (
                <div className={cx("overflow-hidden", loading && "animate-pulse")}>
                    <Image
                        src={src}
                        width={width}
                        height={height}
                        sizes='fill'
                        className={cx(
                            "h-[100px] w-[75px] rounded-md object-cover shadow-md transition-[scale,filter] duration-700",
                            loading && "scale-[1.02] blur-xl grayscale",
                            className
                        )}
                        alt={alt}
                        loading='lazy'
                        onLoadingComplete={() => setLoading(false)}
                        onError={() => setError(true)}
                        {...rest}
                    />
                </div>
            )}
        </>
    )
}

export default Avatar
