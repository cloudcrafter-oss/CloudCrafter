import client from '@cloudcrafter/api/client'
import type { RemoveUserFromTeamMutationRequest, RemoveUserFromTeamMutationResponse, RemoveUserFromTeamPathParams } from '../types/RemoveUserFromTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { removeUserFromTeam } from '../axios-backend/removeUserFromTeam'
import { useMutation } from '@tanstack/react-query'

export const removeUserFromTeamMutationKey = () => [{ url: '/api/Teams/{teamId}/remove' }] as const

export type RemoveUserFromTeamMutationKey = ReturnType<typeof removeUserFromTeamMutationKey>

/**
 * {@link /api/Teams/:teamId/remove}
 */
export function useRemoveUserFromTeamHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      RemoveUserFromTeamMutationResponse,
      ResponseErrorConfig<Error>,
      { teamId: RemoveUserFromTeamPathParams['teamId']; data: RemoveUserFromTeamMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<RemoveUserFromTeamMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? removeUserFromTeamMutationKey()

  return useMutation<
    RemoveUserFromTeamMutationResponse,
    ResponseErrorConfig<Error>,
    { teamId: RemoveUserFromTeamPathParams['teamId']; data: RemoveUserFromTeamMutationRequest },
    TContext
  >({
    mutationFn: async ({ teamId, data }) => {
      return removeUserFromTeam(teamId, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}