import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { DeleteServerByIdMutationResponse, DeleteServerByIdPathParams } from '../types/DeleteServerById'
import type { UseMutationOptions } from '@tanstack/react-query'
import { deleteServerById } from '../axios-backend/deleteServerById'
import { useMutation } from '@tanstack/react-query'

export const deleteServerByIdMutationKey = () => [{ url: '/api/Servers/{id}' }] as const

export type DeleteServerByIdMutationKey = ReturnType<typeof deleteServerByIdMutationKey>

/**
 * {@link /api/Servers/:id}
 */
export function useDeleteServerByIdHook<TContext>(
  options: {
    mutation?: UseMutationOptions<DeleteServerByIdMutationResponse, ResponseErrorConfig<Error>, { id: DeleteServerByIdPathParams['id'] }, TContext>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteServerByIdMutationKey()

  return useMutation<DeleteServerByIdMutationResponse, ResponseErrorConfig<Error>, { id: DeleteServerByIdPathParams['id'] }, TContext>({
    mutationFn: async ({ id }) => {
      return deleteServerById(id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}