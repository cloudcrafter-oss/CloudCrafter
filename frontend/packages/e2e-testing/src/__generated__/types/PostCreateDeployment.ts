export type PostCreateDeploymentPathParams = {
  /**
   * @type string, uuid
   */
  applicationId: string
}

/**
 * @description OK
 */
export type PostCreateDeployment200 = any

export type PostCreateDeploymentMutationResponse = PostCreateDeployment200

export type PostCreateDeploymentMutation = {
  Response: PostCreateDeployment200
  PathParams: PostCreateDeploymentPathParams
  Errors: any
}