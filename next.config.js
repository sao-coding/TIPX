/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["tipfile.takming.edu.tw", "avatars.githubusercontent.com"]
  },
  transpilePackages: ["swagger-ui-react", "swagger-client", "react-syntax-highlighter"]
}

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public"
})

module.exports = withPWA(nextConfig)
