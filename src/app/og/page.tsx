"use client"
import { useCallback, useRef } from "react"
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
      <div className='absolute left-0 top-20 h-[630px] w-[1200px]'>
        <div
          ref={ref}
          className='flex h-full w-full flex-col items-center justify-center px-14 py-12 text-white'
          style={{
            background: "linear-gradient(to top left, #EECDA3, #daa3f7, #fdb99b)"
          }}
        >
          <IconUserHexagon className='flex h-40 w-40' />
          <div className='text-5xl' style={{ fontFamily: "Short Stack" }}>
            TIPX
          </div>
        </div>
      </div>
      <button className='z-10 mt-[630px] bg-main-color-2 px-2 py-1' onClick={onButtonClick}>
        生成OG圖
      </button>
    </>
  )
}

export default Test
