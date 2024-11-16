import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginClient } from '@kubb/plugin-client'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
	root: '.',
	input: {
		path: 'http://backend-7f000001.nip.io/openapi/v1.json',
	},
	output: {
		path: './src/core/__generated__',
		clean: true,
	},
	// hooks: {
	// 	done: [
	// 		'node src/utils/kubb/post-action.js',
	// 		'node src/utils/kubb/get-signal-types.js',
	// 	],
	// },
	plugins: [
        pluginOas(),
		pluginZod({
			output: {
				path: './zod',
			},
            
			// mapper: {
			// 	productName: 'z.string().uuid()',
			// },
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
            importPath: '../../backend/client.ts'
			// client: { importPath: '../../backend/client.ts' },
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
			// client: { importPath: '../../backend/non-auth-client.ts' },
		}),
		pluginTs(),
		pluginReactQuery({
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
                banner: '// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters'
			},
			infinite: {},
		}),
	],
})
