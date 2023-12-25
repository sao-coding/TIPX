"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { cx } from "@/lib/utils"
import { NAV_LINKS } from "@/config/links"

const Footer = () => {
    // const [prevScrollPos, setPrevScrollPos] = useState(0)
    // const [navbarHidden, setNavbarHidden] = useState(false)
    const pathname = usePathname()

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const currentScrollPos = window.scrollY

    //         if (prevScrollPos > currentScrollPos) {
    //             setNavbarHidden(false) // 往上滾動，顯示導覽列
    //         } else {
    //             setNavbarHidden(true) // 往下滾動，隱藏導覽列
    //         }

    //         setPrevScrollPos(currentScrollPos)
    //     }

    //     window.addEventListener("scroll", handleScroll, { passive: true })

    //     return () => {
    //         window.removeEventListener("scroll", handleScroll)
    //     }
    // }, [prevScrollPos])
    const click = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const btnSize = e.currentTarget.getBoundingClientRect()
        const calX = e.clientX - btnSize.x
        const calY = e.clientY - btnSize.y
        const ripple = document.createElement("span")
        ripple.className = "footer-ripple"
        ripple.style.left = calX + "px"
        ripple.style.top = calY + "px"
        e.currentTarget.append(ripple)
        setTimeout(() => ripple.remove(), 500)
    }
    return (
        <footer
            className={clsx(
                "fixed bottom-0 z-10 flex h-14 w-full items-center justify-around bg-slate-50 transition-all duration-300 md:hidden border"
                // { hidden: navbarHidden }
            )}
        >
            {NAV_LINKS.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    title={link.text}
                    className='flex items-center justify-center w-full h-full relative overflow-hidden'
                    onClick={(e) => click(e)}
                    // w-[30px] h-[30px] py-2
                >
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
                            "stroke-black/80",
                            pathname.startsWith(link.href) && link.href !== "/"
                                ? "fill-main-color-3 stroke-black stroke-2"
                                : link.href === "/" && pathname === "/"
                                  ? "fill-main-color-3 stroke-black stroke-2"
                                  : ""
                        )}
                    />
                </Link>
            ))}
        </footer>
    )
}

export default Footer
