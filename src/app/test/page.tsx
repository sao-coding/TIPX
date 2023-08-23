"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import { toPng } from "html-to-image"
import Cookie from "js-cookie"
import { IconHome, IconBook2, IconCalendarEvent, IconUser, Icon } from "@tabler/icons-react"

const Test: React.FC = () => {
    const [data, setData] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/test", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + Cookie.get("token"),
                },
            })
            const data = await res.text()
            setData(data)
        }
        fetchData()
    }, [])

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
            <div ref={ref}>
                <div className='flex items-center space-x-4'>
                    <div className='flex items-center justify-center rounded-full bg-black p-1'>
                        <IconHome size={184} className='stroke-white' />
                    </div>
                    <div className='flex items-center justify-center rounded-full bg-black p-1'>
                        <IconBook2 size={184} className='stroke-white' />
                    </div>
                    <div className='flex items-center justify-center rounded-full bg-black p-1'>
                        <IconCalendarEvent size={184} className='stroke-white' />
                    </div>
                    <div className='flex items-center justify-center rounded-full bg-black p-1'>
                        <IconUser size={184} className='stroke-white' />
                    </div>
                </div>
                <iframe srcDoc={data} className='h-screen w-full' />
            </div>
            <button onClick={onButtonClick}>Click me</button>
        </>
    )
}

export default Test
