"use client"
import { useState, useEffect } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { init } from "@/lib/firebase"

const Providers = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        init()
    }, [])

    const [queryClient] = useState(() => new QueryClient())

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default Providers
