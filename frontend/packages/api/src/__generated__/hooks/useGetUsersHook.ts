import client from '@cloudcrafter/api/client'
import type { GetUsersMutationRequest, GetUsersMutationResponse } from '../types/GetUsers'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { getUsers } from '../axios-backend/getUsers'
import { useMutation } from '@tanstack/react-query'

export const getUsersMutationKey = () => [{ url: '/api/Users' }] as const

export type GetUsersMutationKey = ReturnType<typeof getUsersMutationKey>

/**
 * {@link /api/Users}
 */
export function useGetUsersHook<TContext>(
  options: {
    mutation?: UseMutationOptions<GetUsersMutationResponse, ResponseErrorConfig<Error>, { data: GetUsersMutationRequest }, TContext>
    client?: Partial<RequestConfig<GetUsersMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? getUsersMutationKey()

  return useMutation<GetUsersMutationResponse, ResponseErrorConfig<Error>, { data: GetUsersMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return getUsers(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}