import type { CreatedServerDto } from './CreatedServerDto'
import type { CreateServerCommand } from './CreateServerCommand'

/**
 * @description OK
 */
export type CreateServer200 = CreatedServerDto

export type CreateServerMutationRequest = CreateServerCommand

export type CreateServerMutationResponse = CreateServer200

export type CreateServerMutation = {
  Response: CreateServer200
  Request: CreateServerMutationRequest
  Errors: any
}