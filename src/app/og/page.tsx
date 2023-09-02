"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import { toPng } from "html-to-image"
import { IconUserHexagon } from "@tabler/icons-react"

const Test: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null)
    const onButtonClick = useCallback(() => {
        if (ref.current === null) {
            return
        }

        toPng(ref.current, { cacheBust: true })
            .then((dataUrl) => {
                const link = document.createElement("a")
                link.download = "my-image-name.png"
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }, [ref])
    return (
        <>
            <div className='absolute top-20 left-0 h-[630px] w-[1200px]'>
                <div
                    ref={ref}
                    className='h-full w-full px-14 py-12 text-white flex flex-col justify-center items-center'
                    style={{
                        background: "linear-gradient(to top left, #EECDA3, #daa3f7, #fdb99b)",
                    }}
                >
                    <IconUserHexagon className='flex w-40 h-40' />
                    <div className='text-5xl' style={{ fontFamily: "Short Stack" }}>
                        TIPX
                    </div>
                </div>
            </div>
            <button className='z-10 mt-[630px] py-1 px-2 bg-main-color-2' onClick={onButtonClick}>
                生成OG圖
            </button>
        </>
    )
}

export default Test
