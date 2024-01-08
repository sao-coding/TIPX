"use client"

import { ThemeProvider } from "next-themes"
import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { Session } from "next-auth"
import getIP from "@/utils/ip"

const Providers = ({
    children,
    session,
}: {
    children: React.ReactNode
    session: Session | null
}) => {
    const [queryClient] = useState(() => new QueryClient())
    const pathname = usePathname()

    useEffect(() => {
        const writeLog = async () => {
            await fetch("/api/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip: await getIP(),
                    stuID: session?.user.studentID,
                    name: session?.user.name,
                    path: pathname,
                }),
            })
        }
        if (session?.user.name) {
            writeLog()
        }
    }, [pathname])

    // // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    // if (
    //     localStorage.theme === "dark" ||
    //     (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    // ) {
    //     document.documentElement.classList.add("dark")
    // } else {
    //     document.documentElement.classList.remove("dark")
    // }

    // // Whenever the user explicitly chooses light mode
    // localStorage.theme = "light"

    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = "dark"

    // // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem("theme")

    useEffect(() => {
        console.log(
            "是否為暗黑模式",
            localStorage.theme === "dark" ||
                (!("theme" in localStorage) &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)
        )
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [])

    return (
        <ThemeProvider attribute='class' disableTransitionOnChange>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ThemeProvider>
    )
}

export default Providers
