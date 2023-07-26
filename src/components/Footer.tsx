"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { cx } from "@/lib/utils"
import { NAV_LINKS } from "@/config/links"

const Footer = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0)
    const [navbarHidden, setNavbarHidden] = useState(false)
    const pathname = usePathname()

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

    return (
        <div
            className={clsx(
                "fixed bottom-0 z-10 flex h-14 w-full items-center justify-around bg-main-color-3 py-2 transition-all duration-300 md:hidden",
                { hidden: navbarHidden }
            )}
        >
            {NAV_LINKS.map((link) => (
                // <NavItem key={link.href} href={link.href} icon={link.icon} />
                <Link href={link.href} key={link.href}>
                    <link.icon
                        // 如果pathname 前面的路徑是link.href 且 pathname 不是首頁
                        size={
                            pathname.startsWith(link.href) && link.href !== "/"
                                ? 30
                                : link.href === "/" && pathname === "/"
                                ? 30
                                : 26
                        }
                        // 如果pathname 前面的路徑是link.href 且 pathname 不是首頁
                        className={cx(
                            "stroke-white/80",
                            pathname.startsWith(link.href) && link.href !== "/"
                                ? "fill-white/80 stroke-black stroke-1"
                                : link.href === "/" && pathname === "/"
                                ? "fill-white/80 stroke-black stroke-1"
                                : ""
                        )}
                    />
                </Link>
            ))}
        </div>
    )
}

export default Footer
