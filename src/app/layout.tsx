import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "./providers"
import Header from "@/components/Header"
import Container from "@/components/Container"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "TIP",
    description: "學生資訊系統",
}

export default function RootLayout({
    children,
    modal,
}: {
    children: React.ReactNode
    modal: React.ReactNode
}) {
    return (
        <html lang='zh-hant-TW'>
            <body className={inter.className}>
                <Header />
                <Container>
                    <Providers>
                        {children}
                        {modal}
                    </Providers>
                </Container>
                <Footer />
                <Analytics />
            </body>
        </html>
    )
}
