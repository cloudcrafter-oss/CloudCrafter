/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@repo/ui'],
	trailingSlash: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
}

export default nextConfig
