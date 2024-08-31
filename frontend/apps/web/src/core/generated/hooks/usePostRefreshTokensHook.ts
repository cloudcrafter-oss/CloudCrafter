import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import type {
	PostRefreshTokensMutationRequest,
	PostRefreshTokensMutationResponse,
} from '../types/PostRefreshTokens'

type PostRefreshTokensClient = typeof client<
	PostRefreshTokensMutationResponse,
	never,
	PostRefreshTokensMutationRequest
>
type PostRefreshTokens = {
	data: PostRefreshTokensMutationResponse
	error: never
	request: PostRefreshTokensMutationRequest
	pathParams: never
	queryParams: never
	headerParams: never
	response: PostRefreshTokensMutationResponse
	client: {
		parameters: Partial<Parameters<PostRefreshTokensClient>[0]>
		return: Awaited<ReturnType<PostRefreshTokensClient>>
	}
}
/**
 * @link /api/Auth/refresh
 */
export function usePostRefreshTokensHook(
	options: {
		mutation?: UseMutationOptions<
			PostRefreshTokens['response'],
			PostRefreshTokens['error'],
			PostRefreshTokens['request']
		>
		client?: PostRefreshTokens['client']['parameters']
	} = {},
) {
	const { mutation: mutationOptions, client: clientOptions = {} } =
		options ?? {}
	return useMutation({
		mutationFn: async (data) => {
			const res = await client<
				PostRefreshTokens['data'],
				PostRefreshTokens['error'],
				PostRefreshTokens['request']
			>({
				method: 'post',
				url: '/api/Auth/refresh',
				data,
				...clientOptions,
			})
			return res.data
		},
		...mutationOptions,
	})
}
