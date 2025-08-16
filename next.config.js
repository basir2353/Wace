/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "emsqnkazbvyyrfgnnjgu.supabase.co",
      },
      {
        hostname: "uiwdasoqahsxuscthvsa.supabase.co",
      },
      {
        hostname: "source.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
