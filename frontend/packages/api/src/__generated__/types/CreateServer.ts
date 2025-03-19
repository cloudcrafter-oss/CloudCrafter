import type { CreatedServerDto } from './CreatedServerDto'
import type { CreateServerCommandCommand } from './CreateServerCommandCommand'

/**
 * @description OK
 */
export type CreateServer200 = CreatedServerDto

export type CreateServerMutationRequest = CreateServerCommandCommand

export type CreateServerMutationResponse = CreateServer200

export type CreateServerMutation = {
  Response: CreateServer200
  Request: CreateServerMutationRequest
  Errors: any
}