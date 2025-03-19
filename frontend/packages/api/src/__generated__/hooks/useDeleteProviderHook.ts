import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { DeleteProviderMutationResponse, DeleteProviderPathParams } from '../types/DeleteProvider'
import type { UseMutationOptions } from '@tanstack/react-query'
import { deleteProvider } from '../axios-backend/deleteProvider'
import { useMutation } from '@tanstack/react-query'

export const deleteProviderMutationKey = () => [{ url: '/api/Providers/{id}' }] as const

export type DeleteProviderMutationKey = ReturnType<typeof deleteProviderMutationKey>

/**
 * {@link /api/Providers/:id}
 */
export function useDeleteProviderHook<TContext>(
  options: {
    mutation?: UseMutationOptions<DeleteProviderMutationResponse, ResponseErrorConfig<Error>, { id: DeleteProviderPathParams['id'] }, TContext>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteProviderMutationKey()

  return useMutation<DeleteProviderMutationResponse, ResponseErrorConfig<Error>, { id: DeleteProviderPathParams['id'] }, TContext>({
    mutationFn: async ({ id }) => {
      return deleteProvider(id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}