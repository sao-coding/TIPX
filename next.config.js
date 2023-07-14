/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["tipfile.takming.edu.tw"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tipfile.takming.edu.tw",
                port: "443",
                pathname: "/stuphoto/",
            },
        ],
    },
    transpilePackages: ["swagger-ui-react", "swagger-client", "react-syntax-highlighter"],
}

module.exports = nextConfig
