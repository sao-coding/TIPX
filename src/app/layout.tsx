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
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "TIP",
    description: "學生資訊系統",
    manifest: "/pwa/manifest.json",
    themeColor: "#f8fafc",
    appleWebApp: true,
    icons: [
        {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            url: "/favicon-32x32.png",
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            url: "/favicon-16x16.png",
        },
        {
            rel: "apple-touch-icon",
            sizes: "180x180",
            url: "/apple-touch-icon.png",
        },
        {
            rel: "mask-icon",
            color: "#ff6800",
            url: "/safari-pinned-tab.svg",
        },
    ],
}

export default async function RootLayout({
    children,
    modal,
}: {
    children: React.ReactNode
    modal: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <html lang='zh-hant-TW'>
            <head>
                <InfoLog />
                <GoogleAnalytics />
                <UmamiAnalytics />
                {/* <GoogleAdsense /> */}
            </head>
            <body className={inter.className}>
                <Toaster />
                <Header />
                <Container>
                    <Providers session={session}>
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
