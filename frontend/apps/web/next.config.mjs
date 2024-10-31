/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@repo/ui'],
	output: 'standalone',
	trailingSlash: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
}

export default nextConfig
