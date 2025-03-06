/** @type {import('next').NextConfig} */

import withPWAInit from '@ducanh2912/next-pwa'
import createNextIntlPlugin from 'next-intl/plugin'

const withPWA = withPWAInit({
  dest: 'public'
})

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'tipfile.takming.edu.tw'
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['fontmin']
  },
  transpilePackages: ['swagger-ui-react', 'swagger-client', 'react-syntax-highlighter']
}

const withNextIntl = createNextIntlPlugin()
export default withPWA(withNextIntl(nextConfig))
