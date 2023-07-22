"use client"

import { useState, useEffect } from "react"
import { IconHome, IconBook2, IconCalendarEvent, IconUser } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Cookie from "js-cookie"
import clsx from "clsx"

const Footer = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0)
    const [navbarHidden, setNavbarHidden] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY

            if (prevScrollPos > currentScrollPos) {
                setNavbarHidden(false) // 往上滾動，顯示導覽列
            } else {
                setNavbarHidden(true) // 往下滾動，隱藏導覽列
            }

            setPrevScrollPos(currentScrollPos)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [prevScrollPos])

    // const checkGo = (path: string) => {
    //     const token = Cookies.get("token")
    //     if (token) {
    //         go(path)
    //     } else {
    //         go("/login")
    //     }
    // }

    return (
        <div
            className={clsx(
                "fixed bottom-0 z-10 flex h-12 w-full items-center justify-around bg-main-color-3 py-2 transition-all duration-300",
                { hidden: navbarHidden }
            )}
        >
            <Link href='/' className='flex flex-col items-center justify-center'>
                <IconHome />
                {/* <div className='mt-1'>首頁</div> */}
            </Link>
            <Link href='/timetable' className='flex flex-col items-center justify-center'>
                <IconCalendarEvent />
                {/* <div className='mt-1'>課表</div> */}
            </Link>
            <Link href='/course' className='flex flex-col items-center justify-center'>
                <IconBook2 />
                {/* <div className='mt-1'>修課</div> */}
            </Link>
            <Link href='/user' className='flex flex-col items-center justify-center'>
                <IconUser />
                {/* <div className='mt-1'>個人</div> */}
            </Link>
        </div>
    )
}

export default Footer
