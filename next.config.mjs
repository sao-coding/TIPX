/** @type {import('next').NextConfig} */

import withPWAInit from '@ducanh2912/next-pwa'

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

export default withPWA(nextConfig)
