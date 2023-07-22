/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["tipfile.takming.edu.tw", "avatars.githubusercontent.com"],
    },
    transpilePackages: ["swagger-ui-react", "swagger-client", "react-syntax-highlighter"],
}

module.exports = nextConfig
