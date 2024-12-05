/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cloudcrafter/ui", "@cloudcrafter/api"],
  output: "standalone",
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
