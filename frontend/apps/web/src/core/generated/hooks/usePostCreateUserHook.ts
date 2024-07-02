import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { PostCreateUserMutationRequest, PostCreateUserMutationResponse } from '../types/PostCreateUser'
import type { UseMutationOptions } from '@tanstack/react-query'

 type PostCreateUserClient = typeof client<PostCreateUserMutationResponse, never, PostCreateUserMutationRequest>;
type PostCreateUser = {
    data: PostCreateUserMutationResponse;
    error: never;
    request: PostCreateUserMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: PostCreateUserMutationResponse;
    client: {
        parameters: Partial<Parameters<PostCreateUserClient>[0]>;
        return: Awaited<ReturnType<PostCreateUserClient>>;
    };
};
/**
 * @link /api/Auth/create
 */
export function usePostCreateUserHook(options: {
    mutation?: UseMutationOptions<PostCreateUser['response'], PostCreateUser['error'], PostCreateUser['request']>;
    client?: PostCreateUser['client']['parameters'];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {}
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<PostCreateUser['data'], PostCreateUser['error'], PostCreateUser['request']>({
                method: 'post',
                url: '/api/Auth/create',
                data,
                ...clientOptions
            })
            return res.data
        },
        ...mutationOptions
    })
}