import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

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
                <Container>
                    {children}
                    {modal}
                </Container>
                <Footer />
            </body>
        </html>
    )
}
