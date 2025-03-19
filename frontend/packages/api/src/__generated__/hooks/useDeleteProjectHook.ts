import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { DeleteProjectMutationResponse, DeleteProjectPathParams } from '../types/DeleteProject'
import type { UseMutationOptions } from '@tanstack/react-query'
import { deleteProject } from '../axios-backend/deleteProject'
import { useMutation } from '@tanstack/react-query'

export const deleteProjectMutationKey = () => [{ url: '/api/Projects/{id}' }] as const

export type DeleteProjectMutationKey = ReturnType<typeof deleteProjectMutationKey>

/**
 * {@link /api/Projects/:id}
 */
export function useDeleteProjectHook<TContext>(
  options: {
    mutation?: UseMutationOptions<DeleteProjectMutationResponse, ResponseErrorConfig<Error>, { id: DeleteProjectPathParams['id'] }, TContext>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteProjectMutationKey()

  return useMutation<DeleteProjectMutationResponse, ResponseErrorConfig<Error>, { id: DeleteProjectPathParams['id'] }, TContext>({
    mutationFn: async ({ id }) => {
      return deleteProject(id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}