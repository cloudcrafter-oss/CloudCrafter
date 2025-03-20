import type { DeploymentStatusDto } from './DeploymentStatusDto'

export type SimpleDeploymentDto = {
  /**
   * @type string, date-time
   */
  createdAt: string
  /**
   * @type string, date-time
   */
  updatedAt: string
  /**
   * @type string, uuid
   */
  id: string
  state: DeploymentStatusDto
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string
   */
  stackName: string
  /**
   * @type string, uuid
   */
  projectId: string
  /**
   * @type string, uuid
   */
  environmentId: string
  /**
   * @type string
   */
  description?: string | null
}