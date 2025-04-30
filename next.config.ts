import type { NextConfig } from 'next'
import withPWAInit from '@ducanh2912/next-pwa'
import createNextIntlPlugin from 'next-intl/plugin'

const withPWA = withPWAInit({
  dest: 'public'
})

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'tipfile.takming.edu.tw'
      }
    ]
  },
  serverExternalPackages: ['fontmin']
}

const withNextIntl = createNextIntlPlugin()
export default withPWA(withNextIntl(nextConfig))
