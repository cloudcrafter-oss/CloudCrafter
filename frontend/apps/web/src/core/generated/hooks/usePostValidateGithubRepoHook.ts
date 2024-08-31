import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import type {
	PostValidateGithubRepoMutationRequest,
	PostValidateGithubRepoMutationResponse,
} from '../types/PostValidateGithubRepo'

type PostValidateGithubRepoClient = typeof client<
	PostValidateGithubRepoMutationResponse,
	never,
	PostValidateGithubRepoMutationRequest
>
type PostValidateGithubRepo = {
	data: PostValidateGithubRepoMutationResponse
	error: never
	request: PostValidateGithubRepoMutationRequest
	pathParams: never
	queryParams: never
	headerParams: never
	response: PostValidateGithubRepoMutationResponse
	client: {
		parameters: Partial<Parameters<PostValidateGithubRepoClient>[0]>
		return: Awaited<ReturnType<PostValidateGithubRepoClient>>
	}
}
/**
 * @link /api/Utils/validate-git-repository
 */
export function usePostValidateGithubRepoHook(
	options: {
		mutation?: UseMutationOptions<
			PostValidateGithubRepo['response'],
			PostValidateGithubRepo['error'],
			PostValidateGithubRepo['request']
		>
		client?: PostValidateGithubRepo['client']['parameters']
	} = {},
) {
	const { mutation: mutationOptions, client: clientOptions = {} } =
		options ?? {}
	return useMutation({
		mutationFn: async (data) => {
			const res = await client<
				PostValidateGithubRepo['data'],
				PostValidateGithubRepo['error'],
				PostValidateGithubRepo['request']
			>({
				method: 'post',
				url: '/api/Utils/validate-git-repository',
				data,
				...clientOptions,
			})
			return res.data
		},
		...mutationOptions,
	})
}
