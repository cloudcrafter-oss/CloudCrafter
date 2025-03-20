import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { UpdateProjectMutationRequest, UpdateProjectMutationResponse, UpdateProjectPathParams } from '../types/UpdateProject'
import type { UseMutationOptions } from '@tanstack/react-query'
import { updateProject } from '../axios-backend/updateProject'
import { useMutation } from '@tanstack/react-query'

export const updateProjectMutationKey = () => [{ url: '/api/Projects/{id}' }] as const

export type UpdateProjectMutationKey = ReturnType<typeof updateProjectMutationKey>

/**
 * {@link /api/Projects/:id}
 */
export function useUpdateProjectHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      UpdateProjectMutationResponse,
      ResponseErrorConfig<Error>,
      { id: UpdateProjectPathParams['id']; data?: UpdateProjectMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<UpdateProjectMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? updateProjectMutationKey()

  return useMutation<
    UpdateProjectMutationResponse,
    ResponseErrorConfig<Error>,
    { id: UpdateProjectPathParams['id']; data?: UpdateProjectMutationRequest },
    TContext
  >({
    mutationFn: async ({ id, data }) => {
      return updateProject(id, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}