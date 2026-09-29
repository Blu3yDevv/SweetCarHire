/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow verification builds to use a separate directory from a running dev server.
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  images: {
    unoptimized: true,
  },
 
}

export default nextConfig
