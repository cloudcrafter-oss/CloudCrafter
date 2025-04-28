import client from '@cloudcrafter/api/client'
import type { CreateTeamMutationRequest, CreateTeamMutationResponse } from '../types/CreateTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { createTeam } from '../axios-backend/createTeam'
import { useMutation } from '@tanstack/react-query'

export const createTeamMutationKey = () => [{ url: '/api/Teams' }] as const

export type CreateTeamMutationKey = ReturnType<typeof createTeamMutationKey>

/**
 * {@link /api/Teams}
 */
export function useCreateTeamHook<TContext>(
  options: {
    mutation?: UseMutationOptions<CreateTeamMutationResponse, ResponseErrorConfig<Error>, { data: CreateTeamMutationRequest }, TContext>
    client?: Partial<RequestConfig<CreateTeamMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createTeamMutationKey()

  return useMutation<CreateTeamMutationResponse, ResponseErrorConfig<Error>, { data: CreateTeamMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return createTeam(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}