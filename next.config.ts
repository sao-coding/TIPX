import type { NextConfig } from 'next'

import withPWAInit from '@ducanh2912/next-pwa'

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

export default withPWA(nextConfig)
