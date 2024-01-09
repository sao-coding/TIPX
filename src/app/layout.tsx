import "@/app/globals.css"
import "@/app/custom.css"
import { Analytics } from "@vercel/analytics/react"
import GoogleAnalytics from "@/app/GoogleAnalytics"
import UmamiAnalytics from "@/app/UmamiAnalytics"
// import GoogleAdsense from "@/app/GoogleAdsense"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Providers from "@/app/providers"
import Header from "@/components/Header"
import Container from "@/components/Container"
import Toaster from "@/components/Toaster"
import InfoLog from "@/app/info"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import "@/app/loaderCat.css"
import { site } from "@/config/site"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: "TIPX",
    description: "學生資訊系統",
    manifest: "/pwa/manifest.json",
    appleWebApp: true,
    twitter: {
        card: "summary_large_image",
        site: "@tipx",
        title: "TIPX",
        description: "學生資訊系統",
        images: "/img/og.png",
    },
    openGraph: {
        type: "website",
        locale: "zh_TW",
        url: site.url,
        images: [
            {
                url: "/img/og.png",
                width: 1200,
                height: 630,
                alt: "TIPX",
            },
        ],
    },
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

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#040102" },
        { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
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
                <Providers session={session}>
                    <Toaster />
                    <Header />
                    <Container>
                        {children}
                        {modal}
                    </Container>
                    <Analytics />
                </Providers>
            </body>
        </html>
    )
}
