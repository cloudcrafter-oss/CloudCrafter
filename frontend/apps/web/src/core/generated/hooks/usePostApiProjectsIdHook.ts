import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { PostApiProjectsIdMutationRequest, PostApiProjectsIdMutationResponse, PostApiProjectsIdPathParams } from '../types/PostApiProjectsId'
import type { UseMutationOptions } from '@tanstack/react-query'

 type PostApiProjectsIdClient = typeof client<PostApiProjectsIdMutationResponse, never, PostApiProjectsIdMutationRequest>;
type PostApiProjectsId = {
    data: PostApiProjectsIdMutationResponse;
    error: never;
    request: PostApiProjectsIdMutationRequest;
    pathParams: PostApiProjectsIdPathParams;
    queryParams: never;
    headerParams: never;
    response: PostApiProjectsIdMutationResponse;
    client: {
        parameters: Partial<Parameters<PostApiProjectsIdClient>[0]>;
        return: Awaited<ReturnType<PostApiProjectsIdClient>>;
    };
};
/**
 * @link /api/Projects/:id
 */
export function usePostApiProjectsIdHook(id: PostApiProjectsIdPathParams['id'], options: {
    mutation?: UseMutationOptions<PostApiProjectsId['response'], PostApiProjectsId['error'], PostApiProjectsId['request']>;
    client?: PostApiProjectsId['client']['parameters'];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {}
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<PostApiProjectsId['data'], PostApiProjectsId['error'], PostApiProjectsId['request']>({
                method: 'post',
                url: `/api/Projects/${id}`,
                data,
                ...clientOptions
            })
            return res.data
        },
        ...mutationOptions
    })
}