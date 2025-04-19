import type { CreateTeamCommand } from './CreateTeamCommand'

/**
 * @description OK
 */
export type CreateTeam200 = string

export type CreateTeamMutationRequest = CreateTeamCommand

export type CreateTeamMutationResponse = CreateTeam200

export type CreateTeamMutation = {
  Response: CreateTeam200
  Request: CreateTeamMutationRequest
  Errors: any
}