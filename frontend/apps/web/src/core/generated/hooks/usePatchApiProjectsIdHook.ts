import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { PatchApiProjectsIdMutationRequest, PatchApiProjectsIdMutationResponse, PatchApiProjectsIdPathParams } from '../types/PatchApiProjectsId'
import type { UseMutationOptions } from '@tanstack/react-query'

 type PatchApiProjectsIdClient = typeof client<PatchApiProjectsIdMutationResponse, never, PatchApiProjectsIdMutationRequest>;
type PatchApiProjectsId = {
    data: PatchApiProjectsIdMutationResponse;
    error: never;
    request: PatchApiProjectsIdMutationRequest;
    pathParams: PatchApiProjectsIdPathParams;
    queryParams: never;
    headerParams: never;
    response: PatchApiProjectsIdMutationResponse;
    client: {
        parameters: Partial<Parameters<PatchApiProjectsIdClient>[0]>;
        return: Awaited<ReturnType<PatchApiProjectsIdClient>>;
    };
};
/**
 * @link /api/Projects/:id
 */
export function usePatchApiProjectsIdHook(id: PatchApiProjectsIdPathParams['id'], options: {
    mutation?: UseMutationOptions<PatchApiProjectsId['response'], PatchApiProjectsId['error'], PatchApiProjectsId['request']>;
    client?: PatchApiProjectsId['client']['parameters'];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {}
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<PatchApiProjectsId['data'], PatchApiProjectsId['error'], PatchApiProjectsId['request']>({
                method: 'patch',
                url: `/api/Projects/${id}`,
                data,
                ...clientOptions
            })
            return res.data
        },
        ...mutationOptions
    })
}