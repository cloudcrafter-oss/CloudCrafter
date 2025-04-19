import client from '@cloudcrafter/api/client'
import type { RenameTeamMutationRequest, RenameTeamMutationResponse, RenameTeamPathParams } from '../types/RenameTeam'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { renameTeam } from '../axios-backend/renameTeam'
import { useMutation } from '@tanstack/react-query'

export const renameTeamMutationKey = () => [{ url: '/api/Teams/{teamId}' }] as const

export type RenameTeamMutationKey = ReturnType<typeof renameTeamMutationKey>

/**
 * {@link /api/Teams/:teamId}
 */
export function useRenameTeamHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      RenameTeamMutationResponse,
      ResponseErrorConfig<Error>,
      { teamId: RenameTeamPathParams['teamId']; data: RenameTeamMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<RenameTeamMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? renameTeamMutationKey()

  return useMutation<
    RenameTeamMutationResponse,
    ResponseErrorConfig<Error>,
    { teamId: RenameTeamPathParams['teamId']; data: RenameTeamMutationRequest },
    TContext
  >({
    mutationFn: async ({ teamId, data }) => {
      return renameTeam(teamId, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}