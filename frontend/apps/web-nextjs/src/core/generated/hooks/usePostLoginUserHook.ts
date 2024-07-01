import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { PostLoginUserMutationRequest, PostLoginUserMutationResponse } from '../types/PostLoginUser'
import type { UseMutationOptions } from '@tanstack/react-query'

 type PostLoginUserClient = typeof client<PostLoginUserMutationResponse, never, PostLoginUserMutationRequest>;
type PostLoginUser = {
    data: PostLoginUserMutationResponse;
    error: never;
    request: PostLoginUserMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: PostLoginUserMutationResponse;
    client: {
        parameters: Partial<Parameters<PostLoginUserClient>[0]>;
        return: Awaited<ReturnType<PostLoginUserClient>>;
    };
};
/**
 * @link /api/Auth
 */
export function usePostLoginUserHook(options: {
    mutation?: UseMutationOptions<PostLoginUser['response'], PostLoginUser['error'], PostLoginUser['request']>;
    client?: PostLoginUser['client']['parameters'];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {}
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<PostLoginUser['data'], PostLoginUser['error'], PostLoginUser['request']>({
                method: 'post',
                url: '/api/Auth',
                data,
                ...clientOptions
            })
            return res.data
        },
        ...mutationOptions
    })
}