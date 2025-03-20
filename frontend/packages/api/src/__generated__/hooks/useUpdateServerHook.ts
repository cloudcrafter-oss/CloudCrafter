import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { UpdateServerMutationRequest, UpdateServerMutationResponse, UpdateServerPathParams } from '../types/UpdateServer'
import type { UseMutationOptions } from '@tanstack/react-query'
import { updateServer } from '../axios-backend/updateServer'
import { useMutation } from '@tanstack/react-query'

export const updateServerMutationKey = () => [{ url: '/api/Servers/{id}' }] as const

export type UpdateServerMutationKey = ReturnType<typeof updateServerMutationKey>

/**
 * {@link /api/Servers/:id}
 */
export function useUpdateServerHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      UpdateServerMutationResponse,
      ResponseErrorConfig<Error>,
      { id: UpdateServerPathParams['id']; data?: UpdateServerMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<UpdateServerMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? updateServerMutationKey()

  return useMutation<
    UpdateServerMutationResponse,
    ResponseErrorConfig<Error>,
    { id: UpdateServerPathParams['id']; data?: UpdateServerMutationRequest },
    TContext
  >({
    mutationFn: async ({ id, data }) => {
      return updateServer(id, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}