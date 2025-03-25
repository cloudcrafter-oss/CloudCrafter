import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

// We have this key here because the API clients dont need to rely on this one
// But the client-auth does
const cloudCrafterAuthKey = 'CloudCrafterAuth'

export const authConfiguration: Parameters<typeof defineConfig>[0] =
	defineConfig({
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
				include: [
					{
						type: 'tag',
						pattern: cloudCrafterAuthKey,
					},
				],
				importPath: '@cloudcrafter/client-auth/clients',
			}),
			pluginTs(),
		],
	})

export const apiConfiguration: Parameters<typeof defineConfig>[0] =
	defineConfig({
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
						pattern: cloudCrafterAuthKey,
					},
				],
				importPath: '@cloudcrafter/client-auth/clients',
			}),
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
						pattern: cloudCrafterAuthKey,
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
