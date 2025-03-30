import type { DeploymentCreatedDetailsDto } from './DeploymentCreatedDetailsDto'

export type PostDispatchStackDeploymentPathParams = {
  /**
   * @type string, uuid
   */
  id: string
}

/**
 * @description OK
 */
export type PostDispatchStackDeployment200 = DeploymentCreatedDetailsDto

export type PostDispatchStackDeploymentMutationResponse = PostDispatchStackDeployment200

export type PostDispatchStackDeploymentMutation = {
  Response: PostDispatchStackDeployment200
  PathParams: PostDispatchStackDeploymentPathParams
  Errors: any
}