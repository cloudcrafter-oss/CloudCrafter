import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

const authTag = 'CloudCrafterAuthTag'

export default defineConfig({
	root: '.',
	input: {
		path: 'http://backend-7f000001.nip.io/openapi/v1.json',
	},
	output: {
		path: './src/__generated__',
		clean: true,
		extension: {
			'.ts': '',
		},
	},
	plugins: [
		pluginOas(),
		pluginZod({
			output: {
				path: './zod',
			},
		}),
		pluginClient({
			output: {
				path: './axios-backend',
			},
			exclude: [
				{
					type: 'tag',
					pattern: authTag,
				},
			],
			importPath: '@cloudcrafter/api/client',
		}),
		pluginClient({
			output: {
				path: './no-custom-clients',
			},
			include: [
				{
					type: 'tag',
					pattern: authTag,
				},
			],
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
			exclude: [
				{
					type: 'tag',
					pattern: authTag,
				},
			],
			output: {
				path: './hooks',
				// banner:
				// 	'// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters',
			},
			infinite: false,
		}),
	],
})
