import client from '@kubb/swagger-client/client'
import { useMutation } from '@tanstack/react-query'
import type { GetUsersMutationRequest, GetUsersMutationResponse } from '../types/GetUsers'
import type { UseMutationOptions } from '@tanstack/react-query'

 type GetUsersClient = typeof client<GetUsersMutationResponse, never, GetUsersMutationRequest>;
type GetUsers = {
    data: GetUsersMutationResponse;
    error: never;
    request: GetUsersMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetUsersMutationResponse;
    client: {
        parameters: Partial<Parameters<GetUsersClient>[0]>;
        return: Awaited<ReturnType<GetUsersClient>>;
    };
};
/**
 * @link /api/Users
 */
export function useGetUsersHook(options: {
    mutation?: UseMutationOptions<GetUsers['response'], GetUsers['error'], GetUsers['request']>;
    client?: GetUsers['client']['parameters'];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {}
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<GetUsers['data'], GetUsers['error'], GetUsers['request']>({
                method: 'post',
                url: '/api/Users',
                data,
                ...clientOptions
            })
            return res.data
        },
        ...mutationOptions
    })
}