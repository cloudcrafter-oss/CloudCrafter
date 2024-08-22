import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { PostCreateDeploymentMutationResponse, PostCreateDeploymentPathParams } from '../types/PostCreateDeployment'
import type { UseMutationOptions } from '@tanstack/react-query'

 type PostCreateDeploymentClient = typeof client<PostCreateDeploymentMutationResponse, never, never>;
type PostCreateDeployment = {
    data: PostCreateDeploymentMutationResponse;
    error: never;
    request: never;
    pathParams: PostCreateDeploymentPathParams;
    queryParams: never;
    headerParams: never;
    response: PostCreateDeploymentMutationResponse;
    client: {
        parameters: Partial<Parameters<PostCreateDeploymentClient>[0]>;
        return: Awaited<ReturnType<PostCreateDeploymentClient>>;
    };
};
/**
 * @link /api/Applications/:applicationId/deployment
 */
export function usePostCreateDeploymentHook(applicationId: PostCreateDeploymentPathParams['applicationId'], options: {
    mutation?: UseMutationOptions<PostCreateDeployment['response'], PostCreateDeployment['error'], PostCreateDeployment['request']>;
    client?: PostCreateDeployment['client']['parameters'];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {}
    return useMutation({
        mutationFn: async () => {
            const res = await client<PostCreateDeployment['data'], PostCreateDeployment['error'], PostCreateDeployment['request']>({
                method: 'post',
                url: `/api/Applications/${applicationId}/deployment`,
                ...clientOptions
            })
            return res.data
        },
        ...mutationOptions
    })
}