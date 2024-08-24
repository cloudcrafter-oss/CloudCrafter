import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { UpdateProjectMutationRequest, UpdateProjectMutationResponse, UpdateProjectPathParams } from '../types/UpdateProject'
import type { UseMutationOptions } from '@tanstack/react-query'

 type UpdateProjectClient = typeof client<UpdateProjectMutationResponse, never, UpdateProjectMutationRequest>;
type UpdateProject = {
    data: UpdateProjectMutationResponse;
    error: never;
    request: UpdateProjectMutationRequest;
    pathParams: UpdateProjectPathParams;
    queryParams: never;
    headerParams: never;
    response: UpdateProjectMutationResponse;
    client: {
        parameters: Partial<Parameters<UpdateProjectClient>[0]>;
        return: Awaited<ReturnType<UpdateProjectClient>>;
    };
};
/**
 * @link /api/Projects/:id
 */
export function useUpdateProjectHook(id: UpdateProjectPathParams['id'], options: {
    mutation?: UseMutationOptions<UpdateProject['response'], UpdateProject['error'], UpdateProject['request']>;
    client?: UpdateProject['client']['parameters'];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {}
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<UpdateProject['data'], UpdateProject['error'], UpdateProject['request']>({
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