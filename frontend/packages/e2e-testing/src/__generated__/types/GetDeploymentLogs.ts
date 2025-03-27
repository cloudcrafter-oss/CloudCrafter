import type { DeploymentLogDto } from './DeploymentLogDto'

export type GetDeploymentLogsPathParams = {
  /**
   * @type string, uuid
   */
  deploymentId: string
}

/**
 * @description OK
 */
export type GetDeploymentLogs200 = DeploymentLogDto[]

export type GetDeploymentLogsQueryResponse = GetDeploymentLogs200

export type GetDeploymentLogsQuery = {
  Response: GetDeploymentLogs200
  PathParams: GetDeploymentLogsPathParams
  Errors: any
}