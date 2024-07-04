import type { Metadata, Viewport } from "next"

import { site } from "@/config/site"

import "./custom.css"
import "./globals.css"

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
    images: "/img/og.png"
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
        alt: "TIPX"
      }
    ]
  },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png"
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png"
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png"
    },
    {
      rel: "mask-icon",
      color: "#ff6800",
      url: "/safari-pinned-tab.svg"
    }
  ]
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#040102" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" }
  ]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-Hant-TW' className=''>
      <body>{children}</body>
    </html>
  )
}
