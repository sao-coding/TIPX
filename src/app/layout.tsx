import "@/app/globals.css"
import { Analytics } from "@vercel/analytics/react"
import GoogleAnalytics from "@/app/GoogleAnalytics"
import UmamiAnalytics from "@/app/UmamiAnalytics"
import GoogleAdsense from "@/app/GoogleAdsense"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Providers from "@/app/providers"
import Header from "@/components/Header"
import Container from "@/components/Container"
import Footer from "@/components/Footer"
import Toaster from "@/components/Toaster"
import InfoLog from "@/app/info"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "TIP",
    description: "學生資訊系統",
    manifest: "/pwa/manifest.json",
    themeColor: "#f8fafc",
    appleWebApp: true,
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
            <head>
                <InfoLog />
                <link rel='apple-touch-icon' href='/pwa/maskable_icon.png' />
                <GoogleAnalytics />
                <UmamiAnalytics />
                {/* <GoogleAdsense /> */}
            </head>
            <body className={inter.className}>
                <Toaster />
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
