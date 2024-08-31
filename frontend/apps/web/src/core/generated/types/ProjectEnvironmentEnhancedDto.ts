import type { DeployedApplicationDto } from './DeployedApplicationDto'

export type ProjectEnvironmentEnhancedDto = {
	/**
	 * @type string, date-time
	 */
	environmentCreatedAt: string
	/**
	 * @type integer, int32
	 */
	deployedApplicationsCount: number
	/**
	 * @type string, date-time
	 */
	lastDeploymentAt?: string | null
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
	deployedApplications: DeployedApplicationDto[]
}
