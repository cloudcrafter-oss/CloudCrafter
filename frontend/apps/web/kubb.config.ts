import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginClient } from '@kubb/swagger-client'
import { pluginTanstackQuery } from '@kubb/swagger-tanstack-query'
import { pluginTs } from '@kubb/swagger-ts'
import { pluginZod } from '@kubb/swagger-zod'

export default defineConfig({
	root: '.',
	input: {
		path: 'http://web.127.0.0.1.sslip.io/swagger/v1/swagger.json',
	},
	output: {
		path: './src/core/__generated__',
		clean: true,
	},
	hooks: {
		done: [
			'node src/utils/kubb/post-action.js',
			'node src/utils/kubb/get-signal-types.js',
		],
	},
	plugins: [
		pluginOas({ output: false }),
		pluginZod({
			output: {
				path: './zod',
			},
			mapper: {
				productName: 'z.string().uuid()',
			},
		}),
		pluginClient({
			output: {
				path: './axios-backend',
			},
			exclude: [
				{
					type: 'tag',
					pattern: 'cloudCrafterAuthTest',
				},
			],
			client: { importPath: '../../backend/client.ts' },
		}),
		pluginClient({
			output: {
				path: './non-auth-axios',
			},
			include: [
				{
					type: 'tag',
					pattern: 'cloudCrafterAuthTest',
				},
			],
			client: { importPath: '../../backend/non-auth-client.ts' },
		}),
		pluginTs(),
		pluginTanstackQuery({
			transformers: {
				name: (name, type) => {
					if (type === 'file' || type === 'function') {
						return `${name}Hook`
					}
					return name
				},
			},
			client: {
				importPath: '../../frontend/client.ts',
			},
			output: {
				path: './hooks',
			},
			framework: 'react',
			infinite: {},
		}),
	],
})
