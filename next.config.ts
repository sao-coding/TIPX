import type { NextConfig } from 'next'

import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public'
})
// // TIP SSL 憑證壞掉
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'tipfile.takming.edu.tw'
      }
    ]
  },
  serverExternalPackages: ['@takumi-rs/core']
}

export default withPWA(nextConfig)
