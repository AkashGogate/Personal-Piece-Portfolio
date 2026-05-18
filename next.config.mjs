/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASEPATH ?? "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
