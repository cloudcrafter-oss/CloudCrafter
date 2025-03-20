import type { Request } from './Request'

export type PutUpdateGithubProviderPathParams = {
  /**
   * @type string, uuid
   */
  id: string
}

/**
 * @description OK
 */
export type PutUpdateGithubProvider200 = any

export type PutUpdateGithubProviderMutationRequest = Request

export type PutUpdateGithubProviderMutationResponse = PutUpdateGithubProvider200

export type PutUpdateGithubProviderMutation = {
  Response: PutUpdateGithubProvider200
  Request: PutUpdateGithubProviderMutationRequest
  PathParams: PutUpdateGithubProviderPathParams
  Errors: any
}