import client from '@cloudcrafter/api/client'
import type { InviteUserToTeamMutationRequest, InviteUserToTeamMutationResponse, InviteUserToTeamPathParams } from '../types/InviteUserToTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { inviteUserToTeam } from '../axios-backend/inviteUserToTeam'
import { useMutation } from '@tanstack/react-query'

export const inviteUserToTeamMutationKey = () => [{ url: '/api/Teams/{teamId}/invite' }] as const

export type InviteUserToTeamMutationKey = ReturnType<typeof inviteUserToTeamMutationKey>

/**
 * {@link /api/Teams/:teamId/invite}
 */
export function useInviteUserToTeamHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      InviteUserToTeamMutationResponse,
      ResponseErrorConfig<Error>,
      { teamId: InviteUserToTeamPathParams['teamId']; data?: InviteUserToTeamMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<InviteUserToTeamMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? inviteUserToTeamMutationKey()

  return useMutation<
    InviteUserToTeamMutationResponse,
    ResponseErrorConfig<Error>,
    { teamId: InviteUserToTeamPathParams['teamId']; data?: InviteUserToTeamMutationRequest },
    TContext
  >({
    mutationFn: async ({ teamId, data }) => {
      return inviteUserToTeam(teamId, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}