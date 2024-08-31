import type { ApplicationHealthStatus } from './ApplicationHealthStatus'

export type DeployedApplicationDto = {
	/**
	 * @type string, uuid
	 */
	applicationId: string
	/**
	 * @type string
	 */
	name: string
	healthStatus: ApplicationHealthStatus
}
