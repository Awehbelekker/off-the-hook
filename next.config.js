/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "offthehook.co.za" },
      { protocol: "https", hostname: "api.vula.co.za" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/images/logo.svg", permanent: false },
    ]
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
}

module.exports = nextConfig
