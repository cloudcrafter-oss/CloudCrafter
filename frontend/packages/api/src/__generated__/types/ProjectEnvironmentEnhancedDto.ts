import type { DeployedStackDto } from './DeployedStackDto'

export type ProjectEnvironmentEnhancedDto = {
  /**
   * @type string, date-time
   */
  environmentCreatedAt: string
  /**
   * @type integer, int32
   */
  deployedStackCount: number
  /**
   * @type string, date-time
   */
  lastDeploymentAt: string | null
  /**
   * @type string
   */
  environmentName: string
  /**
   * @type string
   */
  projectName: string
  /**
   * @type array
   */
  deployedStacks: DeployedStackDto[]
}