/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucuxqykyinvpakuyhzps.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Adding Clerk image domain
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
