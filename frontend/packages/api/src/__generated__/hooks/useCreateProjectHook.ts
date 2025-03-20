import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { CreateProjectMutationRequest, CreateProjectMutationResponse } from '../types/CreateProject'
import type { UseMutationOptions } from '@tanstack/react-query'
import { createProject } from '../axios-backend/createProject'
import { useMutation } from '@tanstack/react-query'

export const createProjectMutationKey = () => [{ url: '/api/Projects' }] as const

export type CreateProjectMutationKey = ReturnType<typeof createProjectMutationKey>

/**
 * {@link /api/Projects}
 */
export function useCreateProjectHook<TContext>(
  options: {
    mutation?: UseMutationOptions<CreateProjectMutationResponse, ResponseErrorConfig<Error>, { data: CreateProjectMutationRequest }, TContext>
    client?: Partial<RequestConfig<CreateProjectMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createProjectMutationKey()

  return useMutation<CreateProjectMutationResponse, ResponseErrorConfig<Error>, { data: CreateProjectMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return createProject(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}