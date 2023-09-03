"use client"
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

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default Providers
