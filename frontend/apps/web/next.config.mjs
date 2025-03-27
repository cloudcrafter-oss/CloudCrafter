/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@cloudcrafter/ui', '@cloudcrafter/api', 'next-auth'],
	output: 'standalone',
	trailingSlash: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
	allowedDevOrigins: ['frontend-7f000001.nip.io'],
}

export default nextConfig
