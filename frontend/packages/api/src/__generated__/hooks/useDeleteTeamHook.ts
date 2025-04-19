import client from '@cloudcrafter/api/client'
import type { DeleteTeamPathParams } from '../types/DeleteTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { deleteTeam } from '../axios-backend/deleteTeam'
import { useMutation } from '@tanstack/react-query'

export const deleteTeamMutationKey = () => [{ url: '/api/Teams/{teamId}' }] as const

/**
 * {@link /api/Teams/:teamId}
 */
export function useDeleteTeamHook<TContext>(
  options: {
    mutation?: UseMutationOptions<void, ResponseErrorConfig<Error>, { teamId: DeleteTeamPathParams['teamId'] }, TContext>
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? deleteTeamMutationKey()

  return useMutation<void, ResponseErrorConfig<Error>, { teamId: DeleteTeamPathParams['teamId'] }, TContext>({
    mutationFn: async ({ teamId }) => {
      return deleteTeam(teamId, config)
    },
    mutationKey,
    ...mutationOptions,
  })
} 